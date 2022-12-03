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

	return (
		<>
			<div className='app'>
				<input type='text' placeholder='search player by player name' />
				<div>
					Gameweek Data{' '}
					<select name='gameweek'>
						{data?.events.map((val: statsModule.Event) => (
							<option key={val.id}>{val.name}</option>
						))}
					</select>
				</div>
				<div>
					<select name='clubs'>
						{data?.teams.map((val: statsModule.Team) => (
							<option key={val?.code}>{val?.name}</option>
						))}
					</select>
				</div>
				<div>
					{data.elements.map((el: statsModule.Element) => (
						<div key={el.code}>
							<span>
								{el.first_name} {el.second_name}
							</span>{' '}
							<span>BPS: {el.bps}</span> <span>XG:{el.expected_goals}</span>{' '}
							<span>Goals Scored: {el.goals_scored}</span>
						</div>
					))}
				</div>
			</div>
		</>
	);
}

export default App;
