# guitarras-domingo-fernandez website

On this branch, the project is made using the Next.js framework.

In order to add relative path functionality, add the following to the `"compiler options"` in the `tsconfig.json` file:

```bash
"paths": {
  "@/*": ["./src/*"]
}
```

The language selector conforms to the regulation of Article 22.2 of the LSSI regarding cookies.

On the `develop-static-site` branch, the same project is executed but as a static page using Javascript Vanilla and deploying it using AWS S3, CloudFront and AWS Lambda. The infrastructure provisioning is automated using CloudFormation.