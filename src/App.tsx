import './App.css';
import { useQuery } from '@tanstack/react-query';

const CORS = 'https://cors-anywhere.herokuapp.com';
const API_URL = `${CORS}/https://fantasy.premierleague.com/api/bootstrap-static/`;

function App() {
	const getStats = async () => {
		try {
			const response = await fetch(API_URL);
			const stats = await response.json();
			return stats;
		} catch (error) {
			console.log(error);
		}
	};

	const { data, error, isLoading, isError } = useQuery(['stats'], getStats);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (isError) {
		return <div>Error! {error}</div>;
	}
	console.log(queryData);

	return (
		<div>
			{data?.teams.map((val: statsModule.Team) => (
				<div key={val?.code}>{val?.name}</div>
			))}
		</div>
	);
}

export default App;
