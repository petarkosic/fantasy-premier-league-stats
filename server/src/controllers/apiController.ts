import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import MonitoringService from '../services/MonitoringService';

type Error = {
	message: string;
};

export const callApi = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const startTime = process.hrtime();

	try {
		const response = await axios.get(
			'https://fantasy.premierleague.com/api/bootstrap-static/'
		);

		MonitoringService.incrementSuccessfulRequests(req.route.path);

		res.status(200).json({
			stats: response.data,
		});
	} catch (err) {
		MonitoringService.incrementFailedRequests(req.route.path);
		const error = err as Error;
		console.error(error.message);
	} finally {
		const endTime = process.hrtime(startTime);
		const durationInSeconds = endTime[0] + endTime[1] / 1e9;
		MonitoringService.recordRequestDuration(durationInSeconds);
		MonitoringService.recordRouteRequestDuration('/stats', durationInSeconds);
	}
};

export const getPlayerImage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { code } = req.params;
	const startTime = process.hrtime();

	try {
		const response = await axios.get(
			`https://resources.premierleague.com/premierleague/photos/players/110x140/p${code}.png`
		);

		MonitoringService.incrementSuccessfulRequests(req.route.path);

		res.status(200).json({
			image: response.config.url,
		});
	} catch (err) {
		MonitoringService.incrementFailedRequests(req.route.path);
		const error = err as Error;
		console.error(error.message);
	} finally {
		const endTime = process.hrtime(startTime);
		const durationInSeconds = endTime[0] + endTime[1] / 1e9;
		MonitoringService.recordRequestDuration(durationInSeconds);
		MonitoringService.recordRouteRequestDuration(
			`/player-image`,
			durationInSeconds
		);
	}
};

export const getPlayer = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { code } = req.params;
	const startTime = process.hrtime();

	try {
		const response = await axios.get(
			'https://fantasy.premierleague.com/api/bootstrap-static/'
		);
		let filteredPlayer = response.data.elements.filter(
			(el: { code: number }) => el.code === parseInt(code)
		);

		MonitoringService.incrementSuccessfulRequests(req.route.path);

		res.status(200).json({
			player: filteredPlayer,
		});
	} catch (err) {
		MonitoringService.incrementFailedRequests(req.route.path);
		const error = err as Error;
		console.error(error.message);
	} finally {
		const endTime = process.hrtime(startTime);
		const durationInSeconds = endTime[0] + endTime[1] / 1e9;
		MonitoringService.recordRequestDuration(durationInSeconds);
		MonitoringService.recordRouteRequestDuration(`/player`, durationInSeconds);
	}
};

export const getPlayerSummary = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;
	const startTime = process.hrtime();

	try {
		const response = await axios.get(
			`https://fantasy.premierleague.com/api/element-summary/${parseInt(id)}/`
		);

		MonitoringService.incrementSuccessfulRequests(req.route.path);

		res.status(200).json({
			playerSummary: response.data,
		});
	} catch (err) {
		MonitoringService.incrementFailedRequests(req.route.path);
		const error = err as Error;
		console.error(error.message);
	} finally {
		const endTime = process.hrtime(startTime);
		const durationInSeconds = endTime[0] + endTime[1] / 1e9;
		MonitoringService.recordRequestDuration(durationInSeconds);
		MonitoringService.recordRouteRequestDuration(
			`/player-summary`,
			durationInSeconds
		);
	}
};

export const getPlayerDataId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { firstName, secondName } = req.body.data;
	const startTime = process.hrtime();

	try {
		if (
			!process.env.X_RapidAPI_Key ||
			!process.env.X_RapidAPI_Host ||
			!process.env.RapidAPI_Url
		) {
			throw new Error(
				'API credentials are missing. Player data cannot be retrieved'
			);
		}

		const response = await axios.request({
			method: 'GET',
			url: process.env.RapidAPI_Url,
			params: {
				query: `${firstName} ${secondName}`,
				group: 'players',
			},
			headers: {
				'X-RapidAPI-Key': process.env.X_RapidAPI_Key,
				'X-RapidAPI-Host': process.env.X_RapidAPI_Host,
				'Content-Type': 'application/json',
				'accept-encoding': '*',
			},
		});

		if (!response.data.data.points || response.data.data.points.length === 0) {
			throw new Error('Player not found');
		}

		MonitoringService.incrementSuccessfulRequests(req.route.path);

		res.status(200).json({
			playerDataId: response.data.data[0].id,
		});
	} catch (err) {
		MonitoringService.incrementFailedRequests(req.route.path);
		const error = err as Error;
		console.error(error.message);

		if (
			axios.isAxiosError(err) &&
			err.response &&
			err.response.status === 404
		) {
			res.status(404).json({ error: 'Player not found' });
		} else {
			const error =
				err instanceof Error ? err : new Error('An unexpected error occurred');
			console.error(error.message);
			res.status(401).json({ error: error.message });
		}
	} finally {
		const endTime = process.hrtime(startTime);
		const durationInSeconds = endTime[0] + endTime[1] / 1e9;
		MonitoringService.recordRequestDuration(durationInSeconds);
		MonitoringService.recordRouteRequestDuration(
			`/player-data`,
			durationInSeconds
		);
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
	const startTime = process.hrtime();

	try {
		if (
			!process.env.X_RapidAPI_Key ||
			!process.env.X_RapidAPI_Host ||
			!process.env.RapidAPI_Heatmap_Url
		) {
			throw new Error(
				'API credentials are missing. Heatmap data cannot be retrieved'
			);
		}

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

		if (!response.data.data.points || response.data.data.points.length === 0) {
			throw new Error('No heatmap data found');
		}

		MonitoringService.incrementSuccessfulRequests(req.route.path);

		res.status(200).json({
			playerDataHeatmapPoints: response.data.data.points,
		});
	} catch (err) {
		MonitoringService.incrementFailedRequests(req.route.path);
		const error = err as Error;
		console.error(error.message);

		if (
			axios.isAxiosError(err) &&
			err.response &&
			err.response.status === 404
		) {
			res.status(404).json({ error: 'No heatmap data found' });
		} else {
			const error =
				err instanceof Error ? err : new Error('An unexpected error occurred');
			console.error(error.message);
			res.status(401).json({ error: error.message });
		}
	} finally {
		const endTime = process.hrtime(startTime);
		const durationInSeconds = endTime[0] + endTime[1] / 1e9;
		MonitoringService.recordRequestDuration(durationInSeconds);
		MonitoringService.recordRouteRequestDuration(
			`/player-heatmap`,
			durationInSeconds
		);
	}
};
