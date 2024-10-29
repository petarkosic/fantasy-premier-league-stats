import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Home } from '../pages/Home/Home';
import { Gameweek } from '../pages/Gameweek/Gameweek';
import { Predict } from '../components/Predict/Predict';
import { NotFound } from '../components/NotFound/NotFound';

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<>
				<Outlet />
			</>
		),
		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: '/gameweek',
				element: <Gameweek />,
			},
			{
				path: '/predict',
				element: <Predict />,
			},
			{
				path: '*',
				element: <NotFound />,
			},
		],
	},
]);

export default router;
