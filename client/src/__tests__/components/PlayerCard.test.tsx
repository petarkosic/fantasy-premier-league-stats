import { render, screen } from '@testing-library/react';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import { statsMockData } from '../__mocks__/statsMockData';
import MostPlayer from '../../components/MostPlayer/MostPlayer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('PlayerCard', () => {
	it('renders the component with provided props', () => {
		const defaultProps = {
			className: 'test-class',
			label: 'Test Label',
			firstName: 'John',
			secondName: 'Doe',
		};
		render(<MostPlayer {...defaultProps} />);
		const mostPlayerElement = screen.getByTestId('most-player');
		const labelElement = screen.getByText('Test Label');
		const nameElement = screen.getByText('John Doe');
		expect(mostPlayerElement).toBeInTheDocument();
		expect(mostPlayerElement).toHaveClass('test-class');
		expect(labelElement).toBeInTheDocument();
		expect(nameElement).toBeInTheDocument();
	});

	it('should render player name and image when data is provided', () => {
		const queryClient = new QueryClient();

		queryClient.getQueryData = vi
			.fn()
			.mockReturnValue(statsMockData.elements[0]);

		vi.mock('../services/playerStats', () => ({
			getPlayerImage: vi.fn().mockResolvedValue('playerImage'),
		}));

		vi.mock('../services/teamStats', () => ({
			getTeamImage: vi.fn().mockResolvedValue('teamImage'),
		}));
		const data = statsMockData.elements[0];

		render(
			<QueryClientProvider client={queryClient}>
				<PlayerCard data={data} />
			</QueryClientProvider>
		);

		expect(screen.getByText('John')).toBeInTheDocument();
		expect(screen.getByText('Doe')).toBeInTheDocument();
		expect(screen.getByAltText('player image')).toBeInTheDocument();
	});

	it('renders the component with different props', () => {
		const customProps = {
			className: 'custom-class',
			label: 'Custom Label',
			firstName: 'Jane',
			secondName: 'Smith',
		};
		render(<MostPlayer {...customProps} />);
		const mostPlayerElement = screen.getByTestId('most-player');
		const labelElement = screen.getByText('Custom Label');
		const nameElement = screen.getByText('Jane Smith');
		expect(mostPlayerElement).toBeInTheDocument();
		expect(mostPlayerElement).toHaveClass('custom-class');
		expect(labelElement).toBeInTheDocument();
		expect(nameElement).toBeInTheDocument();
	});
});
