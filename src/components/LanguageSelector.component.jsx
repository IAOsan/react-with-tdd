import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSelector() {
	const { t, i18n } = useTranslation();
	const languages = [
		{ key: 'en', label: 'English' },
		{ key: 'es', label: 'Español' },
	];

	function handleChangeLanguage({ target }) {
		i18n.changeLanguage(target.value);
	}

	return (
		<div className='my-2'>
			<label htmlFor='languageSelector' className='me-2'>
				{t('selectLanguage')}
			</label>
			<select
				onChange={handleChangeLanguage}
				name='languages'
				id='languageSelector'
				defaultValue={i18n.language}
			>
				{languages.map(({ key, label }) => (
					<option key={key} value={key}>
						{label}
					</option>
				))}
			</select>
		</div>
	);
}

export default LanguageSelector;
