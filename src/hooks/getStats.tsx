import api from './../api/statsApi';

export async function getStats() {
	try {
		const {
			data: { stats },
		} = await api.get('/stats');
		return stats;
	} catch (error) {
		console.error(error);
	}
}

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
