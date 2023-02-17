import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

import apiRoutes from './routes/apiRoutes';

const rateLimiter = rateLimit({
	windowMs: 10 * 1000, // 10 seconds
	max: 50, // Limit each IP to 50 requests per `window` (here, per 10 seconds)
	message:
		'Too many requests made from this IP, please try again after 10 seconds',
});

const speedLimiter = slowDown({
	windowMs: 10 * 1000, // 10 seconds
	delayAfter: 1, // delay after the first one
	delayMs: 500, // delay by half a second
});

const PORT = 5000;

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(morgan('dev'));

app.get('/', (req: Request, res: Response) => {
	res.send('Hello from api');
});

app.use('/api', rateLimiter, speedLimiter, apiRoutes);

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
