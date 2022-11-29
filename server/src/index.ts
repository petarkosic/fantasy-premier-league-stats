import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import apiRoutes from './routes/apiRoutes';
const PORT = 3000;

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(morgan('dev'));

app.get('/', (req: Request, res: Response) => {
	res.send('Hello from api');
});

app.use('/api', apiRoutes);

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
