# guitarrasdomingofernandez-web

This is a static webpage built with raw **HTML**, **JavaScript**, and **CSS** and deployed entirely on **AWS**.

## Infrastructure provisioning.

This project can be both deployed in `aws` both using manual steps (ClickOps) or using IaaC provisioning (with `CloudFormation`)

### In order to manually deploy the project, follow the following steps:

1. Create a `CloudFront` distribution and add a `custom SSL certificate` to the `CloudFront` distribution (for example, an ACM certificate). Note that in `route 53` the assignation to the `CloudFront` distribution is also necessary: assign the record name with the `CloudFront` Distribution domain name (example: `d3ccausbv8iue6.cloudfront.net`) through Alias type (A type + Alias activated). It is also important that the `CloudFront` distribution has the `S3` website endpoint as origin and not the bucket itself.

2. In order to create the lambda function, we must upload a .zip file into AWS with the following content: `index.mjs` (which can be found in `/lambda/index.mjs`), `package.json`, `package-lock.json` and `node_modules` installed. Finally, set up the environment variables in lambda Configuration > Environment Variables (example environment variables can be found in `.env.example`).

3. Lastly, create a type `HTTP` `API Gateway` with a POST endpoint `/contact` that consumes the email information and passes it onto the Lambda function. It is important to take into account that the Lambda service is, by default, asynchronous (i.e., while the message is being sent we can execute other tasks).

These three steps are fully automated using **CloudFormation** via the files `s3_bucket.yaml`, `cloudfront.yaml`, and `email_lambda_server.yaml`, eliminating the need for manual configuration and reducing the risk of human error.

## Continuous integration

New versions of this project can be deployed using `AWS CLI`. To deploy new versions into `AWS`, use `aws s3 sync src s3://guitarras-domingo-fernandez`.

In order to avoid network caching on the browser, activate option "Disable cache" in Network tab.

To automate deployment, use `./scripts/deploy.sh "BUCKET_NAME" "DISTRIBUTION_ID"` (it works with `AWS CLI` version `aws-cli/2.28.21 Python/3.13.7 Windows/11 exe/AMD64`).


## General information

`src` folder contains all the static files that are used to create the static site, while `lambda` folder contains the script executed by the `AWS` Lambda function. `lambda/lambda_test.json` contains a call to test the lambda function behaviour. `src/index.html` is the entrypoint of the website.

`src/error.html` displays an error page when the `S3` bucket fails to load (i.e., when the issue is on `AWS`'s side).

`src/locales` folder contains the translations to 2 languages (Spanish and English).