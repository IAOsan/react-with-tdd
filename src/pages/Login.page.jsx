import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Form from '../components/common/Form.component';
import useForm from '../hooks/useForm';
import { login } from '../services/auth.service';

export function LoginPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const formSchema = {
		email: '',
		password: '',
	};
	const {
		formData: values,
		errors,
		setErrors,
		handleSubmit,
		handleChange,
	} = useForm(formSchema, null, doSubmit);
	const [status, setStatus] = useState('idle');
	const someInputsAreEmpty = Object.keys(values).some((k) => !values[k]);
	const isSubmitDisabled = status === 'pending' || someInputsAreEmpty;

	async function doSubmit() {
		setStatus('pending');

		try {
			await login(values);
			setStatus('success');
			navigate('/');
		} catch (error) {
			setErrors({ email: 'Email or password are wrong' });
			setStatus('error');
		}
	}

	return (
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
									value: values.email,
									onChange: handleChange,
									error: errors?.email,
								},
								{
									id: 'inputPassword',
									label: t('password'),
									type: 'password',
									name: 'password',
									value: values.password,
									onChange: handleChange,
									error: errors?.password,
								},
							]}
							submitLabel={t('signIn')}
							disableSubmit={isSubmitDisabled}
							onSubmit={handleSubmit}
							isLoading={status === 'pending'}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}

export default LoginPage;
