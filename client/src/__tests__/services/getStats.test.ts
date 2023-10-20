import { getStats } from '../../services/getStats';
import api from '../../api/statsApi';

afterEach(() => {
	vi.clearAllMocks();
	vi.resetAllMocks();
});

describe('getStats', () => {
	it('returns the expected stats data', async () => {
		// Create a mock data object
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
		// Mock the api.get() method and return the mock data object
		const spy = vi.spyOn(api, 'get').mockResolvedValue({ data: mockData });
		// Call the getStats() function
		const result = await getStats();
		// Verify that the returned data matches the mock data object
		expect(spy).toHaveBeenCalled();

		expect(result).toEqual(mockData.stats);
	});

	it('handles API call error', async () => {
		// Mock the api.get() method to simulate an error
		vi.spyOn(api, 'get').mockRejectedValue(new Error('API call failed'));

		// Spy on console.error to check if it's called
		const consoleErrorSpy = vi
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		// Call the getStats() function
		await getStats();

		// Verify that console.error was called with the expected error instance
		expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
	});
});
