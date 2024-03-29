import api from '../api/statsApi';

export async function getPlayer(code: number) {
	try {
		const {
			data: { player },
		} = await api.get(`/player/${code}`);
		return player;
	} catch (error) {
		console.error(error);
	}
}

export async function getPlayerSummary(id: number) {
	try {
		const {
			data: { playerSummary },
		} = await api.get(`/player-summary/${id}`);
		return playerSummary;
	} catch (error) {
		console.error(error);
	}
}

export async function getPlayerImage(code: number) {
	try {
		const {
			data: { image },
		} = await api.get(`/players/${code}`);
		return image;
	} catch (error) {
		console.error(error);
	}
}

export async function getPlayerDataId(firstName: string, secondName: string) {
	try {
		const {
			data: { playerDataId },
		} = await api.post(`/player-data`, {
			data: {
				firstName: JSON.stringify(firstName),
				secondName: JSON.stringify(secondName),
			},
		});

		return playerDataId;
	} catch (error: any) {
		if (error?.response?.data?.error) {
			throw new Error(error.response.data.error);
		} else if (error.message) {
			throw new Error(error.message);
		} else {
			throw new Error('An unexpected error occurred');
		}
	}
}

export async function getPlayerHeatmapData(playerId: number) {
	try {
		const {
			data: { playerDataHeatmapPoints },
		} = await api.post(`/player-heatmap`, {
			data: {
				playerId: playerId,
			},
		});

		return playerDataHeatmapPoints;
	} catch (error: any) {
		if (error?.response?.data?.error) {
			throw new Error(error.response.data.error);
		} else if (error.message) {
			throw new Error(error.message);
		} else {
			throw new Error('An unexpected error occurred');
		}
	}
}
