import PlayerCard from './PlayerCard';

type PlayerCardGridProps = {
	data: statsModule.Element;
};

const PlayerCardGrid = ({ data }: PlayerCardGridProps) => {
	return (
		<div className='grid'>
			<PlayerCard data={data} />
			<PlayerCard data={data} />
			<PlayerCard data={data} />
			<PlayerCard data={data} />
			<PlayerCard data={data} />
			<PlayerCard data={data} />
		</div>
	);
};

export default PlayerCardGrid;
