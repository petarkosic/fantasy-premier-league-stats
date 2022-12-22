import './App.css';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, ReactNode, useMemo, useState } from 'react';
import { getStats } from './hooks/getStats';
import PlayerCardGrid from './components/PlayerCardGrid';

function App() {
	const [selectTeam, setSelectTeam] = useState<string>('Arsenal');
	const [teamCode, setTeamCode] = useState<number>(3);
	const [playerName, setPlayerName] = useState<string>('');

	const { data, error, isLoading, isError } = useQuery(['stats'], getStats, {
		refetchOnWindowFocus: false,
	});

	const [selectGameweek, setSelectGameweek] = useState<string>(
		data?.events[0].name
	);

	// const code: number = data?.elements[0].code; // first player code
	// let playerCode = 223094; // haaland
	// let playerCode = 226597;
	// const { data: playerData } = useQuery(['player', playerCode], () =>
	// 	getPlayer(playerCode)
	// );

	// const playerNameDebounce = useDebounce(playerName, 1000);
	let player = useMemo(() => {
		return data?.elements?.filter(
			(el: statsModule.Element) =>
				el.second_name.toLowerCase().includes(playerName.toLowerCase()) ||
				el.first_name.toLowerCase().includes(playerName.toLowerCase()) ||
				el.web_name.toLowerCase().includes(playerName.toLowerCase())
		);
	}, [data, playerName]);

	const playersFromTeam = useMemo(() => {
		return data?.elements.filter((el: statsModule.Element) => {
			if (el.team_code == teamCode) {
				return el;
			}
			return;
		});
	}, [selectTeam, player]);

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
				<div>
					Gameweek{' '}
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
					Team{' '}
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
			</div>
			<input
				className='search-input'
				value={playerName}
				onChange={handleSearchPlayerName}
				type='search'
				placeholder='search player by player name'
			/>
			<PlayerCardGrid data={playerName ? player : playersFromTeam} />
		</>
	);
}

export default App;
