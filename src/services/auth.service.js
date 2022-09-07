import i18n from '../locale/i18n';
import { http, handleError } from './http.service';

const endpoint = '/api/1.0/users';

export async function registerEmailPassword(credentials) {
	try {
		const res = await http.post(endpoint, {
			body: JSON.stringify(credentials),
			headers: {
				'Accept-Language': i18n.language,
			},
		});
		return res;
	} catch (error) {
		handleError(error);
	}
}

export async function activation(token) {
	try {
		await http.post(`${endpoint}/token/${token}`, {
			headers: {
				'Accept-Language': i18n.language,
			},
		});
	} catch (error) {
		handleError(error);
	}
}
