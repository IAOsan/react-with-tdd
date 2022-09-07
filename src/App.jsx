import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Header from './components/Header.component';
import './locale/i18n';
import './app.styles.css';

function App() {
	return (
		<BrowserRouter>
			<Header />
			<AppRoutes />
		</BrowserRouter>
	);
}

export default App;
