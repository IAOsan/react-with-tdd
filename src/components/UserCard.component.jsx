import React from 'react';
import PropTypes from 'prop-types';

function UserCard({ image, username, email }) {
	const defaultProfileImg = new URL('../assets/profile.png', import.meta.url);

	return (
		<div className='card text-center'>
			<div className='card-header'>
				<img
					src={image || defaultProfileImg}
					className='d-inline-block rounded-circle shadow'
					alt=''
					width={100}
				/>
			</div>
			<div className='card-body'>
				<h2 className=''>{username}</h2>
				<p>{email}</p>
			</div>
		</div>
	);
}

UserCard.propTypes = {
	image: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(URL)]),
	username: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
};

export default UserCard;
