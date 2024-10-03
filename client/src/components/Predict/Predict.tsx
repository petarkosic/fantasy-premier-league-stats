import { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPredictions } from '../../services/getPredictions';
import { Navbar } from '../Navbar/Navbar';
import styles from './Predict.module.scss';

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
				{predictions.map((player: PredictedPlayer, index: number) => (
					<div key={player.id} className={styles.row}>
						<div className={styles.column}>
							<p>{player.name}</p>
							<p className={styles.points}>{player.predicted_points}</p>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default Predict;
