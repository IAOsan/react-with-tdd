import { rest } from 'msw';

export let requestTracker = [];
const base_url = window.location.origin;
const USERS_ENDPOINT = `${base_url}/api/1.0/users`;

beforeEach(() => {
	requestTracker = [];
});

function addToTracker(req) {
	requestTracker.push({
		path: req.url.pathname,
		body: req.body,
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

export const handlers = [successPostUser];
