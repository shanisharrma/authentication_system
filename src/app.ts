import express from 'express';
import path from 'path';
import apiRoutes from './routes'; // Importing API routes
import { GlobalErrorHandler, NotFoundErrorHandler } from './middlewares'; // Importing error handling middlewares
import helmet from 'helmet'; // Security middleware for setting HTTP headers
import cors from 'cors'; // Middleware for enabling CORS
import cookieParser from 'cookie-parser';

const app = express(); // Create an Express application

// Middlewares
app.use(helmet()); // Protects against common vulnerabilities by setting HTTP headers
app.use(cookieParser());
app.use(
    cors({
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'], // Allowed HTTP methods
        origin: ['https://client.com'], // Whitelist for allowed origins
        credentials: true, // Allow credentials in CORS requests
    }),
);
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, '../', 'public'))); // Serve static files from the 'public' directory

// Routes
app.use('/api', apiRoutes); // Use the imported routes under the '/api' endpoint

// 404 (Not Found) Error Handler
app.use(NotFoundErrorHandler); // Handle 404 errors

// Global Error Handler Middleware
app.use(GlobalErrorHandler); // Handle all other errors

export default app; // Export the app instance for use in other modules
