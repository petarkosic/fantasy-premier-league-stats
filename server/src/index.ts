import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
const PORT = 3000;

dotenv.config();

const app: Express = express();

app.use(cors());

app.get('/', (req: Request, res: Response) => {
	res.send('Hello from api');
});

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
