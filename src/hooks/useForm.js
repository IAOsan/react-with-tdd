import { useState } from 'react';

function useForm(formSchema, validationSchema, action, cleanAfter = false) {
	const [formData, setFormData] = useState(formSchema);
	const [errors, setErrors] = useState({});

	function resetFormData(initialData) {
		const emptyData = Object.keys(formData).reduce((acc, k) => {
			acc[k] = '';
			return acc;
		}, {});

		setFormData(initialData ? initialData : emptyData);
	}

	function cleanup(form) {
		const elements = form.elements;
		resetFormData();
		Object.keys(formData).forEach((k) => {
			elements[k].blur();
		});
	}

	function cleanUpErrors(name) {
		if (!errors[name]) return;
		setErrors((prevState) => {
			const newErrors = { ...prevState };
			delete newErrors[name];
			return newErrors;
		});
	}

	function handleChange({ target }) {
		setFormData((prevData) => ({
			...prevData,
			[target.name]: target.value,
		}));
		cleanUpErrors(target.name);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		const errors = validate(formData);
		setErrors(errors);

		if (!Object.keys(errors).length && !!action) {
			action();
			if (cleanAfter) cleanup(e.target);
		}
	}

	function validate(data) {
		const { error } = validationSchema?.validate(data) || {};
		const errors = error?.details.reduce((acc, err) => {
			const {
				path: [name],
				message,
			} = err;
			acc[name] = message;
			return acc;
		}, {});

		return errors || {};
	}

	return {
		formData,
		resetFormData,
		errors,
		setErrors,
		handleSubmit,
		handleChange,
	};
}

export default useForm;
