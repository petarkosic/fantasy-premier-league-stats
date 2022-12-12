import PlayerCard from './PlayerCard';

type PlayerCardGridProps = {
	data: statsModule.Element;
};

const PlayerCardGrid = ({ data }: PlayerCardGridProps) => {
	return (
		<div className='grid'>
			{data?.map((player: statsModule.Element) => (
				<PlayerCard data={player} />
			))}
		</div>
	);
};

export default PlayerCardGrid;
