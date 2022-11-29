import { Router } from 'express';
import { callApi } from '../controllers/apiController';

const router = Router();

router.get('/stats', callApi);

export default router;
