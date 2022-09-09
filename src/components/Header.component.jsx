import React from 'react';
import Navbar from './common/Navbar.component';

function Header() {
	return (
		<header>
			<Navbar
				brand={{
					img: new URL('../assets/hoaxify.png', import.meta.url),
					label: 'Hoaxify',
				}}
				menu={[
					{
						label: 'Login',
						path: '/login',
					},
					{
						label: 'Sign up',
						path: '/signup',
					},
				]}
			/>
		</header>
	);
}

export default Header;
