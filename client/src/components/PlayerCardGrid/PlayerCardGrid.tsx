import PlayerCard from '../PlayerCard/PlayerCard';
import styles from './PlayerCardGrid.module.scss';

type PlayerCardGridProps = {
	data: statsModule.Element[] | undefined | null;
};

const PlayerCardGrid = ({ data }: PlayerCardGridProps) => {
	return (
		<div className={styles.grid}>
			{data?.map((player: statsModule.Element, i: number) => (
				<PlayerCard key={i} data={player} />
			))}
		</div>
	);
};

export default PlayerCardGrid;
