import { Router } from 'express';
import {
	callApi,
	getPlayer,
	getPlayerImage,
	getPlayerSummary,
} from '../controllers/apiController';

const router = Router();

router.get('/stats', callApi);
router.get('/player/:code', getPlayer);
router.get('/player-summary/:id', getPlayerSummary);
router.get('/players/:code', getPlayerImage);

export default router;
