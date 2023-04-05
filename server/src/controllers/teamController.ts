// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

type Error = {
	message: string;
};

export const getTeamImage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { code } = req.params;

	try {
		const response = await axios.get(
			`https://resources.premierleague.com/premierleague/badges/70/t${code}.png`
		);
		let teamImage = response.config.url;

		res.status(200).json({
			teamImage,
		});
	} catch (err) {
		const error = err as Error;
		console.error(error.message);
	}
};
