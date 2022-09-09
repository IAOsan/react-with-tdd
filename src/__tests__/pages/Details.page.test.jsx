import '../setupTestServer';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor } from '../test-utils';
import DetailsPage from '../../pages/Details.page';

function renderPage(entries = ['/user/1']) {
	render(
		<MemoryRouter initialEntries={entries}>
			<Routes>
				<Route path='/user/:id' element={<DetailsPage />} />
			</Routes>
		</MemoryRouter>
	);
}

describe('<DetailsPage />', () => {
	const user = (text) => screen.getByText(text || 'aaa'),
		spinner = () => screen.queryByText(/loading.../i);

	it('should displays user name if user is found', async () => {
		renderPage();

		await waitFor(() => {
			user('aaa');
		}, 1000);
	});

	it('should displays spinner when api call is in progress', async () => {
		renderPage();

		expect(spinner()).toBeInTheDocument();

		await waitFor(() => {
			expect(spinner()).toBeNull();
		});
	});

	it('should displays alert when user not found', async () => {
		renderPage(['/user/abcd']);

		await waitFor(() => {
			expect(screen.getByText('User not found')).toBeInTheDocument();
		});
	});
});
