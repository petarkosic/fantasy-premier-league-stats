import { render } from '@testing-library/react';
import { Chart } from '../../components/Chart/Chart';
import { playerSummaryMockData } from '../__mocks__/playerSummaryMockData';

describe('chart', () => {
	it('should render chart', () => {
		const { getByTestId } = render(
			<Chart playerSummary={playerSummaryMockData} />
		);

		const chartDiv = getByTestId('chart');

		expect(chartDiv).toBeInTheDocument();
		expect(chartDiv.className).toEqual(expect.stringMatching(/.*chart.*/));
	});
});
