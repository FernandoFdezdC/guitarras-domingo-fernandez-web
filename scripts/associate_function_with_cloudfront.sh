#!/bin/bash
set -e

# -------------------------------
# Usage:
#   ./associate-lambda-edge.sh <DISTRIBUTION_ID> <LAMBDA_ARN>
# Example:
#   ./associate-lambda-edge.sh E2GK4P53WS8KMT arn:aws:lambda:us-east-1:800425446766:function:SecurityHeadersLambdaEdge:1
# -------------------------------

if [ $# -ne 2 ]; then
  echo "Usage: $0 <DISTRIBUTION_ID> <LAMBDA_ARN>"
  exit 1
fi

DISTRIBUTION_ID=$1
LAMBDA_ARN=$2

VERSION_SUFFIX=$(echo "$LAMBDA_ARN" | awk -F: '{print $NF}')

echo "✅ Ensuring Lambda@Edge has the required permission..."
aws lambda add-permission \
  --function-name "$LAMBDA_ARN" \
  --statement-id "AllowExecutionFromCloudFront-$VERSION_SUFFIX" \
  --action "lambda:GetFunction" \
  --principal edgelambda.amazonaws.com \
  --region us-east-1 \
  || echo "Permission already exists, continuing..."

echo "Fetching current CloudFront distribution config for $DISTRIBUTION_ID..."
ETAG=$(aws cloudfront get-distribution-config \
  --id "$DISTRIBUTION_ID" \
  --query ETag --output text)

echo "Modifying distribution configuration to add Lambda@Edge association..."
aws cloudfront get-distribution-config \
  --id "$DISTRIBUTION_ID" \
  --output json \
| jq --arg arn "$LAMBDA_ARN" '
  .DistributionConfig.DefaultCacheBehavior.LambdaFunctionAssociations = {
    Quantity: 1,
    Items: [
      {
        EventType: "viewer-response",
        LambdaFunctionARN: $arn
      }
    ]
  }' \
| jq -c .DistributionConfig \
| aws cloudfront update-distribution \
    --id "$DISTRIBUTION_ID" \
    --if-match "$ETAG" \
    --distribution-config file:///dev/stdin

echo "✅ Lambda@Edge function successfully associated!"
echo "🕒 It may take 10–15 minutes for the update to propagate globally."