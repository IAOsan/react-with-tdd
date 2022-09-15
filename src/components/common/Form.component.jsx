import React from 'react';
import PropTypes from 'prop-types';
import FormInput from './FormInput.component';
import Spinner from './Spinner.component';
import { getClasName } from '../../constants/utils';

function Form({
	title,
	fields,
	submitLabel,
	disableSubmit,
	content,
	action,
	onSubmit,
	isLoading,
	customFormClass,
}) {
	const formClassname = getClasName(
		{ [customFormClass]: !!customFormClass },
		{ 'card border-secondary': !customFormClass }
	);

	return (
		<form onSubmit={onSubmit} className={formClassname}>
			{title && <h2 className='card-header'>{title}</h2>}

			<div className='card-body'>
				{fields.map((f, idx) => (
					<FormInput key={f.id || idx} {...f} />
				))}
				<button
					className='btn btn-primary btn-lg d-block w-100 mt-4'
					type='submit'
					disabled={disableSubmit}
				>
					{isLoading && <Spinner sm customClassname='me-2' />}
					<span>{submitLabel}</span>
				</button>
				{content && content()}
				{action && (
					<p className='mt-20 text-center'>
						{action.desc}
						<a href={action.path} className='mx-8 text-underline'>
							{action.label}
						</a>
					</p>
				)}
			</div>
		</form>
	);
}

Form.propTypes = {
	title: PropTypes.string,
	fields: PropTypes.array.isRequired,
	submitLabel: PropTypes.string,
	disableSubmit: PropTypes.bool,
	content: PropTypes.func,
	customFormClass: PropTypes.string,
	action: PropTypes.shape({
		desc: PropTypes.string.isRequired,
		path: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	}),
	onSubmit: PropTypes.func.isRequired,
};

Form.defaultProps = {
	fields: [],
	submitLabel: 'Submit',
	disableSubmit: false,
};

export default Form;
