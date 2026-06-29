# Pranajeewa Ayurveda Booking Platform

Production-ready full-stack booking website for **Pranajeewa**, a traditional Sri Lankan Ayurveda treatment center.

## Features

- Premium responsive public website built with React, Vite, Tailwind CSS, Framer Motion, and React Router.
- Home page with animated logo, sticky navigation, Ayurveda hero, news carousel, about preview, treatment cards, and footer contact details.
- About page with heritage copy, image sections, and timeline layout.
- Treatments listing, treatment detail pages, and booking form.
- Google customer login, editable customer profile, profile-gated bookings, treatment history, and customer cancellation.
- Separate secure admin dashboard for treatment CRUD, booking status management, clients, blacklists, income reports, reviews, and news banner management.
- Express API with MongoDB Atlas, Mongoose models, JWT auth, password hashing, validation, Helmet, rate limiting, CORS protection, and image upload support.

## Project Structure

```text
prana-jeewa/
  admin/      Admin React dashboard
  client/     Public React website
  server/     Express and MongoDB API
  uploads/    Uploaded treatment and banner images
```

## Environment Setup

Copy the example environment files:

```bash
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env
cp admin/.env.example admin/.env
```

Update `server/.env` with your MongoDB Atlas password and a strong `JWT_SECRET`.

```env
MONGO_URI=mongodb://pranajewabooking_db_user:<db_password>@ac-brmri5n-shard-00-00.xfmb913.mongodb.net:27017,ac-brmri5n-shard-00-01.xfmb913.mongodb.net:27017,ac-brmri5n-shard-00-02.xfmb913.mongodb.net:27017/pranajeewa?ssl=true&replicaSet=atlas-1ablzu-shard-0&authSource=admin&appName=Cluster0
JWT_SECRET=replace-with-a-long-random-secret
```

Set the first admin account before seeding:

```env
ADMIN_NAME=Pranajeewa Admin
ADMIN_EMAIL=admin@pranajeewa.lk
ADMIN_PASSWORD=ChangeMe123!
```

Customer Google login requires a Google OAuth web client ID. Use the same client ID in both the API and public website environments:

```env
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

For production image uploads, set Cloudinary credentials in the API environment. Uploaded treatment and news banner files will be stored in Cloudinary, while MongoDB stores only the resulting image URL.

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=sethsuwa
```

## Install

From the project root:

```bash
npm install --prefix server
npm install --prefix client
npm install --prefix admin
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`:

```powershell
npm.cmd install --prefix server
npm.cmd install --prefix client
npm.cmd install --prefix admin
```

## Seed Admin

```bash
npm run seed:admin --prefix server
```

## Seed Treatments

The project includes the initial Pranajeewa treatment catalog with wellness, clinic, beauty, and sport massage therapy services.

```bash
npm run seed:treatments --prefix server
```

## Development

Run each app in a separate terminal:

```bash
npm run dev --prefix server
npm run dev --prefix client
npm run dev --prefix admin
```

Default local URLs:

- Public website: `http://localhost:5173`
- Admin dashboard: `http://localhost:5174`
- API: `http://localhost:5000/api`

## Production Build

```bash
npm run build --prefix client
npm run build --prefix admin
npm start --prefix server
```

Deploy `client/dist` and `admin/dist` to your frontend hosting provider. Deploy `server` to a Node.js host with the production environment variables configured.

## Main API Routes

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/customer-auth/google`
- `GET /api/customers/me`
- `PUT /api/customers/me`
- `GET /api/customers/me/bookings`
- `GET /api/customers/admin/all`
- `PATCH /api/customers/:id/blacklist`
- `GET /api/treatments`
- `GET /api/treatments/:idOrSlug`
- `POST /api/treatments`
- `PUT /api/treatments/:id`
- `DELETE /api/treatments/:id`
- `POST /api/bookings`
- `GET /api/bookings/my`
- `PATCH /api/bookings/:id/cancel`
- `GET /api/bookings/admin/all`
- `PATCH /api/bookings/:id/status`
- `GET /api/reports/income`
- `GET /api/news-banners`
- `GET /api/news-banners/admin/all`
- `POST /api/news-banners`
- `PUT /api/news-banners/:id`
- `DELETE /api/news-banners/:id`
- `POST /api/reviews`
- `GET /api/reviews/treatment/:treatmentId`
- `GET /api/reviews/admin/all`
- `PATCH /api/reviews/:id/status`
- `PATCH /api/reviews/:id/reply`
- `DELETE /api/reviews/:id`

Admin-only routes require:

```http
Authorization: Bearer <jwt-token>
```

## Deployment Notes

- Keep `.env` files out of git.
- Use HTTPS in production.
- Set `CLIENT_URL`, `ADMIN_URL`, and `CORS_ORIGINS` to the deployed frontend domains.
- Use a strong `JWT_SECRET`.
- Configure Cloudinary or another cloud media service for production image uploads.
- See `DEPLOYMENT.md` for the free Render hosting setup.
