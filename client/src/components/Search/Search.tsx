// @tsx React.tsx

import { ChangeEvent } from 'react';
import styles from './Search.module.scss';

type SearchProps = {
	playerName: string;
	handleSearchPlayerName: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const Search = ({ playerName, handleSearchPlayerName }: SearchProps) => {
	return (
		<input
			className={styles.searchInput}
			value={playerName}
			onChange={handleSearchPlayerName}
			type='search'
			placeholder='search player by player name'
		/>
	);
};
