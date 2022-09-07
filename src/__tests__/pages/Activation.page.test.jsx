import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '../test-utils';
import ActivationPage from '../../pages/Activation.page';
import { mswServer } from '../setupTestServer';
import {
	requestTracker,
	failureAccountActivation,
} from '../testServerHandlers';

const renderPage = (entries = ['/activate/123']) => {
	return render(
		<MemoryRouter initialEntries={entries}>
			<Routes>
				<Route path='/activate/:token' element={<ActivationPage />} />
			</Routes>
		</MemoryRouter>
	);
};

describe('<ActivationPage />', () => {
	it('should displays successful activation message when token is valid', async () => {
		renderPage();

		const message = await screen.findByText(/activated account/i);
		expect(message).toBeInTheDocument();
	});

	it('should sends activation request', async () => {
		renderPage();

		await waitFor(() => {
			expect(requestTracker).toHaveLength(1);
		}, 1000);
	});

	it('should displays failure activation message when token is invalid', async () => {
		mswServer.use(failureAccountActivation);
		renderPage();

		const message = await screen.findByText(/activation failure/i);
		expect(message).toBeInTheDocument();
	});

	it('should display spinner during activation api call', async () => {
		renderPage();

		expect(screen.queryByText(/Loading.../i)).toBeInTheDocument();
		await waitFor(() => {
			expect(screen.queryByText(/Loading.../i)).toBeNull();
		}, 1000);
	});

	it('should display spinner when change token', async () => {
		const { unmount } = renderPage();
		expect(screen.queryByText(/Loading.../i)).toBeInTheDocument();
		await waitFor(() => {
			expect(screen.queryByText(/Loading.../i)).toBeNull();
		}, 1000);
		unmount();

		renderPage(['/activate/abcd']);
		expect(screen.queryByText(/Loading.../i)).toBeInTheDocument();
		await waitFor(() => {
			expect(screen.queryByText(/Loading.../i)).toBeNull();
		}, 1000);
	});
});
