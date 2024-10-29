import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, ReactNode, useMemo, useState } from 'react';
import PlayerCardGrid from '../../components/PlayerCardGrid/PlayerCardGrid';
import { Search } from '../../components/Search/Search';
import { getStats } from '../../services/getStats';
import { useDebounce } from '../../hooks/useDebounce';
import { Navbar } from '../../components/Navbar/Navbar';
import styles from './Home.module.scss';
import Loader from '../../components/Loader/Loader';

export const Home = () => {
	const [playerName, setPlayerName] = useState<string>('');
	let debouncedPlayerName = useDebounce<string>(playerName, 1000);

	const { data, error, isLoading, isError } = useQuery(['stats'], getStats, {
		refetchOnWindowFocus: false,
	});

	let player = useMemo(() => {
		if (!playerName) {
			return null;
		}

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
		return (
			<div className={styles.loader}>
				Loading <Loader />
			</div>
		);
	}
	if (isError) {
		return <div>{error as ReactNode}</div>;
	}

	return (
		<>
			<Navbar />
			<Search
				playerName={playerName}
				handleSearchPlayerName={handleSearchPlayerName}
			/>
			{player && player.length === 0 ? (
				<div className={styles.noPlayer}>
					There is no player with that name...
				</div>
			) : null}
			<PlayerCardGrid data={playerName ? player : null} />
		</>
	);
};
