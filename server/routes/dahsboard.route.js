
import express from 'express';
const router = express.Router();


import {getSuymmary} from '../controllers/dashboard.controller.js';

router.get('/', getSuymmary);


export default router;
