import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store/auth/auth.slice';
import Navbar from './common/Navbar.component';

function Header() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
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
									{t('login')}
								</Link>
							</li>
							<li className='nav-item'>
								<Link className='nav-link' to='/signup'>
									{t('signUp')}
								</Link>
							</li>
						</>
					) : (
						<>
							<li className='nav-item'>
								<Link
									className='nav-link'
									to={`/user/${user.id}`}
								>
									{t('myProfile')}
								</Link>
							</li>
							<li className='nav-item'>
								<Link
									onClick={(e) => {
										e.preventDefault();
										dispatch(logout);
									}}
									className='nav-link'
									to={`/user/${user.id}`}
								>
									{t('logout')}
								</Link>
							</li>
						</>
					);
				}}
			/>
		</header>
	);
}

export default Header;
