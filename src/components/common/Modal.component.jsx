import React from 'react';
import PropTypes from 'prop-types';
import HandleState from './HandleState.component';
import Spinner from './Spinner.component';

function Modal({
	id,
	labelledby,
	isHidden,
	title,
	body,
	closeLabel,
	confirmLabel,
	isLoading,
	onClose,
	onConfirm,
}) {
	function loadingState() {
		return (
			<div className='h-100 w-100 d-flex align-items-center justify-content-center'>
				<Spinner customClassname='text-light' />
			</div>
		);
	}

	return (
		<div
			className='modal fade bg-black bg-opacity-50 d-block show'
			id={id}
			tabIndex='-1'
			role='dialog'
			aria-labelledby={labelledby}
			aria-hidden={isHidden}
			data-testid='modal'
		>
			<HandleState isLoading={isLoading} config={{ loadingState }}>
				<div
					className='modal-dialog modal-dialog-centered'
					role='document'
				>
					<div className='modal-content'>
						<div className='modal-header'>
							{title && (
								<h5 className='modal-title' id={labelledby}>
									{title}
								</h5>
							)}
							<button
								onClick={onClose}
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'
							>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>{body()}</div>
						<div className='modal-footer'>
							<button
								onClick={onClose}
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'
								data-testid='modal-close-btn'
							>
								{closeLabel}
							</button>
							{confirmLabel && (
								<button
									onClick={onConfirm}
									type='button'
									className='btn btn-primary'
									data-testid='modal-confirm-btn'
								>
									{confirmLabel}
								</button>
							)}
						</div>
					</div>
				</div>
			</HandleState>
		</div>
	);
}

Modal.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	labelledby: PropTypes.string,
	isHidden: PropTypes.bool.isRequired,
	title: PropTypes.string,
	closeLabel: PropTypes.string.isRequired,
	confirmLabel: PropTypes.string,
	isLoading: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	onConfirm: PropTypes.func,
};

Modal.defaultProps = {
	closeLabel: 'Close',
};

export default Modal;
