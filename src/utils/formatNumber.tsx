export function formatNumber(num: number): string {
	return Intl.NumberFormat('en', { notation: 'standard' }).format(num);
}
