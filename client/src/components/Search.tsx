// @tsx React.tsx

import { ChangeEvent } from 'react';

type SearchProps = {
	playerName: string;
	handleSearchPlayerName: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const Search = ({ playerName, handleSearchPlayerName }: SearchProps) => {
	return (
		<input
			className='search-input'
			value={playerName}
			onChange={handleSearchPlayerName}
			type='search'
			placeholder='search player by player name'
		/>
	);
};
