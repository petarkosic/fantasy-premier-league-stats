import { getTeamImage } from '../../services/teamStats';
import api from '../../api/statsApi';

afterEach(() => {
	vi.clearAllMocks();
	vi.resetAllMocks();
});
describe('teamStats', () => {
	it('should return team image', async () => {
		const mockData = {
			teamImage: 'image.png',
		};

		const spy = vi.spyOn(api, 'get').mockResolvedValue({ data: mockData });
		const result = await getTeamImage(8);

		expect(result).toEqual(mockData.teamImage);
		expect(spy).toHaveBeenCalled();
		expect(spy).toHaveReturnedWith({
			data: {
				teamImage: 'image.png',
			},
		});
	});

	it('handles API call error', async () => {
		vi.spyOn(api, 'get').mockRejectedValue(new Error('API call failed'));

		const consoleErrorSpy = vi
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		await getTeamImage(25);

		expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
	});
});
