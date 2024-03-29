import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import apiRoutes from './routes/apiRoutes';
import MonitoringService from './services/MonitoringService';

const rateLimiter = rateLimit({
	windowMs: 10 * 1000, // 10 seconds
	max: 50, // Limit each IP to 50 requests per `window` (here, per 10 seconds)
	message:
		'Too many requests made from this IP, please try again after 10 seconds',
});

const PORT = process.env.PORT || 5000;

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req: Request, res: Response) => {
	res.send('Hello from api');
});

app.get('/metrics', async (req: Request, res: Response) => {
	const metrics = await MonitoringService.getPrometheusMetrics();
	res.set('Content-Type', MonitoringService.getRegistry().contentType);
	res.end(metrics);
});

app.use('/api', rateLimiter, apiRoutes);

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
