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

export const getPlayerImage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const code = req.params;

	try {
		const response = await axios.get(
			`https://resources.premierleague.com/premierleague/photos/players/110x140/p${code}.png`
		);
		res.status(200).json({
			image: response,
		});
	} catch (err) {
		const error = err as Error;
		console.error(error.message);
	}
};

export const getPlayer = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const code = req.params;

	try {
		const response = await axios.get(
			'https://fantasy.premierleague.com/api/bootstrap-static/'
		);
		let filteredPlayer = response.data.elements.filter(
			(el) => el.code === parseInt(code.code)
		);

		res.status(200).json({
			player: filteredPlayer,
		});
	} catch (err) {
		const error = err as Error;
		console.error(error.message);
	}
};
