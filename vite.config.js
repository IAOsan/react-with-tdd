import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), svgr()],
	server: {
		proxy: {
			'/api/1.0': 'http://localhost:8080',
		},
	},
	test: {
		globals: true,
		reporters: 'verbose',
		environment: 'jsdom',
		setupFiles: ['./setupGlobalFetch.js', './setupJestDom.js'],
	},
});
