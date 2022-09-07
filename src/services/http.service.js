import { makeApiCall } from '../constants/utils';

function generateUrl(path) {
	const BASE_URL = window.location.origin;
	return new URL(path, BASE_URL);
}

export function handleError(error) {
	if (error.status >= 400 && error.status < 500) {
		throw error;
	}
	console.error('oops: ', error.message);
}

export const http = {
	post: (path, { headers = {}, ...rest } = {}) =>
		makeApiCall(generateUrl(path), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
			...rest,
		}),
};
