import express from 'express';
import { ApiController } from '../../controllers';
import authRoutes from './auth-routes';

// Creating an Express router instance.
const router = express.Router();

// Defining routes for the API.
router.route('/self').get(ApiController.self); // Route for self endpoint.
router.route('/health').get(ApiController.health); // Route for health check.

// Auth Routes
router.use(authRoutes);

export default router; // Exporting the router for use in the main application.
