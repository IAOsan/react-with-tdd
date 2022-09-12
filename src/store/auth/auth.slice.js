import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/auth.service';

const slice = createSlice({
	name: '[auth]',
	initialState: {
		user: null,
		isAuth: false,
		status: 'idle',
		error: null,
	},
	reducers: {
		error_removed(state) {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(loginWithEmailAndPassword.pending, (state) => {
			state.status = 'loading';
			state.error = null;
		});
		builder.addCase(
			loginWithEmailAndPassword.fulfilled,
			(state, { payload }) => {
				state.user = payload;
				state.isAuth = true;
				state.status = 'success';
			}
		);
		builder.addCase(
			loginWithEmailAndPassword.rejected,
			(state, { payload }) => {
				state.error = payload;
				state.status = 'error';
			}
		);
	},
});

const { error_removed } = slice.actions;
export default slice.reducer;

// export const loginWithEmailAndPassword = (credentials) => async (dispatch) => {
// 	dispatch(loadingStatus);
// 	dispatch(removeError);
// 	try {
// 		const data = await authService.login(credentials);
// 		dispatch(login(data));
// 		dispatch(successStatus);
// 	} catch (error) {
// 		dispatch(addError({ email: 'Email or password are wrong' }));
// 		dispatch(failedStatus);
// 	}
// };

// [auth] / login;

// [auth] / login / pending;
// [auth] / login / fulfilled;
// [auth] / login / rejected;

export const loginWithEmailAndPassword = createAsyncThunk(
	'[auth]/login',
	async (credentials, thunkApi) => {
		try {
			const data = await authService.login(credentials);
			return data;
		} catch (error) {
			return thunkApi.rejectWithValue({
				email: 'Email or password are wrong',
			});
		}
	}
);

export const removeError = error_removed();
