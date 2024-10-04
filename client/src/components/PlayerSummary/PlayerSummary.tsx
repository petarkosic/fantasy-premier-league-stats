import { ReactNode, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPlayerSummary } from '../../services/playerStats';
import styles from './PlayerSummary.module.scss';
import { teamNames } from '../../utils/teamNames';

type PlayerSummaryProps = {
	id: number;
};

const colors: { [key: number]: { bgColor: string; color: string } } = {
	1: { bgColor: 'purple', color: 'black' },
	2: { bgColor: '#01FC7A', color: 'black' },
	3: { bgColor: '#E7E7E7', color: 'black' },
	4: { bgColor: '#FE1651', color: 'white' },
	5: { bgColor: '#80072D', color: 'white' },
};

const PlayerSummary = ({ id }: PlayerSummaryProps) => {
	const { data, isLoading, isError, error } = useQuery(
		['player-summary', id],
		() => getPlayerSummary(id),
		{
			enabled: !!id,
			refetchOnWindowFocus: false,
		}
	);

	const opponentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		opponentRef?.current?.style?.setProperty(
			'--bg-color',
			colors[data.fixtures[0].difficulty].bgColor
		);
		opponentRef?.current?.style?.setProperty(
			'--color',
			colors[data.fixtures[0].difficulty].color
		);
	}, [data]);

	if (isLoading) {
		return <div>Loading player summary...</div>;
	}

	if (isError) {
		return <div>{error as ReactNode}</div>;
	}

	return (
		<div className={styles.opponent}>
			<p ref={opponentRef} className={styles.opponentName}>
				{data.fixtures[0].is_home
					? teamNames[data.fixtures[0].team_a]
					: teamNames[data.fixtures[0].team_h]}{' '}
				{data.fixtures[0].is_home ? '(H)' : '(A)'}
			</p>
		</div>
	);
};

export default PlayerSummary;
