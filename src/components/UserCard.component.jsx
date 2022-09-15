import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useForm from '../hooks/useForm';
import { updateUser, logout } from '../store/auth/auth.slice';
import * as usersService from '../services/users.service';
import Form from './common/Form.component';
import Modal from './common/Modal.component';

function UserCard({ id, image, username, email }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [status, setStatus] = useState('idle');
	const [isEditMode, setIsEditMode] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { user } = useSelector((state) => state.auth);
	const { formData, resetFormData, handleSubmit, handleChange } = useForm(
		{ username: username },
		null,
		doSubmit
	);
	const defaultProfileImg = new URL('../assets/profile.png', import.meta.url);
	const canRenderEditBtn = !!user && user.id === id;

	async function doSubmit() {
		setStatus('loading');
		try {
			await usersService.updateUserById({
				...formData,
				id,
			});
			dispatch(updateUser(formData));
			setIsEditMode(false);
			setStatus('success');
		} catch (error) {
			console.log(error);
			setStatus('error');
		}
	}

	function handleCancel() {
		setIsEditMode(false);
		resetFormData({ username: user.username });
	}

	async function handleDelete() {
		setStatus('loading');
		try {
			await usersService.deleteUserById(id);
			dispatch(logout);
			navigate('/', { replace: true });
		} catch (error) {
			console.log(error);
			setStatus('error');
		}
	}

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
				{isEditMode ? (
					<Form
						fields={[
							{
								id: 'inputName',
								name: 'username',
								label: 'Change your username',
								type: 'text',
								value: formData.username,
								onChange: handleChange,
							},
						]}
						submitLabel={t('save')}
						onSubmit={handleSubmit}
						isLoading={status === 'loading'}
						disableSubmit={status === 'loading'}
						content={() => (
							<button
								onClick={handleCancel}
								className='btn btn-danger d-block w-100 mt-3'
								type='button'
							>
								{t('cancel')}
							</button>
						)}
					/>
				) : (
					<>
						<h2>{formData.username}</h2>
						<p>{email}</p>
						{canRenderEditBtn && (
							<>
								<button
									onClick={() => setIsEditMode(true)}
									className='btn btn-warning mx-1'
									type='button'
								>
									{t('edit')}
								</button>
								<button
									onClick={() => setIsModalVisible(true)}
									className='btn btn-danger mx-1'
									type='button'
									data-toggle='modal'
									data-target='#exampleModalCenter'
								>
									{t('deleteMyAccount')}
								</button>
							</>
						)}
					</>
				)}
				{isModalVisible && (
					<Modal
						id='confirmDeleteModal'
						labelledby='confirmDeleteModalTitle'
						isHidden={isModalVisible}
						body={() => <p>{t('accountDeletionMessage')}</p>}
						closeLabel={t('cancel')}
						confirmLabel={t('yes')}
						onClose={() => setIsModalVisible(false)}
						onConfirm={handleDelete}
						isLoading={status === 'loading'}
					/>
				)}
			</div>
		</div>
	);
}

UserCard.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	image: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(URL)]),
	username: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
};

export default UserCard;
