const padFront = (arr, n, padder = null) => {
	const padding = [];
	padding.length = n;
	padding.fill(padder);
	return padding.concat(arr);
}

export {
	padFront
};