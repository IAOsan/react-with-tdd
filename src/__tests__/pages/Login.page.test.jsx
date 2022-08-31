import '../setupTestServer';
import { render, setupUser, waitFor } from '../test-utils';
import { requestTracker } from '../testServerHandlers';
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
		const fillForm = async () => {
			await user.type(inputName, userCredentials.username);
			await user.type(inputEmail, userCredentials.email);
			await user.type(inputPassword, userCredentials.password);
			await user.type(
				inputConfirmPassword,
				userCredentials.confirmPassword
			);
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
	});
});

function renderLogin() {
	return render(<LoginPage />);
}
