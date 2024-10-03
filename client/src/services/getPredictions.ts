import api from '../api/predictApi';

export async function getPredictions() {
	try {
		const {
			data: { top_predicted_players },
		} = await api.get('/predict');
		return top_predicted_players;
	} catch (error) {
		console.error(error);
	}
}
