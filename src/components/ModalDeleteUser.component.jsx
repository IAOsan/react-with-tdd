import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './common/Modal.component';

function ModalDeleteUser({ isLoading, onDelete }) {
	const { t } = useTranslation();
	const [isModalVisible, setIsModalVisible] = useState(false);

	return (
		<>
			<button
				onClick={() => setIsModalVisible(true)}
				className='btn btn-danger mx-1'
				type='button'
				data-toggle='modal'
				data-target='#exampleModalCenter'
			>
				{t('deleteMyAccount')}
			</button>
			{isModalVisible && (
				<Modal
					id='confirmDeleteModal'
					labelledby='confirmDeleteModalTitle'
					isHidden={isModalVisible}
					body={() => <p>{t('accountDeletionMessage')}</p>}
					closeLabel={t('cancel')}
					confirmLabel={t('yes')}
					onClose={() => setIsModalVisible(false)}
					onConfirm={onDelete}
					isLoading={isLoading}
				/>
			)}
		</>
	);
}

export default ModalDeleteUser;
