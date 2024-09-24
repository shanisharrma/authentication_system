import { Router } from 'express';
import v1Routes from './v1'; // Importing version 1 routes.
import { UserRepository } from '../repositories';
import { Account_Confirmation, Phone_Number, Role } from '../database';

const router = Router(); // Creating a new Express router instance.

/**
 * Mounting v1 routes under the /v1 path.
 *
 * This file serves as the entry point for API versioning.
 * Potential Enhancements:
 * 1. Add support for additional API versions (e.g., /v2) as the project expands.
 * 2. Implement middleware for logging, authentication, or rate limiting to enhance security and monitoring.
 * 3. Consider adding a versioning strategy for backwards compatibility as the API evolves.
 *
 */
// Mounting v1 routes under the /v1 path.
router.use('/v1', v1Routes);

router.get('/get-user', async (_, res) => {
    const userRepo = new UserRepository();

    res.status(200).json({
        user: await userRepo.getAllUsersWithPassword({
            include: [
                { model: Role, required: true, as: 'roles' },
                { model: Phone_Number, required: true, as: 'phoneNumber' },
                { model: Account_Confirmation, required: true, as: 'accountConfirmation' },
            ],
        }),
    });
});

export default router; // Exporting the router for use in the main application.
