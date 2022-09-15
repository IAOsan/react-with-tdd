import i18n from '../locale/i18n';
import { makeApiCall } from '../constants/utils';
import { BASE_URL } from '../config';
import { getItem } from './storage.service';
import { STATE_KEY } from '../config';

export function getToken() {
	const persistedState = getItem(STATE_KEY);
	return persistedState ? persistedState.auth.user.token : null;
}

function generateUrl(path) {
	return new URL(path, BASE_URL);
}

export function handleError(error) {
	if (error.status >= 400 && error.status < 500) {
		throw error;
	}
	console.error('oops: ', error);
}

export const http = {
	get: (path) =>
		makeApiCall(generateUrl(path), {
			method: 'GET',
			headers: {
				'Accept-Language': i18n.language,
			},
		}),
	post: (path, opts = {}) =>
		makeApiCall(generateUrl(path), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept-Language': i18n.language,
			},
			...opts,
		}),
	put: (path, opts = {}) =>
		makeApiCall(generateUrl(path), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Accept-Language': i18n.language,
				'Authorization': `Bearer ${getToken()}`,
			},
			...opts,
		}),
	delete: (path, opts = {}) =>
		makeApiCall(generateUrl(path), {
			method: 'DELETE',
			headers: {
				'Accept-Language': i18n.language,
				'Authorization': `Bearer ${getToken()}`,
			},
			...opts,
		}),
};
