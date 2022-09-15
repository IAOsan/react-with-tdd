import '../setupTestServer';
import i18n from '../../locale/i18n';
import { MemoryRouter } from 'react-router-dom';
import {
	renderWithProviders,
	setupUser,
	waitFor,
	screen,
	act,
	waitForElementToBeRemoved,
} from '../test-utils';
import { requestTracker } from '../testServerHandlers';
import LoginPage from '../../pages/Login.page';
import LanguageSelector from '../../components/LanguageSelector.component';
import * as storageService from '../../services/storage.service';
import createStore from '../../store/storeConfig';
import { STATE_KEY } from '../../config';
import en from '../../locale/en.json';
import es from '../../locale/es.json';

const renderLogin = () => {
	const store = createStore();

	renderWithProviders(
		<MemoryRouter>
			<LoginPage />
			<LanguageSelector />
		</MemoryRouter>,
		{ store }
	);
};
const user = setupUser();
const userCredentials = {
	email: 'aaa@mail.com',
	password: '123456',
};

describe('<LoginPage />', () => {
	const heading = (lang = en) =>
			screen.getByRole('heading', { name: lang.signIn }),
		inputEmail = (lang = en) => screen.getByLabelText(lang.email),
		inputPassword = (lang = en) => screen.getByLabelText(lang.password),
		submitButton = (lang = en) =>
			screen.getByRole('button', { name: lang.signIn }),
		spinner = () => screen.queryByText(/loading.../i),
		currentLang = () => i18n.language,
		langSelector = () => document.getElementById('languageSelector');

	async function fillForm(overrides = {}) {
		const languages = { en, es };
		const lang = currentLang();
		const credentials = {
			...userCredentials,
			...overrides,
		};

		await user.type(inputEmail(languages[lang]), credentials.email);
		await user.type(inputPassword(languages[lang]), credentials.password);
	}

	describe('/*== layout ==*/', () => {
		beforeEach(renderLogin);

		it('should have heading', () => {
			expect(heading()).toBeInTheDocument();
		});

		it('should have email input', () => {
			expect(inputEmail()).toBeInTheDocument();
		});

		it('should email input to be type of email', () => {
			expect(inputEmail()).toHaveAttribute('type', 'email');
		});

		it('should have password input', () => {
			expect(inputPassword()).toBeInTheDocument();
		});

		it('should have login button', () => {
			expect(submitButton()).toBeInTheDocument();
		});

		it('should login button initially be disabled', () => {
			expect(submitButton()).toBeDisabled();
		});
	});

	describe('/*== interactions ==*/', () => {
		beforeEach(renderLogin);
		afterEach(storageService.clear);

		it('should enable submit if the form are filled', async () => {
			await fillForm();

			expect(submitButton()).toBeEnabled();
		});

		it('should displays spinner only during api call', async () => {
			await fillForm();

			expect(spinner()).toBeNull();

			await user.click(submitButton());

			expect(spinner()).toBeInTheDocument();
		});

		it('should send email and password when submit', async () => {
			await fillForm();
			await user.click(submitButton());

			await waitFor(() => {
				expect(requestTracker[0].body).toEqual({
					email: userCredentials.email,
					password: userCredentials.password,
				});
			});
		});

		it('should disable submit when there is an api call', async () => {
			await fillForm();
			await user.dblClick(submitButton());

			await waitFor(() => {
				expect(requestTracker).toHaveLength(1);
			});
		});

		it('should displays authentication error message', async () => {
			await fillForm({
				email: 'failure@mail.com',
			});
			await user.click(submitButton());

			await waitFor(() => {
				expect(
					screen.getByText(/email or password are wrong/i)
				).toBeInTheDocument();
			});
		});

		it('should clear authentication error when email change', async () => {
			await fillForm({
				email: 'failure@mail.com',
			});
			await user.click(submitButton());
			await user.type(inputEmail(), 'other@mail.com');

			expect(screen.queryByText(/user not found/i)).toBeNull();
		});

		it('should clear authentication error when password change', async () => {
			await fillForm({
				email: 'failure@mail.com',
			});
			await user.click(submitButton());
			await user.type(inputPassword(), 'otherPassword');

			expect(screen.queryByText(/user not found/i)).toBeNull();
		});

		it('should stores id username image and token in localstorage', async () => {
			await fillForm();
			await user.click(submitButton());

			await waitForElementToBeRemoved(spinner());

			await waitFor(() => {
				const persistedState = storageService.getItem(STATE_KEY);
				const objectKeys = Object.keys(persistedState.auth.user);
				expect(objectKeys.includes('id')).toBeTruthy();
				expect(objectKeys.includes('username')).toBeTruthy();
				expect(objectKeys.includes('image')).toBeTruthy();
				expect(objectKeys.includes('token')).toBeTruthy();
			});
		});
	});

	describe('/*== internationalziation ==*/', () => {
		async function changeLang(lang) {
			await user.selectOptions(langSelector(), lang);
		}

		beforeEach(renderLogin);
		afterEach(storageService.clear);

		afterEach(() => {
			act(() => {
				i18n.changeLanguage('en');
			});
		});

		it('should initially displays text in english', async () => {
			expect(currentLang()).toBe('en');
			expect(heading()).toBeInTheDocument();
			expect(inputEmail()).toBeInTheDocument();
			expect(inputPassword()).toBeInTheDocument();
		});

		it('should displays text in spanish after change language', async () => {
			await changeLang('es');

			expect(currentLang()).toBe('es');
			expect(heading(es)).toBeInTheDocument();
			expect(inputEmail(es)).toBeInTheDocument();
			expect(inputPassword(es)).toBeInTheDocument();
		});

		it('should displays text in english after change language', async () => {
			await changeLang('es');
			await changeLang('en');

			expect(currentLang()).toBe('en');
			expect(heading()).toBeInTheDocument();
			expect(inputEmail()).toBeInTheDocument();
			expect(inputPassword()).toBeInTheDocument();
		});

		it('should sends accept language header as "en" for outgoing request', async () => {
			await fillForm();
			await user.keyboard('{Enter>1}');

			const [request] = requestTracker;

			expect(request.headers.get('Accept-Language')).toBe('en');
		});

		it('should sends accept language header as "es" for outgoing request after change language', async () => {
			await changeLang('es');

			await fillForm();
			await user.keyboard('{Enter>1}');

			const [request] = requestTracker;

			expect(request.headers.get('Accept-Language')).toBe('es');
		});
	});
});
