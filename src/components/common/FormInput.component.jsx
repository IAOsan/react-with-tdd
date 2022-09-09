import React from 'react';
import PropTypes from 'prop-types';
import { getClasName } from '../../constants/utils';

function FormInput({
	id,
	label,
	error,
	customGroupClass,
	customInputClass,
	...rest
}) {
	const groupClassname = getClasName(
		{ [customGroupClass]: !!customGroupClass },
		{ 'form-group py-2': !customGroupClass }
	);
	const inputClassname = getClasName(
		{ [customInputClass]: !!customInputClass },
		{ 'form-control': !customInputClass },
		{ 'is-invalid': !!error }
	);

	return (
		<div className={groupClassname}>
			{label && <label htmlFor={id}>{label}</label>}
			<input id={id} className={inputClassname} {...rest} />
			{error && <p className='invalid-feedback'>{error}</p>}
		</div>
	);
}

FormInput.propTypes = {
	type: PropTypes.string,
	name: PropTypes.string.isRequired,
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	label: PropTypes.string,
	placeholder: PropTypes.string,
	value: PropTypes.string,
	error: PropTypes.string,
	onChange: PropTypes.func,
};

export default FormInput;
