import { formatNumber, formatCurrency } from '../../utils/formatNumber';

describe('Formatting Functions', () => {
	it('should format a number', () => {
		const num1 = 12345;
		const num2 = 9876.54;

		expect(formatNumber(num1)).toBe('12,345');
		expect(formatNumber(num2)).toBe('9,876.54');
	});

	it('should format a currency', () => {
		const num1 = 124;
		const num2 = 55;

		expect(formatCurrency(num1)).toBe('£12.4');
		expect(formatCurrency(num2)).toBe('£5.5');
	});
});
