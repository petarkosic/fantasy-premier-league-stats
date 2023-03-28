import api from '../api/statsApi';

export async function getTeamImage(code: number) {
	try {
		const {
			data: { teamImage },
		} = await api.get(`/team/${code}`);
		return teamImage;
	} catch (error) {
		console.error(error);
	}
}
