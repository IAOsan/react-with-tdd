import React from 'react';
import UsersList from '../components/UsersList.component';

export function HomePage() {
	return (
		<main data-testid='home-page' className='py-5'>
			<div className='container'>
				<UsersList />
			</div>
		</main>
	);
}

export default HomePage;
