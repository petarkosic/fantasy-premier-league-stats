import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
	getPlayerDataId,
	getPlayerHeatmapData,
	getPlayerImage,
	getPlayerSummary,
} from '../../services/playerStats';
import { getTeamImage } from '../../services/teamStats';
import { formatCurrency, formatNumber } from '../../utils/formatNumber';
import { Chart } from '../Chart/Chart';
import { PlayerName } from '../PlayerName/PlayerName';
import { PlayerImage } from '../PlayerImage/PlayerImage';
import MostPlayer from '../MostPlayer/MostPlayer';
import PlayerInfoModal from '../PlayerInfoModal/PlayerInfoModal';
import { teamColors } from '../../utils/teamColors';
import styles from './GameweekData.module.scss';

type GameweekDataProps = {
	selectGameweek: string | undefined;
};

export const GameweekData = ({ selectGameweek }: GameweekDataProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const queryClient = useQueryClient();

	const data: statsModule.RootObject | undefined = queryClient.getQueryData([
		'stats',
	]);

	let currentGameweek: statsModule.Event[] | undefined = data?.events?.filter(
		(ev: statsModule.Event) => {
			return ev.name == selectGameweek;
		}
	);

	const chipPlayCardRef = useRef<HTMLDivElement[] | null>([]);

	function handleMouseMove(
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		idx: number
	) {
		if (chipPlayCardRef.current) {
			chipPlayCardRef.current[idx].style.setProperty(
				'--card-top',
				event.clientY -
					chipPlayCardRef.current[idx].offsetHeight / 2 -
					480 +
					'px'
			);
			chipPlayCardRef.current[idx].style.setProperty('--card-opacity', '1');
		}
	}

	function handleMouseLeave(idx: number) {
		if (chipPlayCardRef.current) {
			chipPlayCardRef.current[idx].style.setProperty('--card-opacity', '0');
		}
	}

	let {
		average_entry_score,
		chip_plays,
		highest_score,
		most_captained,
		most_selected,
		most_transferred_in,
		most_vice_captained,
		top_element_info,
		transfers_made,
	} = currentGameweek?.[0] as statsModule.Event;

	let playerId = top_element_info?.id;
	let topElement =
		data?.elements.filter((el) => {
			return el.id === top_element_info?.id;
		}) || [];

	const { data: teamImage, isLoading: isTeamImageLoading } = useQuery(
		['teamImage', topElement?.[0]?.team_code],
		() => getTeamImage(topElement?.[0]?.team_code!),
		{
			refetchOnWindowFocus: false,
		}
	);

	const cardRef = useRef<HTMLDivElement>(null);

	let topElementTeam = topElement?.[0]?.team_code || 0;

	useEffect(() => {
		cardRef?.current?.style?.setProperty('--bg-image', `url('${teamImage}')`);
		cardRef?.current?.style?.setProperty(
			'--bg-color-primary',
			`${teamColors[topElementTeam][0]}`
		);
		cardRef?.current?.style?.setProperty(
			'--bg-color-secondary',
			`${teamColors[topElementTeam][1]}`
		);
	});

	const { data: playerImage, isLoading } = useQuery(
		['player-image', topElement?.[0]?.code],
		() => getPlayerImage(topElement?.[0]?.code as number),
		{
			refetchOnWindowFocus: false,
		}
	);

	const { data: playerSummary, isLoading: isPlayerImageLoading } = useQuery(
		['player-summary', playerId],
		() => getPlayerSummary(playerId),
		{
			refetchOnWindowFocus: false,
		}
	);

	let topElementFirstName = topElement?.[0]?.first_name || '';
	let topElementSecondName = topElement?.[0]?.second_name || '';

	const { data: playerDataId } = useQuery(
		['player-id', topElementFirstName, topElementSecondName],
		() => getPlayerDataId(topElementFirstName, topElementSecondName),
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

	if (isLoading || isPlayerImageLoading || isTeamImageLoading) {
		return <div>Loading....</div>;
	}

	let selectedGameweekRound = selectGameweek?.split(' ')[1];
	let currentRound = playerSummary?.history?.filter(
		(gw: gameweekModule.History) => {
			return gw.round === parseInt(selectedGameweekRound as string);
		}
	);
	let mostSelected = data?.elements.filter((el) => el.id == most_selected);
	let mostTransferedIn = data?.elements.filter(
		(el) => el.id == most_transferred_in
	);

	let mostCaptained = data?.elements.filter((el) => el.id == most_captained);
	let mostViceCaptained = data?.elements.filter(
		(el) => el.id == most_vice_captained
	);

	return (
		<div>
			<div className={styles.dashboardWrapper}>
				<div className={styles.dashboard}>
					<div className={styles.dashboardGw}>
						<div className={styles.row}>
							<div className={styles.transfers}>
								<p>Transfers Made:</p>
								<span>{formatNumber(transfers_made)}</span>
							</div>
							<div className={styles.score}>
								<div>
									<p>Average Score:</p>
									<span>{average_entry_score}</span>
								</div>
								<div>
									<p>Highest Score:</p>
									<span>{highest_score}</span>
								</div>
							</div>
						</div>
						<div className={styles.mostPlayer}>
							<MostPlayer
								className={`${styles.most} ${styles.selected}}`}
								label='Most Selected:'
								firstName={mostSelected?.[0].first_name || ''}
								secondName={mostSelected?.[0].second_name || ''}
							/>
							<MostPlayer
								className={`${styles.most} ${styles.captained}}`}
								label='Most Captained:'
								firstName={mostCaptained?.[0].first_name || ''}
								secondName={mostCaptained?.[0].second_name || ''}
							/>
							<MostPlayer
								className={`${styles.most} ${styles.viceCaptained}}`}
								label='Most Vice Captained:'
								firstName={mostViceCaptained?.[0].first_name || ''}
								secondName={mostViceCaptained?.[0].second_name || ''}
							/>
							<MostPlayer
								className={`${styles.most} ${styles.transferred}}`}
								label='Most Transferred:'
								firstName={mostTransferedIn?.[0].first_name || ''}
								secondName={mostTransferedIn?.[0].second_name || ''}
							/>
						</div>
						<div className={styles.chipWrapper}>
							{chip_plays.map((chip: statsModule.ChipPlay, index: number) => (
								<div
									key={chip.chip_name}
									className={`${styles.chipPlay} chip--${chip.chip_name}`}
									ref={(el: HTMLDivElement) => {
										return (
											chipPlayCardRef.current &&
											(chipPlayCardRef.current[index] = el)
										);
									}}
									onMouseMove={(e) => handleMouseMove(e, index)}
									onMouseLeave={() => handleMouseLeave(index)}
								>
									<span
										className={styles.chipName}
										data-chip-name={chip.chip_name}
									>
										{chip.chip_name}
									</span>{' '}
									<span className={styles.chipNumPlayed}>
										{formatNumber(chip.num_played)}
									</span>
								</div>
							))}
						</div>
					</div>
					<div className={styles.playerInfo}>
						<h2 className={styles.playerTag}>Player Of The Week</h2>
						<div className={styles.cardWrapper}>
							<div ref={cardRef} className={styles.card}>
								<div className={styles.cardTop}>
									<div className={styles.bgImage}></div>
									{topElement?.map((el) => (
										<PlayerName
											key={el.id}
											id={el.id}
											firstName={el.first_name}
											secondName={el.second_name}
										/>
									))}
									<PlayerImage topElement={topElement} />
									<p className={styles.price}>
										{formatCurrency(topElement?.[0].now_cost)}
									</p>
								</div>
								<div className={styles.divider}></div>
								<div className={styles.cardBottom}>
									{topElement?.map((el) => (
										<div
											key={el.id}
											className={styles.news}
											style={{
												display: !el.news ? 'none' : 'block',
												color:
													el.news.includes('75%') || el.news.includes('50%')
														? 'orange'
														: 'red',
											}}
										>
											{el.news}
										</div>
									))}
									<div className={styles.playerGw}>
										<p>
											Gameweek Price: {formatCurrency(currentRound?.[0].value)}
										</p>
										<p>Gameweek Points: {top_element_info?.points}</p>
										<p>
											Selected by: {formatNumber(currentRound?.[0].selected)}{' '}
											players ({topElement?.[0].selected_by_percent}%)
										</p>
										<div className={styles.playerTransfers}>
											<p>
												Transfers in:{' '}
												{formatNumber(currentRound?.[0].transfers_in)}
											</p>
											<p>
												Transfers out:{' '}
												{formatNumber(currentRound?.[0].transfers_out)}
											</p>
										</div>
									</div>
									<div className={styles.viewMoreButton}>
										<button onClick={() => setIsModalOpen(true)}>
											View More
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{isModalOpen && (
					<div className={styles.playerModalWrapper}>
						<PlayerInfoModal
							isModalOpen={isModalOpen}
							close={() => setIsModalOpen(false)}
							topElement={topElement}
							elementTypes={data?.element_types}
							playerDataHeatmapPoints={playerDataHeatmapPoints}
							playerDataHeatmapPointsError={playerDataHeatmapPointsError}
							isHeatmapError={isHeatmapError}
						>
							<Chart playerSummary={playerSummary} />
						</PlayerInfoModal>
					</div>
				)}
			</div>
		</div>
	);
};
