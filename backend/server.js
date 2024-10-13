/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path'; // Correctly import the path module
import { fileURLToPath } from 'url'; // Import for ES module path resolution

dotenv.config();

//api Routes
import apiRoutes from './Routes/v2/ApiRoutes/apiRoutes.routes.js';
import { restoreScheduledJobs } from './controllers/v2/controllers/tenant.controller.js';
import verifyJWT from './middleware/jwtMiddleware.js';

const app = express();
const port = process.env.PORT || 5500;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(express.json()); // To handle JSON data
app.use(express.urlencoded({ extended: true })); // To handle form data
app.use(cookieParser());

// Serve the static files from the React app (after building it)
const __filename = fileURLToPath(import.meta.url); // Get the filename
const __dirname = path.dirname(__filename); // Get the directory name

app.use(express.static(path.join(__dirname, '../dist')));

// Apply the JWT middleware globally (except for /api/auth)
app.use(verifyJWT);

// DB connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Success db connection');
    // Call to restore any scheduled jobs on server startup
    restoreScheduledJobs();

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log('Error connecting to db: ', err);
  });

//api Routes
app.use('/api', apiRoutes);

// Handle any other routes and serve index.html (React's entry point)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});
