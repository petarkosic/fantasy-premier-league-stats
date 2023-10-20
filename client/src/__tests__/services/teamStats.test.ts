import { getTeamImage } from '../../services/teamStats';
import api from '../../api/statsApi';

afterEach(() => {
	vi.clearAllMocks();
	vi.resetAllMocks();
});
describe('teamStats', () => {
	it('should return team image', async () => {
		// Create a mock data object
		const mockData = {
			teamImage: 'image.png',
		};

		// Mock the api.get() method and return the mock data object
		const spy = vi.spyOn(api, 'get').mockResolvedValue({ data: mockData });
		// Call the getStats() function
		const result = await getTeamImage(8);
		// Verify that the returned data matches the mock data object
		expect(result).toEqual(mockData.teamImage);
		expect(spy).toHaveBeenCalled();
		expect(spy).toHaveReturnedWith({
			data: {
				teamImage: 'image.png',
			},
		});
	});

	it('handles API call error', async () => {
		// Mock the api.get() method to simulate an error
		vi.spyOn(api, 'get').mockRejectedValue(new Error('API call failed'));

		// Spy on console.error to check if it's called
		const consoleErrorSpy = vi
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		// Call the getStats() function
		await getTeamImage(25);

		// Verify that console.error was called with the expected error instance
		expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
	});
});
