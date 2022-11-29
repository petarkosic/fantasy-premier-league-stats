import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

type Error = {
	message: string;
};

export const callApi = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const response = await axios.get(
			'https://fantasy.premierleague.com/api/bootstrap-static/'
		);
		res.status(200).json({
			stats: response.data,
		});
	} catch (err) {
		const error = err as Error;
		console.error(error.message);
	}
};
