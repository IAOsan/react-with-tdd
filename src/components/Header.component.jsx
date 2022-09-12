import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from './common/Navbar.component';

function Header() {
	const { isAuth, user } = useSelector((state) => state.auth);

	return (
		<header>
			<Navbar
				brand={{
					img: new URL('../assets/hoaxify.png', import.meta.url),
					label: 'Hoaxify',
				}}
				content={() => {
					return !isAuth ? (
						<>
							<li className='nav-item'>
								<Link className='nav-link' to='/login'>
									Login
								</Link>
							</li>
							<li className='nav-item'>
								<Link className='nav-link' to='/signup'>
									Sign up
								</Link>
							</li>
						</>
					) : (
						<li className='nav-item'>
							<Link className='nav-link' to={`/user/${user.id}`}>
								My Profile
							</Link>
						</li>
					);
				}}
			/>
		</header>
	);
}

export default Header;
