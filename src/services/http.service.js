import i18n from '../locale/i18n';
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
	get: (path) =>
		makeApiCall(generateUrl(path), {
			method: 'GET',
			headers: {
				'Accept-Language': i18n.language,
			},
		}),
	post: (path, { headers = {}, ...rest } = {}) =>
		makeApiCall(generateUrl(path), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept-Language': i18n.language,
				...headers,
			},
			...rest,
		}),
};
