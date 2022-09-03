import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSelector() {
	const { i18n } = useTranslation();
	const languages = [
		{ key: 'en', label: 'English' },
		{ key: 'es', label: 'Español' },
	];

	function handleChangeLanguage({ target }) {
		i18n.changeLanguage(target.value);
	}

	return (
		<div className='mx-4 my-2'>
			<label htmlFor='languageSelector' className='mr-2'>
				Select language
			</label>
			<select
				onChange={handleChangeLanguage}
				name='languages'
				id='languageSelector'
				defaultValue='en'
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
