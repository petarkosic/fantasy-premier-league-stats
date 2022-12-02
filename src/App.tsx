import './App.css';
import { useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { getStats } from './hooks/getStats';

function App() {
	const { data, error, isLoading, isError } = useQuery(['stats'], getStats);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (isError) {
		return <div>{error as ReactNode}</div>;
	}
	console.log(data);

	return (
		<>
			{/* <div>
				{data?.teams.map((val: statsModule.Team) => (
					<div key={val?.code}>{val?.name}</div>
				))}
			</div> */}
			<div>
				{data.elements.map((el: statsModule.Element) => (
					<div key={el.code}>
						<span>
							{el.first_name} {el.second_name}
						</span>{' '}
						<span>BPS: {el.bps}</span> <span>XG:{el.expected_goals}</span>
					</div>
				))}
			</div>
		</>
	);
}

export default App;
