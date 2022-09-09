import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function UsersListItem({ id, username, image }) {
	const defaultImageSrc = new URL('../assets/profile.png', import.meta.url);

	return (
		<li className='list-group-item list-group-item-action'>
			<img
				className='d-inline-block me-2 rounded-circle'
				src={image || defaultImageSrc}
				width='50'
				alt=''
			/>
			<Link to={`/user/${id}`}>{username}</Link>
		</li>
	);
}

UsersListItem.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	username: PropTypes.string,
};

export default UsersListItem;
