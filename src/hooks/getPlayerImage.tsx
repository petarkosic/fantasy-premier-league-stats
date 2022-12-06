import api from './../api/statsApi';

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
