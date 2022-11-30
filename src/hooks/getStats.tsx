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
