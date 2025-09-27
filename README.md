guitarrasdomingofernandez-web

Webpage made with raw HTML, Javascript and CSS to demonstrate how to deploy it into AWS S3.

`error.html`'s function is returning an error page when the bucket is not correctly loaded (i.e., when it is AWS's fault)

To deploy into aws, use `aws s3 sync src s3://guitarras-domingo-fernandez`

In order to avoid network caching on the browser, activate option "Disable cache" in Network tab.

To automate deployment, use `./scripts/deploy.sh "YOUR_BUCKET_NAME" "YOUR_DISTRIBUTION_ID"` (it works with `AWS CLI` version `aws-cli/2.28.21 Python/3.13.7 Windows/11 exe/AMD64`).

Create a CloudFront distribution and add a `custom SSL certificate` to the CloudFront distribution (for example, an ACM certificate). Note that in `route 53` the assignation to the CloudFront distribution is also necessary: assign the record name with the CloudFront Distribution domain name (example: `d3ccausbv8iue6.cloudfront.net`) through Alias type (A type + Alias activated). It is also important that the CloudFront distribution has the S3 website endpoint as origin and not the bucket itself.

In order to create the lambda function, we must upload a .zip file into AWS with the following content: `index.mjs` (which can be found in `/lambda/index.mjs`), `package.json`, `package-lock.json` and `node_modules` installed. Finally, set up the environment variables in lambda Configuration > Environment Variables (example environment variables can be found in `.env.example`).

Lastly, create a type HTTP API Gateway with a POST endpoint /contact that consumes the email information and passes it onto the Lambda function. It is important to take into account that the Lambda service is, by default, asynchronous (i.e., while the message is being sent we can execute other tasks).