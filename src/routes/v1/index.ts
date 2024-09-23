import express from 'express';
import { ApiController } from '../../controllers';

// Creating an Express router instance.
const router = express.Router();

// Defining routes for the API.
router.route('/self').get(ApiController.self); // Route for self endpoint.
router.route('/health').get(ApiController.health); // Route for health check.

export default router; // Exporting the router for use in the main application.
