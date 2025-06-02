# Travel App

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Running Tests

This project uses [Jest](https://jestjs.io/) for unit testing. To run tests:

```bash
npm test
```

## Project Structure

```
src/
  components/      # React components (header, footer, etc.)
  config/          # Configuration files (e.g., db.ts)
  controllers/     # Route controllers
  models/          # Mongoose models
  repositories/    # Data access logic
  services/        # Business logic
  utils/           # Utility functions and helpers
  app/             # Next.js app directory (pages, layouts)
```

## Environment Variables

Create a `.env.local` file in the root with the following (example):

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## Features

- User authentication (JWT)
- Itinerary management (CRUD)
- Responsive UI with React and Tailwind CSS

## Notes

- Uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) for font optimization.
- For testing, Babel is used only by Jest and does not affect Next.js builds.

---
