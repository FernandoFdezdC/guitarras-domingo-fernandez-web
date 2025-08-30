BUCKET_NAME=$1
DISTRIBUTION_ID=$2

echo "-- Deploy --"
# Sync build with our S3 bucket
aws s3 sync src s3://$BUCKET_NAME
# Invalidate cache
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*" --no-cli-pager