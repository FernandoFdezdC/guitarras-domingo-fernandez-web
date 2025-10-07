# guitarras-domingo-fernandez-web

This is a static webpage built with **React** and deployed entirely on **AWS**.

## Infrastructure provisioning.

This project can be both deployed in `aws` both using manual steps (ClickOps) or using IaaC provisioning (with `CloudFormation`)

### In order to manually deploy the project, follow the following steps:

1. Create a `CloudFront` distribution and add a `custom SSL certificate` to the `CloudFront` distribution (for example, an ACM certificate). Note that in `route 53` the assignation to the `CloudFront` distribution is also necessary: assign the record name with the `CloudFront` Distribution domain name (example: `d3ccausbv8iue6.cloudfront.net`) through Alias type (A type + Alias activated). It is also important that the `CloudFront` distribution has the `S3` website endpoint as origin and not the bucket itself.

2. Create a lambda function with node.js environment.

3. Lastly, create a type `HTTP` `API Gateway` with a POST endpoint `/contact` that consumes the email information and passes it onto the Lambda function. It is important to take into account that the Lambda service is, by default, asynchronous (i.e., while the message is being sent we can execute other tasks).

These three steps are fully automated using **CloudFormation** via the files `s3_bucket.yaml`, `cloudfront.yaml`, and `email_lambda_server.yaml`, eliminating the need for manual configuration and reducing the risk of human error.

## Continuous integration

New versions of this project can be deployed using `AWS CLI`. To deploy new versions into `AWS`, use `aws s3 sync build s3://guitarras-domingo-fernandez`.

In order to avoid network caching on the browser, activate option "Disable cache" in Network tab.

To automate deployment with `CloudFront`, use `./scripts/deploy.sh "BUCKET_NAME" "DISTRIBUTION_ID"` (it works with `AWS CLI` version `aws-cli/2.28.21 Python/3.13.7 Windows/11 exe/AMD64`).

Note that the lambda function from the `email_lambda_server.yaml` file is not created with correct code. The correct code must be updated afterwards.

In order to update the lambda function's code, we must upload a .zip file into AWS with the following content: `index.mjs`, `package.json`, `package-lock.json` (these 3 files can be found in `/lambda` folder) and `node_modules` installed (to obtain that, just execute `npm install --ignore-scripts` inside the `lambda` folder). Finally, set up the environment variables in lambda `Configuration > Environment Variables`.


## General information

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In particular, this app was created executing:

```bash
npx create-react-app my-app
cd my-app
npm start
```

`src` folder contains the application. The static files can be obtained executing

```bash
npm run build
```

Then, `npm install -D tailwindcss postcss autoprefixer` was executed to install Tailwind in this project.

Then, we synchronized the static files generated in `/build` folder with `AWS` bucket using `aws s3 sync build s3://guitarras-domingo-fernandez`.

The `lambda` folder contains the script executed by the `AWS` Lambda function. `src/index.html` is the entrypoint of the website.

`public/error.html` displays an error page when the `S3` bucket fails to load (i.e., when the issue is on `AWS`'s side). In the case of a React app, the error document must be set to `index.html`, since React is a single-page application (SPA) that handles routing client-side, and any unknown path requested directly from the server should still load the same HTML file so that React's router can render the correct view.

`src/locales` folder contains the translations to 2 languages (Spanish and English).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Troubleshooting `CloudFront` distribution `ERR_SSL_VERSION_OR_CIPHER_MISMATCH` error

Sometimes, CloudFront distribution can fail to load the SSL certificate. It can be troubleshooted using:

```bash
# Generic test
openssl s_client -connect guitarras-domingo-fernandez.es:443 -servername guitarras-domingo-fernandez.es
# Force TLS 1.2
openssl s_client -connect guitarras-domingo-fernandez.es:443 -servername guitarras-domingo-fernandez.es -tls1_2
# Force TLS 1.3
openssl s_client -connect guitarras-domingo-fernandez.es:443 -servername guitarras-domingo-fernandez.es -tls1_3
```

Then, the problem may be solved ensuring that the domain is in the `Alternate Domain Name` field in the CloudFront distribution.


## Troubleshooting email errors

Email error can be produced on the side of the `lambda` or on the side of the `API Gateway`. `lambda/lambda_test.json` contains a call to test the lambda function behaviour in the Lambda dashboard, like this:

![alt text](image.png)

`lambda/test_curl.sh` contains a test cURL call to test the API Gateway (remember to change the API URL) with correct parameters.