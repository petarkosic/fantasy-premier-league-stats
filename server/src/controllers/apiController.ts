// @ts-nocheck
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
	const { code } = req.params;

	try {
		const response = await axios.get(
			`https://resources.premierleague.com/premierleague/photos/players/110x140/p${code}.png`
		);
		res.status(200).json({
			image: response.config.url,
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
	const { code } = req.params;

	try {
		const response = await axios.get(
			'https://fantasy.premierleague.com/api/bootstrap-static/'
		);
		let filteredPlayer = response.data.elements.filter(
			(el) => el.code === parseInt(code)
		);

		res.status(200).json({
			player: filteredPlayer,
		});
	} catch (err) {
		const error = err as Error;
		console.error(error.message);
	}
};

export const getPlayerSummary = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;

	try {
		const response = await axios.get(
			`https://fantasy.premierleague.com/api/element-summary/${parseInt(id)}/`
		);

		res.status(200).json({
			playerSummary: response.data,
		});
	} catch (err) {
		const error = err as Error;
		console.error(error.message);
	}
};

export const getPlayerDataId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { webName, secondName } = req.body.data;

	try {
		const response = await axios.request({
			method: 'GET',
			url: process.env.RapidAPI_Url,
			params: {
				query: `${webName} ${secondName}`,
				group: 'players',
			},
			headers: {
				'X-RapidAPI-Key': process.env.X_RapidAPI_Key,
				'X-RapidAPI-Host': process.env.X_RapidAPI_Host,
				'Content-Type': 'application/json',
				'accept-encoding': '*',
			},
		});

		res.status(200).json({
			playerDataId: response.data.data[0].id,
		});
	} catch (err) {
		const error = err as Error;
		console.error(error.message);
	}
};

export const getPlayerHeatmap = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { playerId } = req.body.data;
	let uniqueTournamentId: number = 17;
	let seasonId: number = 41886;

	try {
		const response = await axios.request({
			method: 'GET',
			url: process.env.RapidAPI_Heatmap_Url,
			params: {
				player_id: playerId,
				unique_tournament_id: uniqueTournamentId,
				seasons_id: seasonId,
			},
			headers: {
				'X-RapidAPI-Key': process.env.X_RapidAPI_Key,
				'X-RapidAPI-Host': process.env.X_RapidAPI_Host,
				'Content-Type': 'application/json',
				'accept-encoding': '*',
			},
		});

		res.status(200).json({
			playerDataHeatmapPoints: response.data.data.points,
		});
	} catch (err) {
		const error = err as Error;
		console.error(error.message);
	}
};
