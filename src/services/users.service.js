import { http, handleError } from './http.service';
import { USERS_ENDPOINT } from '../config';

export async function registerEmailPassword(credentials) {
	try {
		const res = await http.post(USERS_ENDPOINT, {
			body: JSON.stringify(credentials),
		});
		return res;
	} catch (error) {
		handleError(error);
	}
}

export async function activation(token) {
	try {
		await http.post(`${USERS_ENDPOINT}/token/${token}`);
	} catch (error) {
		handleError(error);
	}
}

export async function getAllUsers(page = 0, size = 3) {
	try {
		const res = await http.get(
			`${USERS_ENDPOINT}?page=${page}&size=${size}`
		);
		return res;
	} catch (error) {
		handleError(error);
	}
}

export async function getUserById(id) {
	try {
		const res = await http.get(`${USERS_ENDPOINT}/${id}`);
		return res;
	} catch (error) {
		handleError(error);
	}
}

export async function updateUserById(updatedValue) {
	try {
		const { id, ...rest } = updatedValue;
		const res = await http.put(`${USERS_ENDPOINT}/${id}`, {
			body: JSON.stringify(rest),
		});
		return res;
	} catch (error) {
		handleError(error);
	}
}

export async function deleteUserById(id) {
	try {
		await http.delete(`${USERS_ENDPOINT}/${id}`);
	} catch (error) {
		handleError(error);
	}
}
