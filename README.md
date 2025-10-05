# guitarras-domingo-fernandez-web

### Simple website programmed using different technologies

- On this branch, `master`, the project is made using Javascript `Next.js` framework.

- On the `develop-static-site` branch, the same project is executed but as a static page using Javascript Vanilla and deploying it using `AWS` `S3`, `CloudFront`, `AWS` `Lambda` and `API Gateway` for the email sending functionality. The infrastructure provisioning is automated using `CloudFormation`.

- Finally, on the `develop-static-site-react` branch, the same project is executed but as a static page using React and deploying it using `AWS` `S3`, `CloudFront`, `AWS` `Lambda`  and `API Gateway` for the email sending functionality. The infrastructure provisioning is also automated using `CloudFormation`.

`API Gateway` ensures the scalability of the API requests, being able to adapt to varying workloads.

## About this branch

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm install --ignore-scripts
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Production Deployment

To put the application into production, it must be configured with **PM2** and a web server such as **Nginx** or **Apache**.  
It will be necessary to install PM2 and the production dependencies:

```bash
sudo npm install pm2 -g

cd /ruta_absoluta/guitarras-domingo-fernandez-web
npm run build
pm2 start npm  --name "guitarras-domingo-fernandez-web" -- start -- --port=3001 # Starts a process with pm2 listening on port 3001
pm2 save # Saves the current configuration to disk
pm2 startup # Analyzes the system to enable pm2 as a daemon
# In the case of Ubuntu with systemctl, it asks to run the following
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

To run the service in **production mode** using Docker, execute:

```bash
docker build --no-cache -t guitarras-domingo-fernandez-web-image .
docker run -d --name guitarras-domingo-fernandez-web-container -p 3000:3000 guitarras-domingo-fernandez-web-image
```


### How to add relative path functionality to a Next.js project

In order to add relative path functionality, add the following to the `"compiler options"` in the `tsconfig.json` file:

```bash
"paths": {
  "@/*": ["./src/*"]
}
```

The language selector conforms to the regulation of Article 22.2 of the LSSI regarding cookies.

## Apache Configuration

You can configure an Apache vhost by enabling the proxy module:

```bash
sudo a2enmod proxy proxy_http
```

Then, add a vhost:

```typescript
<VirtualHost *:80>
    ServerAdmin web@example.com
    ServerName example.com
    ServerAlias www.example.com 

    ProxyRequests off

    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>

    <Location />
        ProxyPass http://localhost:3001/
        ProxyPassReverse http://localhost:3001/
    </Location>
</VirtualHost>
```

To change your GitHub credentials and verify:
```bash
git remote set-url origin https://ghp_J4Npl...@github.com/FernandoFdezdC/guitarras-domingo-fernandez-web.git
git remote -v
```