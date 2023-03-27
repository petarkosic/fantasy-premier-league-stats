import { Router } from 'express';
import {
	callApi,
	getPlayer,
	getPlayerImage,
	getPlayerSummary,
} from '../controllers/apiController';
import { getTeamImage } from '../controllers/teamController';

const router = Router();

router.get('/stats', callApi);
router.get('/player/:code', getPlayer);
router.get('/player-summary/:id', getPlayerSummary);
router.get('/players/:code', getPlayerImage);
router.get('/team/:code', getTeamImage);

export default router;
