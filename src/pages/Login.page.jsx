import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from '../components/common/Form.component';
import useForm from '../hooks/useForm';
import LanguageSelector from '../components/LanguageSelector.component';
import { registerEmailPassword } from '../services/auth.service';

export function LoginPage() {
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
	const { t, i18n } = useTranslation();
	const [isSuccessful, setIsSuccessful] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const someInputsAreEmpty = Object.keys(values).some((k) => !values[k]);
	const passwordsNotMatch = values.password !== values.confirmPassword;
	const isSubmitDisabled =
		isLoading || someInputsAreEmpty || passwordsNotMatch;

	async function doSubmit() {
		setIsLoading(true);
		try {
			await registerEmailPassword(values, i18n.language);
			setIsSuccessful(true);
		} catch (error) {
			setErrors(error.validationErrors);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className='container'>
			<div className='row justify-content-center py-5'>
				<div className='col-lg-5 col-md-7 col-sm-8'>
					{!isSuccessful ? (
						<>
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
								isLoading={isLoading}
								content={() => <LanguageSelector />}
							/>
						</>
					) : (
						<div
							className='alert alert-success fade show mt-5'
							role='alert'
						>
							<strong>Well done!</strong> Please check your e-mail
							to activate your account
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
