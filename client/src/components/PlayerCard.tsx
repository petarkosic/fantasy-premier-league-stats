import { useQuery } from '@tanstack/react-query';
import { getPlayerImage } from '../services/playerStats';
import { PlayerName } from './PlayerName';
import { PlayerImage } from './PlayerImage';
import { getTeamImage } from '../services/teamStats';
import { useEffect, useRef } from 'react';
import transparentImage from '../assets/transparent.png';

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
	} = useQuery(['player-image', code], () => getPlayerImage(code));

	// get team image
	const {
		data: teamImage,
		isLoading: isTeamImageLoading,
		isError: isTeamImageError,
	} = useQuery(
		['teamImage', data?.team_code],
		() => getTeamImage(data?.team_code),
		{
			refetchOnWindowFocus: false,
		}
	);

	const cardRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		cardRef?.current?.style?.setProperty('--bg-image', `url('${teamImage}')`);
	});

	return (
		<div className='card-wrapper'>
			<div ref={cardRef} className='card'>
				<div className='card-top'>
					<PlayerName
						id={data.id}
						firstName={data.first_name}
						secondName={data.second_name}
					/>
					{isPlayerImageLoading ? (
						<PlayerImage playerImage={transparentImage} />
					) : (
						<PlayerImage playerImage={playerImage} />
					)}
				</div>
				<hr className='divider' />
				<div className='home-card-bottom'>
					<div className='left'>
						<div>
							<p>Goals: {data.goals_scored}</p>
						</div>
						<div>
							<p>Assists: {data.assists}</p>
						</div>
						<div>
							<p>Expected Goals: {data.expected_goals}</p>
						</div>
						<div>
							<p>Selected By: {data.selected_by_percent} %</p>
						</div>
					</div>
					<div className='right'>
						<div>
							<p>Total Points: {data?.total_points}</p>
						</div>
						<div>
							<p>Bonus: {data.bonus}</p>
						</div>
						<div>
							<p>Form: {data.form}</p>
						</div>
						<div>
							<p>Influence: {data.influence}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlayerCard;
