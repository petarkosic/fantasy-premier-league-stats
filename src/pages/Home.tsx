import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, ReactNode, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PlayerCardGrid from '../components/PlayerCardGrid';
import { Search } from '../components/Search';
import { getStats } from '../hooks/getStats';
import { useDebounce } from '../hooks/useDebounce';

export const Home = () => {
	const [playerName, setPlayerName] = useState<string>('');
	// const queryClient = useQueryClient();
	// const data: statsModule.RootObject | undefined = queryClient.getQueryData({
	// 	stats: 'stats',
	// });
	let debouncedPlayerName = useDebounce<string>(playerName, 1000);

	const { data, error, isLoading, isError } = useQuery(['stats'], getStats, {
		refetchOnWindowFocus: false,
	});

	let player = useMemo(() => {
		return data?.elements?.filter(
			(el: statsModule.Element) =>
				el.second_name.toLowerCase().includes(playerName.toLowerCase()) ||
				el.first_name.toLowerCase().includes(playerName.toLowerCase()) ||
				el.web_name.toLowerCase().includes(playerName.toLowerCase())
		);
	}, [debouncedPlayerName]);

	const handleSearchPlayerName = (e: ChangeEvent<HTMLInputElement>) => {
		setPlayerName(e.target.value);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (isError) {
		return <div>{error as ReactNode}</div>;
	}

	return (
		<>
			<div className='select-menu'>
				<div className='select'>
					<Link to='/gameweek'>
						{location.pathname === '/gameweek' ? null : 'Gameweek Data'}
					</Link>
				</div>
			</div>
			<Search
				playerName={playerName}
				handleSearchPlayerName={handleSearchPlayerName}
			/>
			<PlayerCardGrid data={playerName ? player : null} />
		</>
	);
};
