import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
	getPlayerDataId,
	getPlayerHeatmapData,
	getPlayerImage,
	getPlayerSummary,
} from '../../services/playerStats';
import { PlayerName } from '../PlayerName/PlayerName';
import { PlayerImage } from '../PlayerImage/PlayerImage';
import { getTeamImage } from '../../services/teamStats';
import { useEffect, useRef, useState } from 'react';
import transparentImage from '../../assets/transparent.png';
import PlayerInfoModal from '../PlayerInfoModal/PlayerInfoModal';
import { Chart } from '../Chart/Chart';
import styles from './PlayerCard.module.scss';

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

	const { data: playerDataId } = useQuery(
		['player-id', topELementFirstName, topElementSecondName],
		() => getPlayerDataId(topELementFirstName, topElementSecondName),
		{
			refetchOnWindowFocus: false,
		}
	);

	const {
		data: playerDataHeatmapPoints,
		isError: isHeatmapError,
		error: playerDataHeatmapPointsError,
	} = useQuery(
		['player-heatmap', playerDataId],
		() => getPlayerHeatmapData(playerDataId),
		{
			refetchOnWindowFocus: false,
		}
	);

	let playerId = data.id;
	let searchedPlayer = playerData?.elements?.filter((el) => {
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
		<div className={styles.cardWrapper}>
			<div ref={cardRef} className={styles.card}>
				<div className={styles.cardTop}>
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
				<hr className={styles.divider} />
				<div className={styles.homeCardBottom}>
					<div
						className={styles.news}
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

					<div className={styles.bottomData}>
						<div className={styles.left}>
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
						<div className={styles.right}>
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
					<div className={styles.viewMoreButton}>
						<button onClick={() => setIsModalOpen(true)}>View More</button>
					</div>
				</div>
			</div>
			{isModalOpen && (
				<div className={styles.playerModalWrapper}>
					<PlayerInfoModal
						isModalOpen={isModalOpen}
						close={() => setIsModalOpen(false)}
						topElement={searchedPlayer}
						elementTypes={playerData?.element_types}
						playerDataHeatmapPoints={playerDataHeatmapPoints}
						playerDataHeatmapPointsError={playerDataHeatmapPointsError}
						isHeatmapError={isHeatmapError}
					>
						<Chart playerSummary={playerSummary} />
					</PlayerInfoModal>
				</div>
			)}
		</div>
	);
};

export default PlayerCard;
