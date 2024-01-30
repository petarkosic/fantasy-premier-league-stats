import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
	getPlayerDataId,
	getPlayerHeatmapData,
	getPlayerImage,
	getPlayerSummary,
} from '../services/playerStats';
import { PlayerName } from './PlayerName';
import { PlayerImage } from './PlayerImage';
import { getTeamImage } from '../services/teamStats';
import { useEffect, useRef, useState } from 'react';
import transparentImage from '../assets/transparent.png';
import PlayerInfoModal from './PlayerInfoModal';
import { Chart } from './Chart';

type ElementType = {
	id: number;
	plural_name: string;
	plural_name_short: string;
	singular_name: string;
	singular_name_short: string;
	squad_select: number;
	squad_min_play: number;
	squad_max_play: number;
	ui_shirt_specific: true;
	sub_positions_locked: number[] | null[];
	element_count: number;
};

type PlayerCardProps = {
	data: statsModule.Element;
};

const PlayerCard = ({ data }: PlayerCardProps) => {
	const code: number = data?.code;
	const queryClient = useQueryClient();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const playerData: statsModule.RootObject | undefined =
		queryClient.getQueryData(['stats']) as statsModule.RootObject;

	let topELementFirstName: string = data?.first_name;
	let topElementSecondName: string = data?.second_name;

	const { data: playerDataId, error: playerDataIdError } = useQuery(
		['player-id', topELementFirstName, topElementSecondName],
		() => getPlayerDataId(topELementFirstName, topElementSecondName),
		{
			refetchOnWindowFocus: false,
		}
	);

	const { data: playerDataHeatmapPoints } = useQuery(
		['player-heatmap', playerDataId],
		() => getPlayerHeatmapData(playerDataId),
		{
			refetchOnWindowFocus: false,
			enabled: !!playerDataId && !playerDataIdError,
		}
	);

	let playerId = data.id;
	let searchedPlayer = playerData?.elements.filter((el) => {
		return el.id === playerId;
	});

	const {
		data: playerSummary,
		error: playerSummaryError,
		isLoading: isPlayerSummaryImageLoading,
		isError: isPlayerSummaryError,
	} = useQuery(['player-summary', playerId], () => getPlayerSummary(playerId), {
		refetchOnWindowFocus: false,
	});

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
					<div
						className='news'
						style={{
							display: !data.news ? 'none' : 'block',
							color:
								data.news.includes('75%') || data.news.includes('50%')
									? 'orange'
									: 'red',
						}}
					>
						{data.news}
					</div>

					<div className='bottom-data'>
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
					<div className='view-more-button'>
						<button onClick={() => setIsModalOpen(true)}>View More</button>
					</div>
				</div>
			</div>
			{isModalOpen && (
				<div className='player--modal--wrapper'>
					<PlayerInfoModal
						isModalOpen={isModalOpen}
						close={() => setIsModalOpen(false)}
						topElement={searchedPlayer}
						elementTypes={playerData?.element_types as ElementType[]}
						playerDataHeatmapPoints={playerDataHeatmapPoints}
					>
						<Chart playerSummary={playerSummary} />
					</PlayerInfoModal>
				</div>
			)}
		</div>
	);
};

export default PlayerCard;
