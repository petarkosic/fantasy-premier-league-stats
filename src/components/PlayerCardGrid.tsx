import PlayerCard from './PlayerCard';

type PlayerCardGridProps = {
	data: statsModule.Element[] | undefined | null;
};

const PlayerCardGrid = ({ data }: PlayerCardGridProps) => {
	return (
		<div className='grid'>
			{data?.map((player: statsModule.Element, i: number) => (
				<PlayerCard key={i} data={player} />
			))}
		</div>
	);
};

export default PlayerCardGrid;
