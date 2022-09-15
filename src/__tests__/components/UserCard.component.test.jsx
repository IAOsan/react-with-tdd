import '../setupTestServer';
import { BrowserRouter } from 'react-router-dom';
import { requestTracker } from '../testServerHandlers';
import {
	renderWithProviders,
	screen,
	setupUser,
	waitFor,
	waitForElementToBeRemoved,
} from '../test-utils';
import createStore from '../../store/storeConfig';
import * as storageService from '../../services/storage.service';
import UserCard from '../../components/UserCard.component';

const userCredentials = {
	id: 1,
	username: 'aaa',
	email: 'aaa@mail.com',
	image: null,
	token: 'tokenbearer',
};
const initState = {
	auth: {
		user: userCredentials,
		isAuth: true,
		state: 'success',
	},
};
const user = setupUser();

function renderCard(props = userCredentials) {
	const store = createStore(initState);
	storageService.setItem('reduxState', initState);
	renderWithProviders(
		<BrowserRouter>
			<UserCard {...props} />
		</BrowserRouter>,
		{ store }
	);
}

describe('<UserCard />', () => {
	const editBtn = () => screen.queryByRole('button', { name: /edit/i }),
		saveBtn = () => screen.queryByRole('button', { name: /save/i }),
		cancelBtn = () => screen.queryByRole('button', { name: /cancel/i }),
		deleteBtn = () =>
			screen.queryByRole('button', { name: /delete my account/i }),
		inputName = () => screen.queryByLabelText(/change your username/i),
		userName = () => screen.queryByText(userCredentials.username),
		email = () => screen.queryByText(userCredentials.email),
		spinner = () => screen.queryByText(/loading.../i),
		modal = () => screen.queryByTestId('modal'),
		modalConfirmBtn = () => screen.queryByTestId('modal-confirm-btn'),
		modalCancelBtn = () => screen.queryByTestId('modal-close-btn');

	afterEach(storageService.clear);

	it('should displays edit button for logged user', () => {
		renderCard();
		expect(editBtn()).toBeInTheDocument();
	});

	it('should not displays edit button for other user wich is not logged', () => {
		const userCredentials = {
			id: 2,
			username: 'bbb',
			email: 'bbb@mail.com',
			image: null,
		};
		renderCard(userCredentials);

		expect(editBtn()).toBeNull();
	});

	it('should displays input for username after clicking edit button', async () => {
		renderCard();

		expect(inputName()).toBeNull();

		await user.click(editBtn());

		expect(inputName()).toBeInTheDocument();
	});

	it('should displays save and cancel button in edit mode', async () => {
		renderCard();

		await user.click(editBtn());

		expect(saveBtn()).toBeInTheDocument();
		expect(cancelBtn()).toBeInTheDocument();
	});

	it('should hides user info and edit button in edit mode', async () => {
		renderCard();

		await user.click(editBtn());

		expect(editBtn()).toBeNull();
		expect(userName()).toBeNull();
		expect(email()).toBeNull();
	});

	it('should has current username value for input username', async () => {
		renderCard();

		await user.click(editBtn());

		expect(inputName().value).toBe(userCredentials.username);
	});

	it('should displays spinner during api call', async () => {
		renderCard();

		await user.click(editBtn());

		expect(inputName().value).toBe(userCredentials.username);

		await user.click(saveBtn());

		expect(spinner()).toBeInTheDocument();
	});

	it('should disable submit during api call', async () => {
		renderCard();

		await user.click(editBtn());
		await user.dblClick(saveBtn());

		await waitFor(() => {
			expect(requestTracker).toHaveLength(1);
		});
	});

	it('should request sent has user logged id', async () => {
		const updateName = 'username updated';
		renderCard();

		await user.click(editBtn());
		await user.type(inputName(), updateName);
		await user.click(saveBtn());

		await waitFor(() => {
			expect(requestTracker[0].params).toEqual({
				id: `${userCredentials.id}`,
			});
		});
	});

	it('should request sent has updated values', async () => {
		const updateName = ' updated';
		renderCard();

		await user.click(editBtn());
		await user.type(inputName(), updateName);
		await user.click(saveBtn());

		await waitFor(() => {
			expect(requestTracker[0].body).toEqual({
				username: userCredentials.username + updateName,
			});
		});
	});

	it('should request sent has authorization header', async () => {
		const updateName = ' updated';
		renderCard();

		await user.click(editBtn());
		await user.type(inputName(), updateName);
		await user.click(saveBtn());

		await waitFor(() => {
			expect(requestTracker[0].headers.get('Authorization')).toBe(
				`Bearer ${userCredentials.token}`
			);
		});
	});

	// it('should request sent has values even if user does not update it', async () => {
	// 	const updateName = ' updated';
	// 	renderCard();

	// 	await user.click(editBtn());
	// 	await user.type(inputName(), updateName);
	// 	await user.click(saveBtn());

	// 	await waitFor(() => {
	// 		expect(requestTracker[0].headers.get('Authorization')).toBe(
	// 			`Bearer ${userCredentials.token}`
	// 		);
	// 	});
	// });

	it('should hide edit layout after successful update', async () => {
		const updateName = ' updated';
		renderCard();

		await user.click(editBtn());
		await user.type(inputName(), updateName);
		await user.click(saveBtn());

		await waitForElementToBeRemoved(spinner());

		expect(inputName()).toBeNull();
		expect(saveBtn()).toBeNull();
		expect(cancelBtn()).toBeNull();
	});

	it('should displays updated values after successful update', async () => {
		const updateName = ' updated';
		renderCard();

		await user.click(editBtn());
		await user.type(inputName(), updateName);
		await user.click(saveBtn());

		expect(
			await screen.findByText(`${userCredentials.username}${updateName}`)
		).toBeInTheDocument();
	});

	it('should hide update layout after clicks cancel button', async () => {
		const updateName = 'batman';
		renderCard();

		await user.click(editBtn());
		await user.clear(inputName());
		await user.type(inputName(), updateName);
		await user.click(cancelBtn());

		expect(inputName()).toBeNull();
		expect(saveBtn()).toBeNull();
		expect(cancelBtn()).toBeNull();
	});

	it('should displays original values after clicks cancel button', async () => {
		const updateName = 'batman';
		renderCard();

		await user.click(editBtn());
		await user.clear(inputName());
		await user.type(inputName(), updateName);
		await user.click(cancelBtn());

		await waitFor(() => {
			expect(userName().textContent).toEqual(userCredentials.username);
		});
	});

	it('should displays last update name after clicking cancel button in second edit', async () => {
		const updateName = 'batman';
		renderCard();

		await user.click(editBtn());
		await user.clear(inputName());
		await user.type(inputName(), updateName);
		await user.click(saveBtn());

		await waitForElementToBeRemoved(spinner());

		await user.click(editBtn());
		await user.clear(inputName());
		await user.type(inputName(), `${updateName} updated`);
		await user.click(cancelBtn());

		expect(screen.getByText(updateName)).toBeInTheDocument();
	});

	it('should displays delete button for logged user', () => {
		renderCard();
		expect(deleteBtn()).toBeInTheDocument();
	});

	it('should not displays delete button for other user wich is not logged', () => {
		const userCredentials = {
			id: 2,
			username: 'bbb',
			email: 'bbb@mail.com',
			image: null,
		};
		renderCard(userCredentials);

		expect(deleteBtn()).toBeNull();
	});

	it('should displays modal after clicking delete', async () => {
		renderCard();

		expect(modal()).toBeNull();

		await user.click(deleteBtn());

		expect(modal()).toBeVisible();
	});
	it('should displays confirmation question with confirm and cancel buttons', async () => {
		renderCard();

		await user.click(deleteBtn());

		expect(
			screen.getByText(/are you sure to delete your account?/i)
		).toBeInTheDocument();
		expect(modalConfirmBtn()).toBeInTheDocument();
		expect(modalCancelBtn()).toBeInTheDocument();
	});

	it('should remove modal after clicking cancel', async () => {
		renderCard();

		await user.click(deleteBtn());
		await user.click(modalCancelBtn());

		expect(modal()).toBeNull();
	});

	it('should displays spinner while delete request are in progress', async () => {
		renderCard();

		await user.click(deleteBtn());
		expect(spinner()).toBeNull();
		await user.click(modalConfirmBtn());

		expect(spinner()).toBeInTheDocument();
	});

	it('should request sent has id and authentication header', async () => {
		renderCard();

		await user.click(deleteBtn());
		await user.click(modalConfirmBtn());

		const [request] = requestTracker;

		expect(request.params).toEqual({ id: `${userCredentials.id}` });
		expect(request.headers.get('Authorization')).toBe(
			`Bearer ${userCredentials.token}`
		);
	});
});
