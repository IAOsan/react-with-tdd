import React, { useState } from 'react';
import Form from '../components/common/Form.component';
import useForm from '../hooks/useForm';

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
	const [isSuccessful, setIsSuccessful] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const someInputsAreEmpty = Object.keys(values).some((k) => !values[k]);
	const passwordsNotMatch = values.password !== values.confirmPassword;
	const isSubmitDisabled =
		isLoading || someInputsAreEmpty || passwordsNotMatch;

	async function doSubmit() {
		const base_url = window.location.origin;
		const url = new URL('/api/1.0/users', base_url);

		setIsLoading(true);
		try {
			const res = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(values),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (!res.ok) {
				const data = await res.json();
				const error = new Error(res.statusText);
				error.status = res.status;
				error.validationErrors = data?.validationErrors;
				throw error;
			}
			setIsSuccessful(true);
		} catch (error) {
			if (error.status >= 400 && error.status < 500) {
				setErrors(error.validationErrors);
				return;
			}
			console.error('oops: ', error.message);
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
								title='Sign up'
								fields={[
									{
										id: 'inputUsername',
										label: 'Username',
										type: 'text',
										name: 'username',
										value: values.username,
										onChange: handleChange,
										error: errors?.username,
									},
									{
										id: 'inputEmail',
										label: 'Email',
										type: 'email',
										name: 'email',
										value: values.email,
										onChange: handleChange,
										error: errors?.email,
									},
									{
										id: 'inputPassword',
										label: 'Password',
										type: 'password',
										name: 'password',
										value: values.password,
										onChange: handleChange,
										error: errors?.password,
									},
									{
										id: 'inputConfirmPassword',
										label: 'Confirm Password',
										type: 'password',
										name: 'confirmPassword',
										value: values.confirmPassword,
										onChange: handleChange,
										error: passwordsNotMatch
											? 'Password mismatch'
											: '',
									},
								]}
								submitLabel='Sign up'
								disableSubmit={isSubmitDisabled}
								onSubmit={handleSubmit}
								isLoading={isLoading}
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
