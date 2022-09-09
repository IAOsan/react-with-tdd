import { http, handleError } from './http.service';

const endpoint = '/api/1.0/auth';

export async function login(credentials) {
	try {
		await http.post(endpoint, {
			body: JSON.stringify(credentials),
		});
	} catch (error) {
		handleError(error);
	}
}
