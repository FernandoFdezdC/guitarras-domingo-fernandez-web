guitarrasdomingofernandez-web

Webpage made with raw HTML, Javascript and CSS to demonstrate how to deploy it into AWS S3.

`error.html`'s function is returning an error page when the bucket is not correctly loaded (i.e., when it is AWS's fault)

To deploy into aws, use `aws s3 sync src s3://guitarras-domingo-fernandez-web`

In order to avoid network caching on the browser, activate option "Disable cache" in Network tab.

To automate deployment, use `./scripts/deploy.sh "YOUR_BUCKET_NAME" "YOUR_DISTRIBUTION_ID"`

Create a CloudFront distribution and assing an URL with Alias type (A type + Alias activated) to the CloudFront distribution domain name (example: `d3ccausbv8iue6.cloudfront.net`) and add an alternate domain name to CloudFront with an ACM certificate.

In order to create the lambda function, we must upload a .zip file into AWS with the following content: `index.mjs` (which can be found in `/lambda/index.mjs`), `package.json`, `package-lock.json` and `node_modules` installed. Finally, set up the environment variables in lambda Configuration > Environment Variables (example environment variables can be found in `.env.example`).