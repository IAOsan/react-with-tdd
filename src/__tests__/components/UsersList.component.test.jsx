import '../setupTestServer';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../../locale/i18n';
import { render, screen, waitFor, setupUser, act } from '../test-utils';
import UsersList from '../../components/UsersList.component';
import LanguageSelector from '../../components/LanguageSelector.component';
import en from '../../locale/en.json';
import es from '../../locale/es.json';

const renderList = () => {
	render(
		<MemoryRouter>
			<UsersList />
			<LanguageSelector />
		</MemoryRouter>
	);
};
const user = setupUser();

describe('<UsersList />', () => {
	const list = () => screen.getByRole('list'),
		listItem = (text) => screen.getByText(text),
		pageCounter = () => screen.getByTestId('page-counter'),
		nextButton = () => screen.getByRole('button', { name: /next/i }),
		prevButton = () => screen.getByRole('button', { name: /prev/i }),
		spinner = () => screen.queryByText(/loading.../i);

	describe('/*== interactions ==*/', () => {
		beforeEach(renderList);

		it('should displays spinner during api call is in progress', async () => {
			expect(spinner()).toBeInTheDocument();

			await waitFor(() => {
				expect(spinner()).toBeNull();
			});
		});

		it('should renders all users from api in the list', async () => {
			await waitFor(() => {
				expect(list().childElementCount).toBe(3);
				expect(listItem('aaa')).toBeInTheDocument();
				expect(listItem('bbb')).toBeInTheDocument();
				expect(listItem('ccc')).toBeInTheDocument();
			});
		});

		it('should displays page counter', async () => {
			await waitFor(() => {
				expect(pageCounter()).toBeInTheDocument();
				expect(pageCounter().textContent).toBe('1 / 3');
			});
		});

		it('should displays next page button', async () => {
			await waitFor(() => {
				expect(nextButton()).toBeInTheDocument();
			});
		});

		it('should displays next page when clicks button', async () => {
			await waitFor(async () => {
				await user.click(nextButton());
			});
			await waitFor(() => {
				expect(pageCounter().textContent).toBe('2 / 3');
				expect(listItem('ddd')).toBeInTheDocument();
				expect(listItem('eee')).toBeInTheDocument();
				expect(listItem('fff')).toBeInTheDocument();
			});
		});

		it('should disable next button at last page', async () => {
			await waitFor(async () => {
				await user.click(nextButton());
				await user.click(nextButton());
			});

			expect(pageCounter().textContent).toBe('3 / 3');
			expect(nextButton()).toBeDisabled();
		});

		it('should displays prev page button', async () => {
			await waitFor(() => {
				expect(prevButton()).toBeInTheDocument();
			});
		});

		it('should disable prev button at first page', async () => {
			await waitFor(() => {
				expect(pageCounter().textContent).toBe('1 / 3');
				expect(prevButton()).toBeDisabled();
			});
		});

		it('should displays prev page when clicks button', async () => {
			await waitFor(async () => {
				await user.click(nextButton());
			});

			await waitFor(() => {
				expect(pageCounter().textContent).toBe('2 / 3');
			});

			await waitFor(async () => {
				await user.click(prevButton());
			});

			await waitFor(() => {
				expect(pageCounter().textContent).toBe('1 / 3');
				expect(listItem('aaa')).toBeInTheDocument();
				expect(listItem('bbb')).toBeInTheDocument();
				expect(listItem('ccc')).toBeInTheDocument();
			});
		});
	});

	describe('/*== internationalization ==*/', () => {
		const header = (lng = en) => screen.getByText(lng.users),
			nextButton = (lng = en) =>
				screen.getByRole('button', { name: lng.nextPage }),
			prevButton = (lng = en) =>
				screen.getByRole('button', { name: lng.prevPage }),
			languageSelector = () =>
				document.getElementById('languageSelector');

		beforeEach(renderList);

		afterEach(() => {
			act(() => {
				i18n.changeLanguage('en');
			});
		});

		it('should initially displays header and page navigation in english', async () => {
			await waitFor(() => {
				expect(header()).toBeInTheDocument();
				expect(nextButton()).toBeInTheDocument();
				expect(prevButton()).toBeInTheDocument();
			});
		});

		it('should displays header and page navigation in spanish after change language', async () => {
			await waitFor(async () => {
				await user.selectOptions(languageSelector(), 'es');
			});

			expect(header(es)).toBeInTheDocument();
			expect(nextButton(es)).toBeInTheDocument();
			expect(prevButton(es)).toBeInTheDocument();
		});
	});
});
