import { Router } from 'express';
import {
	callApi,
	getPlayer,
	getPlayerDataId,
	getPlayerHeatmap,
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
router.post('/player-data', getPlayerDataId);
router.post('/player-heatmap', getPlayerHeatmap);

export default router;
