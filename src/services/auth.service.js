import { http, handleError } from './http.service';

const endpoint = '/api/1.0/auth';

export async function login(credentials) {
	try {
		const data = await http.post(endpoint, {
			body: JSON.stringify(credentials),
		});
		// localStorage.setItem('auth', JSON.stringify(data));
		return data;
	} catch (error) {
		handleError(error);
	}
}
