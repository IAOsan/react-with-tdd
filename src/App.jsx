import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Header from './components/Header.component';
import Footer from './components/Footer.component';
import './locale/i18n';
import './app.styles.css';

function App() {
	return (
		<>
			<Header />
			<AppRoutes />
			<Footer />
		</>
	);
}

export default App;
