import { rest } from 'msw';

export let requestTracker = [];
const BASE_URL = window.location.origin;
const USERS_ENDPOINT = `${BASE_URL}/api/1.0/users`;
const AUTH_ENDPOINT = `${BASE_URL}/api/1.0/auth`;
const ACTIVATION_ENDPOINT = `${BASE_URL}/api/1.0/users/token/:token`;
const users = [
	{
		id: 1,
		username: 'aaa',
		email: 'aaa@mail.com',
		image: null,
	},
	{
		id: 2,
		username: 'bbb',
		email: 'bbb@mail.com',
		image: null,
	},
	{
		id: 3,
		username: 'ccc',
		email: 'ccc@mail.com',
		image: null,
	},
	{
		id: 4,
		username: 'ddd',
		email: 'ddd@mail.com',
		image: null,
	},
	{
		id: 5,
		username: 'eee',
		email: 'eee@mail.com',
		image: null,
	},
	{
		id: 6,
		username: 'fff',
		email: 'fff@mail.com',
		image: null,
	},
	{
		id: 7,
		username: 'ggg',
		email: 'ggg@mail.com',
		image: null,
	},
];

afterEach(() => {
	requestTracker = [];
});

function track(req) {
	requestTracker.push({
		path: req.url.pathname,
		body: req.body,
		headers: req.headers,
		at: new Date().toLocaleTimeString(),
	});
}

function generateAuthError(errors) {
	return {
		message: 'Validation Failure',
		path: '/api/1.0/users',
		tesimtamp: Date.now(),
		validationErrors: errors,
	};
}

export const successPostUser = rest.post(USERS_ENDPOINT, (req, res, ctx) => {
	track(req);

	return res(
		ctx.delay(100),
		ctx.status(200),
		ctx.json({
			name: 'user name',
			email: 'test@mail.com',
			password: 'hashedPassword',
		})
	);
});

export const failureUsernamePostUser = rest.post(
	USERS_ENDPOINT,
	(req, res, ctx) => {
		return res(
			ctx.status(400),
			ctx.json(
				generateAuthError({
					username: 'Must have min 4 and max 32 characters',
				})
			)
		);
	}
);

export const failureEmailPostUser = rest.post(
	USERS_ENDPOINT,
	(req, res, ctx) => {
		return res(
			ctx.status(400),
			ctx.json(generateAuthError({ email: 'E-mail is not valid' }))
		);
	}
);

export const failurePasswordPostUser = rest.post(
	USERS_ENDPOINT,
	(req, res, ctx) => {
		return res(
			ctx.status(400),
			ctx.json(
				generateAuthError({
					password: 'Password must be at least 6 characters',
				})
			)
		);
	}
);

export const successAccountActivation = rest.post(
	ACTIVATION_ENDPOINT,
	(req, res, ctx) => {
		track(req);

		return res(ctx.status(200), ctx.json('ok'));
	}
);

export const failureAccountActivation = rest.post(
	ACTIVATION_ENDPOINT,
	(req, res, ctx) => {
		track(req);

		return res(ctx.status(400), ctx.json('not ok'));
	}
);

export const successGeAllUsers = rest.get(USERS_ENDPOINT, (req, res, ctx) => {
	const page = req.url.searchParams.get('page'),
		size = req.url.searchParams.get('size');

	track(req);

	function getPage(page, size) {
		const pageNumber = isNaN(page) ? 0 : +page,
			sizeNumber = isNaN(size) ? 3 : +size;
		const start = pageNumber * sizeNumber,
			end = start + sizeNumber;
		return {
			content: users.slice(start, end),
			page,
			size,
			totalPages: Math.ceil(users.length / size),
		};
	}

	return res(ctx.status(200), ctx.json(getPage(page, size)));
});

export const getUserById = rest.get(
	`${USERS_ENDPOINT}/:id`,
	(req, res, ctx) => {
		const { id } = req.params;
		const user = users[id - 1],
			status = user ? 200 : 404,
			json = user || {
				message: 'User not found',
				path: `/api/1.0/users/${id}`,
				timestamp: 1662676877397,
			};

		track(req);
		return res(ctx.status(status), ctx.json(json));
	}
);

export const loginUser = rest.post(AUTH_ENDPOINT, (req, res, ctx) => {
	const { email } = req.body;
	const user = users.find((u) => u.email === email),
		status = user ? 200 : 404,
		json = user
			? { ...user, token: 'abcdef' }
			: {
					message: 'User not found',
					path: `/api/1.0/auth`,
					timestamp: 1662676877397,
			  };

	track(req);

	return res(ctx.delay(200), ctx.status(status), ctx.json(json));
});

export const handlers = [
	successPostUser,
	successAccountActivation,
	successGeAllUsers,
	getUserById,
	loginUser,
];
