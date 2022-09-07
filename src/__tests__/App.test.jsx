import './setupTestServer';
import { render, screen, setupUser } from './test-utils';
import App from '../App';

const renderApp = () => {
	return render(<App />);
};

const user = setupUser();

describe('<App />', () => {
	let homePage,
		signUpPage,
		loginPage,
		detailsPage,
		accountActivationPage,
		linkLogin,
		linkSignup,
		linkHome;
	const navigate = (path) => window.history.pushState({}, '', path);
	const setup = (path = '/') => {
		navigate(path);
		renderApp();
		homePage = screen.queryByTestId('home-page');
		signUpPage = screen.queryByTestId('signup-page');
		loginPage = screen.queryByTestId('login-page');
		detailsPage = screen.queryByTestId('details-page');
		accountActivationPage = screen.queryByTestId('activation-page');
		linkLogin = screen.getByRole('link', { name: /login/i });
		linkSignup = screen.getByRole('link', { name: /sign up/i });
		linkHome = screen.getByRole('link', { name: /hoaxify/i });
	};

	it('should displays initially only home page', () => {
		setup();

		expect(homePage).toBeInTheDocument();
		expect(signUpPage).toBeNull();
		expect(loginPage).toBeNull();
		expect(detailsPage).toBeNull();
		expect(accountActivationPage).toBeNull();
	});

	it('should displays only sign up page in the route "/signup"', () => {
		setup('/signup');

		expect(signUpPage).toBeInTheDocument();
		expect(homePage).toBeNull();
		expect(loginPage).toBeNull();
		expect(detailsPage).toBeNull();
		expect(accountActivationPage).toBeNull();
	});

	it('should displays only login page in the route "/login"', () => {
		setup('/login');

		expect(loginPage).toBeInTheDocument();
		expect(signUpPage).toBeNull();
		expect(homePage).toBeNull();
		expect(detailsPage).toBeNull();
		expect(accountActivationPage).toBeNull();
	});

	it('should displays only user details page in the route "/user/:id"', () => {
		setup('/user/5');

		expect(detailsPage).toBeInTheDocument();
		expect(loginPage).toBeNull();
		expect(signUpPage).toBeNull();
		expect(homePage).toBeNull();
		expect(accountActivationPage).toBeNull();
	});

	it('should displays only account activation page in the route "/activate/:token"', () => {
		setup('/activate/abcd');

		expect(accountActivationPage).toBeInTheDocument();
		expect(detailsPage).toBeNull();
		expect(loginPage).toBeNull();
		expect(signUpPage).toBeNull();
		expect(homePage).toBeNull();
	});

	it('should redirects to homepage if route not exists', () => {
		setup('/somewhere');

		expect(homePage).toBeInTheDocument();
	});

	it('should have a link to the home page o navbar', () => {
		setup();

		expect(linkHome).toBeInTheDocument();
		expect(linkHome.getAttribute('href')).toBe('/');
	});

	it('should have a link to the login page o navbar', () => {
		setup();

		expect(linkLogin).toBeInTheDocument();
		expect(linkLogin.getAttribute('href')).toBe('/login');
	});

	it('should have a link to the sign up page o navbar', () => {
		setup();

		expect(linkSignup).toBeInTheDocument();
		expect(linkSignup.getAttribute('href')).toBe('/signup');
	});

	it('should displays login page after clicking Login', async () => {
		setup();
		await user.click(linkLogin);

		expect(screen.getByTestId('login-page')).toBeInTheDocument();
	});

	it('should displays signup page after clicking Sign up', async () => {
		setup();
		await user.click(linkSignup);

		expect(screen.getByTestId('signup-page')).toBeInTheDocument();
	});

	it('should displays home page after clicking brand logo', async () => {
		setup('/login');
		await user.click(linkHome);

		expect(screen.getByTestId('home-page')).toBeInTheDocument();
	});
});
