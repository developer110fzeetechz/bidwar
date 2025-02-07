

import express from 'express';
const router = express.Router();
import {createAuction ,getSingleAuction,getupcomingAuctions} from '../controllers/auction.controller.js';

// Get all players
router.get('/', getupcomingAuctions);

// Create a new player
router.post('/', createAuction);

router.get('/singleAuction/:id',getSingleAuction)


export  default router;