import './setupTestServer';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, screen, setupUser, waitFor } from './test-utils';
import createStore, { STATE_KEY } from '../store/storeConfig';
import * as storageService from '../services/storage.service';
import App from '../App';

const renderApp = (entries = ['/']) => {
	const store = createStore();

	return renderWithProviders(
		<MemoryRouter initialEntries={entries}>
			<App />
		</MemoryRouter>,
		{
			store,
		}
	);
};

const user = setupUser();

describe('<App />', () => {
	const homePage = () => screen.queryByTestId('home-page'),
		signUpPage = () => screen.queryByTestId('signup-page'),
		loginPage = () => screen.queryByTestId('login-page'),
		detailsPage = () => screen.queryByTestId('details-page'),
		accountActivationPage = () => screen.queryByTestId('activation-page'),
		linkLogin = () => screen.queryByRole('link', { name: /login/i }),
		linkSignup = () => screen.queryByRole('link', { name: /sign up/i }),
		linkHome = () => screen.queryByRole('link', { name: /hoaxify/i });

	function setup(path = '/') {
		renderApp([path]);
	}

	it('should displays initially only home page', () => {
		setup();

		expect(homePage()).toBeInTheDocument();
		expect(signUpPage()).toBeNull();
		expect(loginPage()).toBeNull();
		expect(detailsPage()).toBeNull();
		expect(accountActivationPage()).toBeNull();
	});

	it('should displays only sign up page in the route "/signup"', () => {
		setup('/signup');

		expect(signUpPage()).toBeInTheDocument();
		expect(homePage()).toBeNull();
		expect(loginPage()).toBeNull();
		expect(detailsPage()).toBeNull();
		expect(accountActivationPage()).toBeNull();
	});

	it('should displays only login page in the route "/login"', () => {
		setup('/login');

		expect(loginPage()).toBeInTheDocument();
		expect(signUpPage()).toBeNull();
		expect(homePage()).toBeNull();
		expect(detailsPage()).toBeNull();
		expect(accountActivationPage()).toBeNull();
	});

	it('should displays only user details page in the route "/user/:id"', () => {
		setup('/user/5');

		expect(detailsPage()).toBeInTheDocument();
		expect(loginPage()).toBeNull();
		expect(signUpPage()).toBeNull();
		expect(homePage()).toBeNull();
		expect(accountActivationPage()).toBeNull();
	});

	it('should displays only account activation page in the route "/activate/:token"', () => {
		setup('/activate/abcd');

		expect(accountActivationPage()).toBeInTheDocument();
		expect(detailsPage()).toBeNull();
		expect(loginPage()).toBeNull();
		expect(signUpPage()).toBeNull();
		expect(homePage()).toBeNull();
	});

	it('should redirects to homepage if route not exists', () => {
		setup('/somewhere');

		expect(homePage()).toBeInTheDocument();
	});

	it('should have a link to the home page o navbar', () => {
		setup();

		expect(linkHome()).toBeInTheDocument();
		expect(linkHome().getAttribute('href')).toBe('/');
	});

	it('should have a link to the login page o navbar', () => {
		setup();

		expect(linkLogin()).toBeInTheDocument();
		expect(linkLogin().getAttribute('href')).toBe('/login');
	});

	it('should have a link to the sign up page o navbar', () => {
		setup();

		expect(linkSignup()).toBeInTheDocument();
		expect(linkSignup().getAttribute('href')).toBe('/signup');
	});

	it('should displays login page after clicking Login', async () => {
		setup();
		await user.click(linkLogin());

		expect(loginPage()).toBeInTheDocument();
	});

	it('should displays signup page after clicking Sign up', async () => {
		setup();
		await user.click(linkSignup());

		expect(signUpPage()).toBeInTheDocument();
	});

	it('should displays home page after clicking brand logo', async () => {
		setup('/login');
		await user.click(linkHome());

		expect(homePage()).toBeInTheDocument();
	});

	it('should navigate to user page when clicks user name in the list', async () => {
		setup();

		await user.click(await screen.findByRole('link', { name: 'aaa' }));

		expect(detailsPage()).toBeInTheDocument();
	});

	describe('/*== login ==*/', () => {
		const inputEmail = () => screen.getByLabelText(/e-mail/i),
			inputPassword = () => screen.getByLabelText(/password/i),
			submitButton = () =>
				screen.getByRole('button', { name: /sign in/i }),
			profileLink = () =>
				screen.queryByRole('link', { name: /my profile/i });

		async function fillForm() {
			await user.type(inputEmail(), 'aaa@mail.com');
			await user.type(inputPassword(), '123456');
		}

		afterEach(storageService.clear);

		it('should redirects to home page after succesful login', async () => {
			setup('/login');

			await fillForm();
			await user.click(submitButton());

			await waitFor(() => {
				expect(screen.getByTestId('home-page')).toBeInTheDocument();
			}, 1000);
		});

		it('should hides sign up and login buttons from navbar after succesful login', async () => {
			setup('/login');
			await fillForm();
			await user.click(submitButton());

			await waitFor(() => {
				expect(linkLogin()).toBeNull();
				expect(linkSignup()).toBeNull();
			}, 1000);
		});

		it('should displays profile link in navbar after successful login', async () => {
			setup('/login');

			expect(profileLink()).toBeNull();

			await fillForm();
			await user.click(submitButton());

			await waitFor(() => {
				expect(profileLink()).toBeInTheDocument();
			}, 1000);
		});

		it('should displays user page after clicks my profile link', async () => {
			setup('/login');

			await fillForm();
			await user.click(submitButton());

			await waitFor(async () => {
				await user.click(profileLink());
				expect(detailsPage()).toBeInTheDocument();
				expect(await screen.findByText('aaa')).toBeInTheDocument();
			});
		});

		it('should store auth in localStorage after successful login', async () => {
			setup('/login');

			await fillForm();
			await user.click(submitButton());

			await waitFor(async () => {
				const persistedState = storageService.getItem(STATE_KEY);
				expect(persistedState.auth).toEqual({
					user: {
						id: 1,
						username: 'aaa',
						email: 'aaa@mail.com',
						token: 'abcdef',
						image: null,
					},
					isAuth: true,
					status: 'success',
					error: null,
				});
			});
		});

		it('should restore state in local storage', async () => {
			storageService.setItem(STATE_KEY, {
				auth: {
					user: {
						id: 1,
						username: 'aaa',
						email: 'aaa@mail.com',
						image: null,
					},
					isAuth: true,
					status: 'success',
					error: null,
				},
			});
			setup();

			await waitFor(() => {
				expect(profileLink()).toBeInTheDocument();
			});
		});
	});
});
