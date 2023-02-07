export function formatNumber(num: number): string {
	return Intl.NumberFormat('en', { notation: 'standard' }).format(num);
}

// export function formatCurrency(num: number): string {
// 	return Intl.NumberFormat('en', {
// 		style: 'currency',
// 		currency: 'GBP',
// 		minimumFractionDigits: 1,
// 		maximumFractionDigits: 2,
// 	}).format(num);
// }

export function formatCurrency(num: number): string {
	let price: string = '';
	let numString: string = String(num);

	if (numString.length == 2) {
		price = numString.split('').join('.');
	}

	return `£${price}`;
}
