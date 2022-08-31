import { rest } from 'msw';

export let requestTracker = [];
const base_url = window.location.origin;
const USERS_ENDPOINT = `${base_url}/api/1.0/users`;

beforeEach(() => {
	requestTracker = [];
});

export const successPostUser = rest.post(USERS_ENDPOINT, (req, res, ctx) => {
	requestTracker.push({
		path: req.url.pathname,
		body: req.body,
		at: new Date().toLocaleTimeString(),
	});

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

export const handlers = [successPostUser];
