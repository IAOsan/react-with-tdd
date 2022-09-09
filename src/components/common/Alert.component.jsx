import React from 'react';
import PropTypes from 'prop-types';
import { getClasName } from '../../constants/utils';

function Alert({ type, message, inline }) {
	const alertClassname = getClasName(
		'alert',
		{
			'alert-success': type === 'success',
		},
		{
			'alert-danger': type === 'danger',
		},
		{
			'd-inline-block': inline,
		}
	);

	return (
		<div className={alertClassname}>
			{message.emphasis && <strong>{message.emphasis}</strong>}{' '}
			{message.text}
		</div>
	);
}

Alert.propTypes = {
	type: PropTypes.oneOf(['success', 'danger']).isRequired,
	message: PropTypes.shape({
		emphasis: PropTypes.string,
		text: PropTypes.string.isRequired,
	}).isRequired,
	inline: PropTypes.bool,
};

Alert.defaultProps = {
	inline: false,
};

export default Alert;
