import { http, handleError } from './http.service';

const endpoint = '/api/1.0/users';

export async function getAllUsers(page = 0, size = 3) {
	try {
		const res = await http.get(`${endpoint}?page=${page}&size=${size}`);
		return res;
	} catch (error) {
		handleError(error);
	}
}

export async function getUserById(id) {
	try {
		const res = await http.get(`${endpoint}/${id}`);
		return res;
	} catch (error) {
		handleError(error);
	}
}
