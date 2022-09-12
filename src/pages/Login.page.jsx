import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
	loginWithEmailAndPassword,
	removeError,
} from '../store/auth/auth.slice';
import Form from '../components/common/Form.component';
import useForm from '../hooks/useForm';
import HandleState from '../components/common/HandleState.component';

export function LoginPage() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { isAuth, status, error } = useSelector((state) => state.auth);
	const { formData, handleSubmit, handleChange } = useForm(
		{
			email: '',
			password: '',
		},
		null,
		doSubmit
	);
	const someInputsAreEmpty = Object.keys(formData).some((k) => !formData[k]);
	const isSubmitDisabled = status === 'loading' || someInputsAreEmpty;

	function doSubmit() {
		dispatch(loginWithEmailAndPassword(formData));
	}

	function successState() {
		return <Navigate to='/' replace={true} />;
	}

	function cleanupError() {
		if (!error) return;
		dispatch(removeError);
	}

	return (
		<HandleState isSuccessful={isAuth} config={{ successState }}>
			<main data-testid='login-page'>
				<div className='container'>
					<div className='row justify-content-center py-5'>
						<div className='col-lg-5 col-md-7 col-sm-8'>
							<Form
								title={t('signIn')}
								fields={[
									{
										id: 'inputEmail',
										label: t('email'),
										type: 'email',
										name: 'email',
										value: formData.email,
										onInput: cleanupError,
										onChange: handleChange,
										error: error?.email,
									},
									{
										id: 'inputPassword',
										label: t('password'),
										type: 'password',
										name: 'password',
										value: formData.password,
										onInput: cleanupError,
										onChange: handleChange,
									},
								]}
								submitLabel={t('signIn')}
								disableSubmit={isSubmitDisabled}
								onSubmit={handleSubmit}
								isLoading={status === 'loading'}
							/>
						</div>
					</div>
				</div>
			</main>
		</HandleState>
	);
}

export default LoginPage;
