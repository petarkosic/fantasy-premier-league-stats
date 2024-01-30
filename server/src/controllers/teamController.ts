import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import MonitoringService from '../services/MonitoringService';

type Error = {
	message: string;
};

export const getTeamImage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { code } = req.params;
	const startTime = process.hrtime();

	try {
		const response = await axios.get(
			`https://resources.premierleague.com/premierleague/badges/70/t${code}.png`
		);
		let teamImage = response.config.url;

		MonitoringService.incrementSuccessfulRequests(req.route.path);

		res.status(200).json({
			teamImage,
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
			`/team-image`,
			durationInSeconds
		);
	}
};
