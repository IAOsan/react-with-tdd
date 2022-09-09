import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllUsers } from '../services/users.service';
import Alert from './common/Alert.component';
import HandleState from './common/HandleState.component';
import List from './common/List.component';
import Spinner from './common/Spinner.component';
import UsersListItem from './UsersListItem.component';

function UsersList() {
	const { t } = useTranslation();
	const [data, setData] = useState({});
	const [currentPage, setCurrentPage] = useState(0);
	const [status, setStatus] = useState('idle');
	const [error, setError] = useState(null);
	const { page, totalPages, content = [] } = data || {};

	useEffect(() => {
		(async () => {
			setStatus('pending');
			setError(null);
			try {
				const data = await getAllUsers(currentPage);
				setData(data);
				setStatus('success');
			} catch (error) {
				setError(error);
				setStatus('error');
			}
		})();
	}, [currentPage]);

	function handleChangePage({ target }) {
		const { page } = target.dataset;

		if ((!page && page !== 0) || page < 0 || page >= totalPages) return;
		setCurrentPage(+page);
	}

	function loadingState() {
		return (
			<div className='text-center py-5'>
				<Spinner />
			</div>
		);
	}

	function errorState() {
		return (
			<div className='text-center py-5'>
				<Alert
					type='danger'
					message={{
						emphasis: 'Oops, something went wrong',
						text: error.message,
					}}
				/>
			</div>
		);
	}

	return (
		<section className='card'>
			<h2 className='card-header'>{t('users')}</h2>
			<HandleState
				isLoading={status === 'pending'}
				hasError={status === 'error'}
				config={{ loadingState, errorState }}
			>
				<List
					data={content}
					renderProps={(u) => <UsersListItem key={u.id} {...u} />}
				/>
				<div className='d-flex align-items-center justify-content-center py-4'>
					<button
						onClick={handleChangePage}
						data-page={currentPage - 1}
						className='btn btn-primary'
						type='button'
						disabled={currentPage === 0}
					>
						{t('prevPage')}
					</button>
					<span className='mx-2' data-testid='page-counter'>
						{+page + 1} / {totalPages}
					</span>
					<button
						onClick={handleChangePage}
						data-page={currentPage + 1}
						className='btn btn-primary'
						type='button'
						disabled={currentPage + 1 === totalPages}
					>
						{t('nextPage')}
					</button>
				</div>
			</HandleState>
		</section>
	);
}

export default UsersList;
