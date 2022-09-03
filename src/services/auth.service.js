import { http, handleError } from './http.service';

const endpoint = '/api/1.0/users';

export async function registerEmailPassword(credentials, lang) {
	try {
		const res = await http.post(endpoint, {
			body: JSON.stringify(credentials),
			headers: {
				'Accept-Language': lang,
			},
		});
		return res;
	} catch (error) {
		handleError(error);
	}
}
