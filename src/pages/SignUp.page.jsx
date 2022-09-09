import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from '../components/common/Form.component';
import useForm from '../hooks/useForm';
import Alert from '../components/common/Alert.component';
import HandleState from '../components/common/HandleState.component';
import { registerEmailPassword } from '../services/users.service';

export function SignUpPage() {
	const { t } = useTranslation();
	const formSchema = {
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
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
	const passwordsNotMatch = values.password !== values.confirmPassword;
	const isSubmitDisabled =
		status === 'pending' || someInputsAreEmpty || passwordsNotMatch;

	async function doSubmit() {
		setStatus('pending');
		try {
			await registerEmailPassword(values);
			setStatus('success');
		} catch (error) {
			setErrors(error.validationErrors);
			setStatus('error');
		}
	}

	function successState() {
		return (
			<Alert
				type='success'
				message={{
					emphasis: 'Well done!',
					text: 'Please check your e-mail to activate your account',
				}}
			/>
		);
	}

	return (
		<main data-testid='signup-page'>
			<div className='container'>
				<div className='row justify-content-center py-5'>
					<div className='col-lg-5 col-md-7 col-sm-8'>
						<HandleState
							isSuccessful={status === 'success'}
							config={{ successState }}
						>
							<Form
								title={t('signUp')}
								fields={[
									{
										id: 'inputUsername',
										label: t('username'),
										type: 'text',
										name: 'username',
										value: values.username,
										onChange: handleChange,
										error: errors?.username,
									},
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
									{
										id: 'inputConfirmPassword',
										label: t('confirmPassword'),
										type: 'password',
										name: 'confirmPassword',
										value: values.confirmPassword,
										onChange: handleChange,
										error: passwordsNotMatch
											? t('passwordMismatchMsg')
											: '',
									},
								]}
								submitLabel={t('signUp')}
								disableSubmit={isSubmitDisabled}
								onSubmit={handleSubmit}
								isLoading={status === 'pending'}
							/>
						</HandleState>
					</div>
				</div>
			</div>
		</main>
	);
}

export default SignUpPage;
