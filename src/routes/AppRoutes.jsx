import { useRoutes, Navigate } from 'react-router-dom';
import * as pages from '../pages';

function AppRoutes() {
	const routes = useRoutes([
		{
			path: '/',
			element: <pages.HomePage />,
		},
		{
			path: '/signup',
			element: <pages.SignUpPage />,
		},
		{
			path: '/login',
			element: <pages.LoginPage />,
		},
		{
			path: '/user/:id',
			element: <pages.DetailsPage />,
		},
		{
			path: '/activate/:token',
			element: <pages.ActivationPage />,
		},
		{
			path: '/*',
			element: <Navigate to='/' replace />,
		},
	]);

	return routes;
}

export default AppRoutes;
