import { Router } from 'express';
import { callApi, getPlayerImage } from '../controllers/apiController';

const router = Router();

router.get('/stats', callApi);
router.get('/players/:code', getPlayerImage);

export default router;
