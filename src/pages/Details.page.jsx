import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HandleState from '../components/common/HandleState.component';
import Spinner from '../components/common/Spinner.component';
import Alert from '../components/common/Alert.component';
import { getUserById } from '../services/users.service';
import UserCard from '../components/UserCard.component';

export function DetailsPage() {
	const [data, setData] = useState({});
	const [status, setStatus] = useState('pending');
	const [error, setError] = useState(null);
	const { id } = useParams();

	useEffect(() => {
		setStatus('pending');
		setError(null);

		(async () => {
			try {
				const data = await getUserById(id);
				setData(data);
				setStatus('success');
			} catch (error) {
				setError(error.message);
				setStatus('error');
			}
		})();
	}, [id]);

	function loadingState() {
		return (
			<div className='text-center '>
				<Spinner />
			</div>
		);
	}

	function errorState() {
		return (
			<div className='text-center'>
				<Alert
					type='danger'
					message={{
						text: error,
					}}
					inline
				/>
			</div>
		);
	}

	return (
		<main data-testid='details-page' className='py-5'>
			<div className='container'>
				<HandleState
					isLoading={status === 'pending'}
					hasError={status === 'error'}
					config={{
						loadingState,
						errorState,
					}}
				>
					{!!Object.keys(data).length && <UserCard {...data} />}
				</HandleState>
			</div>
		</main>
	);
}

export default DetailsPage;
