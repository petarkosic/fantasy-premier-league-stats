import { getStats } from '../../services/getStats';
import api from '../../api/statsApi';

afterEach(() => {
	vi.clearAllMocks();
	vi.resetAllMocks();
});

describe('getStats', () => {
	it('returns the expected stats data', async () => {
		const mockData = {
			stats: {
				events: [],
				game_settings: {},
				phases: [],
				teams: [],
				total_players: '',
				elements: [],
				element_stats: [],
				element_types: [],
			},
		};
		const spy = vi.spyOn(api, 'get').mockResolvedValue({ data: mockData });
		const result = await getStats();

		expect(spy).toHaveBeenCalled();
		expect(result).toEqual(mockData.stats);
	});

	it('handles API call error', async () => {
		vi.spyOn(api, 'get').mockRejectedValue(new Error('API call failed'));

		const consoleErrorSpy = vi
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		await getStats();

		expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
	});
});
