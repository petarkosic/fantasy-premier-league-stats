import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { NotFound } from './components/NotFound/NotFound';
import Predict from './components/Predict/Predict';

const Home = lazy(() =>
	import('./pages/Home/Home').then(({ Home }) => ({ default: Home }))
);
const Gameweek = lazy(() =>
	import('./pages/Gameweek/Gameweek').then(({ Gameweek }) => ({
		default: Gameweek,
	}))
);

function App() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/gameweek' element={<Gameweek />} />
				<Route path='/predict' element={<Predict />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}

export default App;
