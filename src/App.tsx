import './App.css';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, ReactNode, useState } from 'react';
import { getStats } from './hooks/getStats';
import { getPlayerImage } from './hooks/getPlayerImage';

function App() {
	const [selectGameweek, setSelectGameweek] = useState<string>('Gameweek 1');
	const [selectTeam, setSelectTeam] = useState<string>('Arsenal');
	const [teamCode, setTeamCode] = useState<number>(3);
	const [playerName, setPlayerName] = useState<string>('');
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

	const handleSelectGameweekChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectGameweek(e.target.value);
	};

	const handleSelectTeam = (e: ChangeEvent<HTMLSelectElement>) => {
		let teamCode = data.teams.filter(
			(team: statsModule.Team) => team.name === e.target.value
		)[0].code;

		setSelectTeam(e.target.value);
		setTeamCode(teamCode);
	};

	const handleSearchPlayerName = (e: ChangeEvent<HTMLInputElement>) => {
		setPlayerName(e.target.value);
	};

	return (
		<>
			<div className='app'>
				<input
					value={playerName}
					onChange={(e) => handleSearchPlayerName(e)}
					type='text'
					placeholder='search player by player name'
				/>
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
					{/* {data.elements.map((el: statsModule.Element) => (
						<div key={el.code}>
							<span>
								{el.first_name} {el.second_name}
							</span>{' '}
							<span>BPS: {el.bps}</span> <span>XG:{el.expected_goals}</span>{' '}
							<span>Goals Scored: {el.goals_scored}</span>
						</div>
					))} */}
					{data.elements.map((el: statsModule.Element) => (
						<div key={el.id}>{el.team_code == teamCode && el.first_name}</div>
					))}
					{/* {data.elements.map((el: statsModule.Element) => (
						<div>{el.first_name == playerName}</div>
					))} */}
				</div>
			</div>
		</>
	);
}

export default App;
