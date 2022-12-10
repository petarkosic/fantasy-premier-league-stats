import { Router } from 'express';
import {
	callApi,
	getPlayer,
	getPlayerImage,
} from '../controllers/apiController';

const router = Router();

router.get('/stats', callApi);
router.get('/player/:code', getPlayer);
router.get('/players/:code', getPlayerImage);

export default router;
