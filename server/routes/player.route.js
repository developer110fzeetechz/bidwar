

import express from 'express';
const router = express.Router();
import {createPlayer ,getAllPlayer, getsinglePlayer} from '../controllers/player.controller.js';

// Get all players
router.get('/', getAllPlayer);

// Create a new player
router.post('/', createPlayer);

router.get('/player/:id',getsinglePlayer)


export  default router;