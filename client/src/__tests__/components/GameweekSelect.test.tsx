import { render, screen, fireEvent } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { GameweekSelect } from '../../components/GameweekSelect'; // Update the import path accordingly
import { statsMockData } from '../__mocks__/statsMockData';

const renderComponent = () => {
	const selectGameweek = 'Gameweek 1';
	const setSelectGameweekMock = vi.fn();

	return render(
		<GameweekSelect
			data={statsMockData}
			selectGameweek={selectGameweek}
			setSelectGameweek={setSelectGameweekMock}
		/>
	);
};

describe('GameweekSelect', (test) => {
	it('should render a select element with the gameweek options', () => {
		renderComponent();

		const selectElement = screen.getByRole('combobox');
		expect(selectElement).toBeInTheDocument();

		const gameweekOptions = screen.getAllByRole('option');
		expect(gameweekOptions).toHaveLength(2);
		expect(gameweekOptions[0].textContent).toBe('Gameweek 1');
	});

	it('should call the setSelectGameweek() prop when the user selects a gameweek option', () => {
		const mockSetSelectGameweek = vi.fn();

		render(
			<GameweekSelect
				data={statsMockData}
				selectGameweek='Gameweek 1'
				setSelectGameweek={mockSetSelectGameweek}
			/>
		);

		const selectElement = screen.getByRole('combobox');
		fireEvent.change(selectElement, { target: { value: 'Gameweek 2' } });

		expect(mockSetSelectGameweek).toHaveBeenCalledWith('Gameweek 2');
	});

	it('updates the selected gameweek when the user changes the dropdown selection', () => {
		renderComponent();

		const selectDropdown = screen.getByRole('combobox');
		selectDropdown.textContent = '2';
		selectDropdown.dispatchEvent(new Event('change'));

		expect(selectDropdown.textContent).toBe('2');
	});

	test('displays the current gameweek by default', () => {
		const selectGameweek = 'Gameweek 2';
		const setSelectGameweek = vi.fn();

		render(
			<GameweekSelect
				data={statsMockData}
				selectGameweek={selectGameweek}
				setSelectGameweek={setSelectGameweek}
			/>
		);

		const selectElement = screen.getByRole('combobox');
		expect(selectElement).toBeInTheDocument();
		expect(selectElement).toHaveValue(selectGameweek);
		expect(screen.getByText('Gameweek 1')).toBeInTheDocument();
	});

	test('allows selecting a different gameweek', async () => {
		const selectGameweek = 'Gameweek 2';
		const setSelectGameweekMock = vi.fn();

		render(
			<GameweekSelect
				data={statsMockData}
				selectGameweek={selectGameweek}
				setSelectGameweek={setSelectGameweekMock}
			/>
		);

		const selectElement = screen.getByRole('combobox');

		fireEvent.change(selectElement, {
			target: { value: 'Gameweek 2' },
		});

		expect(setSelectGameweekMock).toHaveBeenCalledWith('Gameweek 2');
	});

	test('displays finished or current gameweeks', () => {
		renderComponent();

		const options = screen.getAllByRole('option');
		expect(options).toHaveLength(2);
	});
});
