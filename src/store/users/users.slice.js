import { createSlice } from '@reduxjs/toolkit';
import {
	loadingStatus,
	removeError,
	successStatus,
	addError,
	failedStatus,
} from '../ui/ui.slice';
import * as usersServices from '../../services/users.service';

const slice = createSlice({
	name: '[users]',
	initialState: {},
	reducers: {},
});

export default slice.reducer;

export const registerWithEmailAndPassword =
	(credentials) => async (dispatch) => {
		dispatch(loadingStatus);
		dispatch(removeError);
		try {
			const data = await usersServices.login(credentials);
			// dispatch(login(data));
			dispatch(successStatus);
		} catch (error) {
			dispatch(addError({ email: 'Email or password are wrong' }));
			dispatch(failedStatus);
		}
	};
