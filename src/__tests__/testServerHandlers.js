import { rest } from 'msw';

export let requestTracker = [];
const BASE_URL = window.location.origin;
const USERS_ENDPOINT = `${BASE_URL}/api/1.0/users`;
const ACTIVATION_ENDPOINT = `${BASE_URL}/api/1.0/users/token/:token`;

afterEach(() => {
	requestTracker = [];
});

function addToTracker(req) {
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
	addToTracker(req);

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
		addToTracker(req);

		return res(ctx.status(200), ctx.json('ok'));
	}
);

export const failureAccountActivation = rest.post(
	ACTIVATION_ENDPOINT,
	(req, res, ctx) => {
		addToTracker(req);

		return res(ctx.status(400), ctx.json('not ok'));
	}
);

export const handlers = [successPostUser, successAccountActivation];
