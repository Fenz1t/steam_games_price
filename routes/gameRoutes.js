import express from 'express';
import { getPrice } from '../controller/gameController.js';

const router = express.Router();

// Маршрут для получения цены игры по appid
router.get('/get-price', getPrice);

export default router;