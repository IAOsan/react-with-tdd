export async function makeApiCall(url, opts = {}) {
	try {
		const res = await fetch(url, opts);
		if (!res.ok) {
			const data = await res.json();
			const error = new Error();
			error.status = res.status;
			error.validationErrors = data?.validationErrors;
			error.message = data?.message || res.statusText;
			throw error;
		}
		return await res.json();
	} catch (error) {
		throw error;
	}
}

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
