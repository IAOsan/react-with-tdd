import { mswServer } from '../setupTestServer';
import { render, setupUser, waitFor } from '../test-utils';
import {
	failureEmailPostUser,
	failurePasswordPostUser,
	failureUsernamePostUser,
	requestTracker,
} from '../testServerHandlers';
import LoginPage from '../../pages/Login.page';

const user = setupUser();
const userCredentials = {
	username: 'user name',
	email: 'test@mail.com',
	password: '123456',
	confirmPassword: '123456',
};

describe('<LoginPage />', () => {
	let wrapper = renderLogin();
	let inputName,
		inputEmail,
		inputPassword,
		inputConfirmPassword,
		submitButton;

	beforeEach(() => {
		wrapper = renderLogin();
		inputName = wrapper.getByLabelText(/username/i);
		inputEmail = wrapper.getByLabelText(/email/i);
		inputPassword = wrapper.getByLabelText('Password');
		inputConfirmPassword = wrapper.getByLabelText('Confirm Password');
		submitButton = wrapper.getByRole('button', { name: /sign up/i });
	});

	it('should have heading', () => {
		const heading = wrapper.getByRole('heading', { name: /sign up/i });

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

	describe('interactions', () => {
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
});

function renderLogin() {
	return render(<LoginPage />);
}
