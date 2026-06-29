# Free Hosting Guide

This project is prepared for free hosting on Render:

- `sethsuwa-api`: Node.js Express API
- `sethsuwa-ayurveda`: public customer website
- `sethsuwa-admin`: admin dashboard

## Before Deploying

The repository must be uploaded to GitHub first. The local folder is not currently a valid git repository, so create one before connecting it to Render.

Do not upload `.env` files. They are already ignored by `.gitignore`.

## Option A: Render Blueprint

1. Push this project to a GitHub repository.
2. Open Render Dashboard.
3. Select **New +** then **Blueprint**.
4. Connect the GitHub repository.
5. Render will detect `render.yaml` and create three services.
6. For `sethsuwa-api`, add the required secret environment variable:

```text
MONGO_URI=<your MongoDB Atlas connection string>
```

Render will generate `JWT_SECRET` automatically.

For Google customer login, add the same OAuth web client ID to the API and public site:

```text
sethsuwa-api: GOOGLE_CLIENT_ID=<your Google OAuth client ID>
sethsuwa-ayurveda: VITE_GOOGLE_CLIENT_ID=<your Google OAuth client ID>
```

For permanent admin image uploads, also add these Cloudinary environment variables to `sethsuwa-api`:

```text
CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>
CLOUDINARY_API_KEY=<your Cloudinary API key>
CLOUDINARY_API_SECRET=<your Cloudinary API secret>
CLOUDINARY_FOLDER=sethsuwa
```

## Expected Free URLs

If these service names are available, the app URLs should be:

```text
API:   https://sethsuwa-api.onrender.com
Site:  https://sethsuwa-ayurveda.onrender.com
Admin: https://sethsuwa-admin.onrender.com
```

If Render assigns different URLs, update:

- API service: `CLIENT_URL`, `ADMIN_URL`, `CORS_ORIGINS`
- Site service: `VITE_API_URL`
- Admin service: `VITE_API_URL`

Then redeploy the affected services.

## Important Free Hosting Notes

- Render free web services sleep after inactivity. The first API request after sleep can take around a minute.
- This repository includes a GitHub Actions keep-awake workflow that pings the API every 10 minutes. This can reduce cold starts, but it consumes Render free instance hours.
- Render free disk storage is not suitable for permanent uploads. Configure Cloudinary for production news/treatment image uploads.
- MongoDB Atlas must allow Render connections. If Atlas IP allowlist blocks Render, use `0.0.0.0/0` for testing, then tighten security later if needed.
- The admin user already exists in the current MongoDB database because the seed script was run locally.

## Manual Render Setup

If Blueprint deploy does not work, create services manually:

### API Web Service

```text
Root Directory: server
Runtime: Node
Build Command: npm ci
Start Command: npm start
Health Check Path: /api/health
```

Environment variables:

```text
NODE_ENV=production
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<strong random secret>
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=<your Google OAuth client ID>
CLIENT_URL=https://your-site-url
ADMIN_URL=https://your-admin-url
CORS_ORIGINS=https://your-site-url,https://your-admin-url
UPLOAD_DIR=uploads
CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>
CLOUDINARY_API_KEY=<your Cloudinary API key>
CLOUDINARY_API_SECRET=<your Cloudinary API secret>
CLOUDINARY_FOLDER=sethsuwa
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=120
```

### Public Static Site

```text
Root Directory: client
Build Command: npm ci && npm run build
Publish Directory: dist
VITE_API_URL=https://your-api-url/api
VITE_GOOGLE_CLIENT_ID=<your Google OAuth client ID>
```

Add an SPA rewrite:

```text
/* -> /index.html
```

### Admin Static Site

```text
Root Directory: admin
Build Command: npm ci && npm run build
Publish Directory: dist
VITE_API_URL=https://your-api-url/api
```

Add an SPA rewrite:

```text
/* -> /index.html
```
