

import express from 'express';
const router = express.Router();
import {createAuction ,getupcomingAuctions} from '../controllers/auction.controller.js';

// Get all players
router.get('/', getupcomingAuctions);

// Create a new player
router.post('/', createAuction);


export  default router;