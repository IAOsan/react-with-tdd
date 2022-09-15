import { http, handleError } from './http.service';
import { AUTH_ENDPOINT, LOGOUT_ENDPOINT } from '../config';

export async function login(credentials) {
	try {
		const res = await http.post(AUTH_ENDPOINT, {
			body: JSON.stringify(credentials),
		});
		return res;
	} catch (error) {
		handleError(error);
	}
}

export async function logout() {
	try {
		await http.post(LOGOUT_ENDPOINT);
	} catch (error) {
		handleError(error);
	}
}
