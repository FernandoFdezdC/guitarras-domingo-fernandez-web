guitarrasdomingofernandez-web

Webpage made with raw HTML, Javascript and CSS to demonstrate how to deploy it into AWS S3.

`error.html`'s function is returning an error page when the bucket is not correctly loaded (i.e., when it is AWS's fault)

To deploy into aws, use `aws s3 sync src s3://guitarras-domingo-fernandez-web`

To automate deployment, use `./scripts/deploy.sh "YOUR_BUCKET_NAME" "YOUR_DISTRIBUTION_ID"`