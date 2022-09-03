import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

afterEach(cleanup);

export function setupUser() {
	return userEvent.setup();
}

export const customRender = (ui, options) =>
	render(ui, { wrapper: ({ children }) => children, ...options });

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
