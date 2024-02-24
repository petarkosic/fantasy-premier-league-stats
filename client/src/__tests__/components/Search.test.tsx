import { cleanup, fireEvent, render } from '@testing-library/react';
import { Search } from '../../components/Search/Search';

afterEach(cleanup);

describe('Search', () => {
	it('renders the input with correct props', () => {
		const playerName = 'John Doe';
		const handleSearch = vi.fn();
		const { getByPlaceholderText } = render(
			Search({ playerName, handleSearchPlayerName: handleSearch })
		);
		const input = getByPlaceholderText('search player by player name');
		expect(input).toHaveValue(playerName);
	});

	it('renders input element with the given props', () => {
		const playerName = 'John Doe';
		const handleSearchPlayerName = vi.fn();

		const { getByPlaceholderText } = render(
			Search({ playerName, handleSearchPlayerName })
		);

		const inputElement = getByPlaceholderText('search player by player name');

		expect(inputElement).toBeInTheDocument();
		expect(inputElement).toHaveAttribute('type', 'search');
		expect(inputElement).toHaveValue(playerName);

		fireEvent.change(inputElement, { target: { value: 'Jane Doe' } });

		expect(handleSearchPlayerName).toHaveBeenCalledTimes(1);
	});

	it('calls handleSearch when input changes', () => {
		const handleSearch = vi.fn();

		const { getByPlaceholderText } = render(
			Search({ playerName: 'John Doe', handleSearchPlayerName: handleSearch })
		);
		const input = getByPlaceholderText('search player by player name');
		fireEvent.change(input, { target: { value: 'Jane Doe' } });
		expect(handleSearch).toHaveBeenCalledTimes(1);
	});

	it("should render an input element with class 'search-input'", () => {
		const handleSearch = vi.fn();
		const { getByPlaceholderText } = render(
			Search({ playerName: '', handleSearchPlayerName: handleSearch })
		);
		const inputElement = getByPlaceholderText('search player by player name');

		expect(inputElement).toBeInTheDocument();
		expect(inputElement.className).toEqual(
			expect.stringMatching(/.*searchInput.*/)
		);
	});
});
