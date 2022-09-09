import { mswServer } from '../setupTestServer';
import i18n from '../../locale/i18n';
import { render, setupUser, waitFor, screen, act } from '../test-utils';
import {
	failureEmailPostUser,
	failurePasswordPostUser,
	failureUsernamePostUser,
	requestTracker,
} from '../testServerHandlers';
import SignUpPage from '../../pages/SignUp.page';
import en from '../../locale/en.json';
import es from '../../locale/es.json';
import LanguageSelector from '../../components/LanguageSelector.component';

const renderLogin = () =>
	render(
		<>
			<SignUpPage />
			<LanguageSelector />
		</>
	);
const user = setupUser();
const userCredentials = {
	username: 'user name',
	email: 'test@mail.com',
	password: '123456',
	confirmPassword: '123456',
};

describe('<SignUpPage />', () => {
	let wrapper,
		inputName,
		inputEmail,
		inputPassword,
		inputConfirmPassword,
		submitButton;

	const setup = () => {
		wrapper = renderLogin();
		inputName = wrapper.getByLabelText(/username/i);
		inputEmail = wrapper.getByLabelText(/e-mail/i);
		inputPassword = wrapper.getByLabelText('Password');
		inputConfirmPassword = wrapper.getByLabelText('Confirm Password');
		submitButton = wrapper.getByRole('button', { name: /sign up/i });
	};

	const fillForm = async (values) => {
		const credentials = {
			...userCredentials,
			...values,
		};

		await user.type(inputName, credentials.username);
		await user.type(inputEmail, credentials.email);
		await user.type(inputPassword, credentials.password);
		await user.type(inputConfirmPassword, credentials.confirmPassword);
	};

	describe('/*== layout ==*/', () => {
		beforeEach(setup);

		it('should have heading', () => {
			const heading = screen.getByRole('heading', { name: /sign up/i });

			expect(heading).toBeInTheDocument();
		});

		it('should have username input', () => {
			expect(inputName).toBeInTheDocument();
		});

		it('should have email input', () => {
			expect(inputEmail).toBeInTheDocument();
		});

		it('should email input to be type of email', () => {
			expect(inputEmail).toHaveAttribute('type', 'email');
		});

		it('should have password input', () => {
			expect(inputPassword).toBeInTheDocument();
		});

		it('should have confirm password input', () => {
			expect(inputConfirmPassword).toBeInTheDocument();
		});

		it('should password inputs to be type of password', () => {
			expect(inputPassword).toHaveAttribute('type', 'password');
			expect(inputConfirmPassword).toHaveAttribute('type', 'password');
		});

		it('should have sign up button', () => {
			expect(submitButton).toBeInTheDocument();
		});

		it('should sign up button initially be disabled', () => {
			expect(submitButton).toBeDisabled();
		});
	});

	describe('/*== interactions ==*/', () => {
		beforeEach(setup);

		it('should submit button be enabled if password and confirmPassword inputs have the same value', async () => {
			await fillForm();
			expect(submitButton).not.toBeDisabled();
		});

		it('should make request when submitted', async () => {
			await fillForm();
			await user.click(submitButton);

			expect(requestTracker[0].body).toEqual(userCredentials);
		});

		it('should disable submit button when making api request', async () => {
			await fillForm();
			await user.click(submitButton);
			await user.click(submitButton);

			expect(requestTracker).toHaveLength(1);
		});

		it('should display spinner after clicking submit button', async () => {
			await fillForm();

			expect(
				document.querySelector('.spinner-border')
			).not.toBeInTheDocument();

			await user.click(submitButton);

			expect(
				document.querySelector('.spinner-border')
			).toBeInTheDocument();
		});

		it('should display account activation notification after successful signup', async () => {
			await fillForm();
			await user.click(submitButton);

			expect(
				await wrapper.findByText(
					/please check your e-mail to activate your account/i
				)
			).toBeInTheDocument();
		});

		it('should hide form after successful signup', async () => {
			await fillForm();
			await user.click(submitButton);

			await waitFor(() => {
				expect(document.querySelector('form')).not.toBeInTheDocument();
			});
		});

		it('should display validation errors for username', async () => {
			mswServer.use(failureUsernamePostUser);

			await fillForm({
				username: ' ',
			});
			await user.click(submitButton);

			expect(
				wrapper.getByText('Must have min 4 and max 32 characters')
			).toBeInTheDocument();
		});

		it('should hides spinner and enable submit button after request finished', async () => {
			mswServer.use(failureUsernamePostUser);

			await fillForm({
				username: ' ',
			});
			await user.click(submitButton);

			expect(
				document.querySelector('.spinner-border')
			).not.toBeInTheDocument();
			expect(submitButton).toBeEnabled();
		});

		it('should display validation errors for email', async () => {
			mswServer.use(failureEmailPostUser);

			await fillForm({
				email: 'someEmail@mail',
			});
			await user.click(submitButton);

			expect(
				wrapper.getByText('E-mail is not valid')
			).toBeInTheDocument();
		});

		it('should display validation errors for password', async () => {
			mswServer.use(failurePasswordPostUser);

			await fillForm();
			await user.click(submitButton);

			expect(
				wrapper.getByText('Password must be at least 6 characters')
			).toBeInTheDocument();
		});

		it('should display validation errors for password', async () => {
			await fillForm({
				password: 'hello world',
				confirmPassword: 'hello',
			});
			await user.click(submitButton);

			expect(wrapper.getByText('Password mismatch')).toBeInTheDocument();
		});

		it('should clear validation error when change username input', async () => {
			mswServer.use(failureUsernamePostUser);

			await fillForm({
				username: 'ba',
			});
			await user.click(submitButton);
			await user.type(inputName, 'tman');

			expect(
				wrapper.queryByText('Must have min 4 and max 32 characters')
			).toBeNull();
		});

		it('should clear validation error when change email input', async () => {
			mswServer.use(failureEmailPostUser);

			await fillForm({
				email: 'someEmail@mail',
			});
			await user.click(submitButton);
			await user.type(inputEmail, '.com');

			expect(wrapper.queryByText('E-mail is not valid')).toBeNull();
		});

		it('should clear validation error when change password input', async () => {
			mswServer.use(failurePasswordPostUser);

			await fillForm();
			await user.click(submitButton);
			await user.type(inputPassword, 'Updated1');

			expect(
				wrapper.queryByText('Password must be at least 6 characters')
			).toBeNull();
		});
	});

	describe('/*== internationalziation ==*/', () => {
		let langSelector, heading, currentLng;
		const changeLang = async (lng) => {
			await user.selectOptions(langSelector, lng);
		};
		const setup = () => {
			currentLng = i18n.language;
			const languages = {
				en,
				es,
			};
			const language = languages[currentLng];

			heading = screen.getByRole('heading', { name: language.signUp });
			inputName = screen.getByLabelText(language.username);
			inputEmail = screen.getByLabelText(language.email);
			inputPassword = screen.getByLabelText(language.password);
			inputConfirmPassword = screen.getByLabelText(
				language.confirmPassword
			);
			submitButton = screen.getByRole('button', {
				name: language.signUp,
			});
		};

		beforeEach(() => {
			wrapper = renderLogin();
			langSelector = document.getElementById('languageSelector');
		});

		afterEach(() => {
			act(() => {
				i18n.changeLanguage('en');
			});
		});

		it('should initially displays text in english', async () => {
			setup();

			expect(currentLng).toBe('en');
			expect(heading).toBeInTheDocument();
			expect(inputName).toBeInTheDocument();
			expect(inputEmail).toBeInTheDocument();
			expect(inputPassword).toBeInTheDocument();
			expect(inputConfirmPassword).toBeInTheDocument();
		});

		it('should displays text in spanish after change language', async () => {
			await changeLang('es');

			setup();

			expect(currentLng).toBe('es');
			expect(heading).toBeInTheDocument();
			expect(inputName).toBeInTheDocument();
			expect(inputEmail).toBeInTheDocument();
			expect(inputPassword).toBeInTheDocument();
			expect(inputConfirmPassword).toBeInTheDocument();
		});

		it('should displays text in english after change language', async () => {
			await changeLang('es');
			await changeLang('en');

			setup();

			expect(currentLng).toBe('en');
			expect(heading).toBeInTheDocument();
			expect(inputName).toBeInTheDocument();
			expect(inputEmail).toBeInTheDocument();
			expect(inputPassword).toBeInTheDocument();
			expect(inputConfirmPassword).toBeInTheDocument();
		});

		it('should displays password validation in spanish', async () => {
			await changeLang('es');

			setup();
			await user.type(inputPassword, '12345');
			await user.type(inputConfirmPassword, 'hello');

			expect(
				screen.getByText(es.passwordMismatchMsg)
			).toBeInTheDocument();
		});

		it('should sends accept language header as "en" for outgoing request', async () => {
			setup();

			await fillForm();
			await user.click(submitButton);

			const [request] = requestTracker;

			expect(request.headers.get('Accept-Language')).toBe('en');
		});

		it('should sends accept language header as "es" for outgoing request after change language', async () => {
			await changeLang('es');
			setup();

			await fillForm();
			await user.click(submitButton);

			const [request] = requestTracker;

			expect(request.headers.get('Accept-Language')).toBe('es');
		});
	});
});
