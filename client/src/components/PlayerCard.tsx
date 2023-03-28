import { useQuery } from '@tanstack/react-query';
import { getPlayerImage } from '../services/playerStats';
import { PlayerName } from './PlayerName';
import { PlayerImage } from './PlayerImage';

type PlayerCardProps = {
	data: statsModule.Element;
};

const PlayerCard = ({ data }: PlayerCardProps) => {
	const code: number = data?.code;

	// get player image
	const {
		data: playerImage,
		error: playerError,
		isLoading: isPlayerImageLoading,
		isError: isPlayerError,
	} = useQuery(['player-image', code], () => getPlayerImage(code), {
		cacheTime: Infinity,
		staleTime: Infinity,
	});

	return (
		<div className='card-wrapper'>
			<div className='card'>
				<div className='card-top'>
					<PlayerName
						id={data.id}
						firstName={data.first_name}
						secondName={data.second_name}
					/>
					<PlayerImage
						isPlayerImageLoading={isPlayerImageLoading}
						playerImage={playerImage}
					/>
				</div>
				<hr className='divider' />
				<div className='card-bottom'>
					<div>
						<span>Selected By Percent:</span>
						<span>{data.selected_by_percent} %</span>
					</div>
					<div>
						<span>Goals:</span>
						<span>{data.goals_scored}</span>
					</div>
					<div>
						<span>Assists:</span>
						<span>{data.assists}</span>
					</div>
					<div>
						<span>Bonus:</span>
						<span>{data.bonus}</span>
					</div>
					<div>
						<span>Form:</span>
						<span>{data.form}</span>
					</div>
					<div>
						<span>Expected Goals:</span>
						<span>{data.expected_goals}</span>
					</div>
					<div>
						<span>Minutes Played:</span>
						<span>{data.minutes}</span>
					</div>
					<div>
						<span>Influence:</span>
						<span>{data.influence}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlayerCard;
