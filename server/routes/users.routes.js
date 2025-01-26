import express from 'express';
const router = express.Router();
import { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, loginUser, getProfile, pruchasedPlayer } from '../controllers/users.controller.js'
import { validateToken } from '../helper/middleware.js';


// Get all users

router.get('/', getAllUsers);

// Create a new user

router.post('/', createUser);

router.get('/getPurchasedPlayer',validateToken, pruchasedPlayer);
// Get a single user by ID

// Update a user by ID

router.patch('/:id', updateUserById);

// Delete a user by ID

router.delete('/:id', deleteUserById);

router.post('/login', loginUser);

router.get('/profile', validateToken, getProfile);



export default router;