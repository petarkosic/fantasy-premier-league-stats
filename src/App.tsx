import './App.css';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { getStats } from './hooks/getStats';
import { getPlayerImage } from './hooks/getPlayerImage';

function App() {
	const [selectGameweek, setSelectGameweek] = useState<string>('Gameweek 1');
	const [selectTeam, setSelectTeam] = useState<string>('Arsenal');
	const { data, error, isLoading, isError } = useQuery(['stats'], getStats);
	const code: number = data?.elements[0].code; // first player code

	// get player image
	const {
		data: playerImage,
		error: playerError,
		isLoading: isPlayerImageLoading,
		isError: isPlayerError,
	} = useQuery(['player-image', code], () => getPlayerImage(code));

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (isError) {
		return <div>{error as ReactNode}</div>;
	}

	const handleSelectGameweekChange = (e) => {
		setSelectGameweek(e.target.value);
	};

	const handleSelectTeam = (e) => {
		setSelectTeam(e.target.value);
	};

	return (
		<>
			<div className='app'>
				<input type='text' placeholder='search player by player name' />
				<div>
					Gameweek Data{' '}
					<select
						value={selectGameweek}
						onChange={(e) => handleSelectGameweekChange(e)}
						name='gameweek'
					>
						{data?.events.map((val: statsModule.Event) => (
							<option key={val.id}>{val.name}</option>
						))}
					</select>
				</div>
				<div>
					<select
						value={selectTeam}
						onChange={(e) => handleSelectTeam(e)}
						name='clubs'
					>
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
