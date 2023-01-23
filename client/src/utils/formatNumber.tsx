export function formatNumber(num: number): string {
	return Intl.NumberFormat('en', { notation: 'standard' }).format(num);
}

export function formatCurrency(num: number): string {
	return Intl.NumberFormat('en', {
		style: 'currency',
		currency: 'GBP',
		minimumFractionDigits: 1,
		maximumFractionDigits: 2,
	}).format(num);
}
