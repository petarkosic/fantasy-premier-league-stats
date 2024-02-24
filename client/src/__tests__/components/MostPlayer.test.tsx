import { render, screen } from '@testing-library/react';
import MostPlayer from '../../components/MostPlayer/MostPlayer';

describe('MostPlayer', () => {
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
