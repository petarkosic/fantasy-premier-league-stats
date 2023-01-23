import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Gameweek } from './pages/Gameweek';
import { Home } from './pages/Home';

function App() {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/gameweek' element={<Gameweek />} />
		</Routes>
	);
}

export default App;
