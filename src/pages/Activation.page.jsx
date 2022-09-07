import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Alert from '../components/common/Alert.component';
import Spinner from '../components/common/Spinner.component';
import HandleState from '../components/common/HandleState.component';
import { activation } from '../services/auth.service';

export function ActivationPage() {
	const [status, setStatus] = useState('idle');
	const [error, setError] = useState(null);
	const { token } = useParams();

	useEffect(() => {
		(async () => {
			setStatus('pending');
			setError(null);
			try {
				await activation(token);
				setStatus('success');
			} catch (error) {
				setError(error);
				setStatus('error');
			}
		})();
	}, [token]);

	function loadingState() {
		return (
			<div className='text-center'>
				<Spinner />
			</div>
		);
	}

	function errorState() {
		return (
			<Alert
				type='danger'
				message={{
					emphasis: 'Activation failure',
					text: error?.message,
				}}
				inline
			/>
		);
	}

	function successState() {
		return (
			<Alert
				type='success'
				message={{
					emphasis: 'Well done!',
					text: 'Activated account',
				}}
				inline
			/>
		);
	}

	return (
		<main data-testid='activation-page' className='py-5'>
			<div className='container text-center'>
				<HandleState
					isLoading={status === 'pending'}
					hasError={status === 'error'}
					isSuccessful={status === 'success'}
					config={{
						loadingState,
						errorState,
						successState,
					}}
				/>
			</div>
		</main>
	);
}

export default ActivationPage;
