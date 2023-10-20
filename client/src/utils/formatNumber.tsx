export function formatNumber(num: number): string {
	return Intl.NumberFormat('en', { notation: 'standard' }).format(num);
}

export function formatCurrency(num: number): string {
	let price: string = '';
	let numString: string = String(num);

	if (numString.length == 2) {
		price = numString.split('').join('.');
	} else {
		let arr: string[] = numString.split('');
		price = `${arr[0]}${arr[1]}.${arr[2]}`;
	}

	return `£${price}`;
}
