export function getClasName(...str) {
	return str
		.reduce((acc, s) => {
			if (!s) return acc;

			const isAnString = typeof s === 'string' && isNaN(s);
			const isANumber = typeof s === 'number' && !isNaN(s);
			const isAnObject = typeof s === 'object' && !!Object.keys(s).length;

			if (isAnString || isANumber) {
				acc.push(s);
			}

			if (isAnObject) {
				const [key, value] = Object.entries(s)[0];
				acc = acc.concat(!!value ? key : []);
			}

			return acc;
		}, [])
		.join(' ');
}
