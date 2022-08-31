import React, { useState } from 'react';

export function LoginPage() {
	const [isSuccessful, setIsSuccessful] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [values, setValues] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const someInputsAreEmpty = Object.keys(values).some((k) => !values[k]);
	const passwordsMatch = values.password !== values.confirmPassword;
	const isSubmitDisabled = isLoading || someInputsAreEmpty || passwordsMatch;

	function handleChange({ target }) {
		setValues((prevState) => ({
			...prevState,
			[target.name]: target.value,
		}));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		const base_url = window.location.origin;
		const url = new URL('/api/1.0/users', base_url);

		setIsLoading(true);
		try {
			await fetch(url, {
				method: 'POST',
				body: JSON.stringify(values),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			setIsSuccessful(true);
		} catch (error) {
			console.log('oops', error);
		}
	}

	return (
		<div className='container'>
			<div className='row justify-content-center py-5'>
				<div className='col-lg-5 col-md-7 col-sm-8'>
					{!isSuccessful ? (
						<form
							onSubmit={handleSubmit}
							className='card border-secondary'
						>
							<h2 className='card-header'>Sign up</h2>
							<div className='card-body'>
								<div className='form-group'>
									<label htmlFor='inputUsername'>
										Username
									</label>
									<input
										type='text'
										name='username'
										id='inputUsername'
										value={values.username}
										onChange={handleChange}
										className='form-control'
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='inputEmail'>Email</label>
									<input
										type='email'
										name='email'
										id='inputEmail'
										value={values.email}
										onChange={handleChange}
										className='form-control'
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='inputPassword'>
										Password
									</label>
									<input
										type='password'
										name='password'
										id='inputPassword'
										value={values.password}
										onChange={handleChange}
										className='form-control'
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='inputConfirmPassword'>
										Confirm Password
									</label>
									<input
										type='password'
										name='confirmPassword'
										id='inputConfirmPassword'
										value={values.confirmPassword}
										onChange={handleChange}
										className='form-control'
									/>
								</div>
								<button
									className='btn btn-primary btn-lg d-block w-100'
									type='submit'
									disabled={isSubmitDisabled}
								>
									{isLoading && (
										<span
											className='spinner-border spinner-border-sm mr-2'
											role='status'
											aria-hidden='true'
										></span>
									)}
									Sign up
								</button>
							</div>
						</form>
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
