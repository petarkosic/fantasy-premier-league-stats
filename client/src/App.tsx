import './App.css';
import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Home = lazy(() =>
	import('./pages/Home').then(({ Home }) => ({ default: Home }))
);
const Gameweek = lazy(() =>
	import('./pages/Gameweek').then(({ Gameweek }) => ({ default: Gameweek }))
);

function App() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/gameweek' element={<Gameweek />} />
			</Routes>
		</Suspense>
	);
}

export default App;
