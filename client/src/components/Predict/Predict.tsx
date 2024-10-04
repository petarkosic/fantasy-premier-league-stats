import { ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPredictions } from '../../services/getPredictions';
import { Navbar } from '../Navbar/Navbar';
import styles from './Predict.module.scss';
import PlayerSummary from '../PlayerSummary/PlayerSummary';

type PredictedPlayer = {
	id: number;
	name: string;
	predicted_points: number;
};

const Predict = () => {
	const {
		data: predictions,
		error,
		isLoading,
		isError,
	} = useQuery(['predict'], getPredictions, {
		refetchOnWindowFocus: false,
	});

	const queryClient = useQueryClient();

	const playerStats: statsModule.RootObject | undefined =
		queryClient.getQueryData(['stats']);

	function getSelecteddByPercent(playerId: number): string | undefined {
		const player = playerStats?.elements?.find(
			(el: statsModule.Element) => el.id === playerId
		);

		return player?.selected_by_percent;
	}

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>{error as ReactNode}</div>;
	}

	return (
		<>
			<Navbar />
			<div>
				<h2>Predicted points for next game week</h2>
			</div>
			<div className={styles.grid}>
				<div className={styles.row}>
					<div className={styles.column}>
						<p>Name</p>
					</div>

					<div className={styles.column}>
						<p>Ownership</p>
					</div>

					<div className={styles.column}>
						<p>Opponent</p>
					</div>

					<div className={styles.column}>
						<p>Points</p>
					</div>
				</div>
				{predictions.map((player: PredictedPlayer) => (
					<div key={player.id} className={styles.row}>
						<div className={styles.column}>
							<p>{player.name}</p>
						</div>
						<div className={styles.column}>
							{getSelecteddByPercent(player.id)} %
						</div>
						<div className={styles.column}>
							<PlayerSummary id={player.id} />
						</div>
						<div className={styles.column}>
							<p className={styles.points}>{player.predicted_points}</p>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default Predict;
