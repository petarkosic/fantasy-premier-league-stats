// @ts-nocheck
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPlayerImage } from '../hooks/getPlayerImage';
import { getPlayerSummary } from '../hooks/getStats';
import { formatCurrency, formatNumber } from '../utils/formatNumber';
import { Chart } from './Chart';
import { PlayerName } from './PlayerName';
import { PlayerImage } from './PlayerImage';

type GameweekDataProps = {
	selectGameweek: string | undefined;
};

export const GameweekData = ({ selectGameweek }: GameweekDataProps) => {
	const queryClient = useQueryClient();
	const loading = queryClient.isFetching();

	const data: statsModule.RootObject | undefined = queryClient.getQueryData({
		stats: 'stats',
	});

	let currentGameweek: statsModule.Event | undefined = data?.events?.filter(
		(ev: statsModule.Event) => {
			return ev.name == selectGameweek;
		}
	);

	let {
		average_entry_score,
		chip_plays,
		cup_leagues_created,
		data_checked,
		deadline_time,
		deadline_time_epoch,
		deadline_time_game_offset,
		finished,
		h2h_ko_matches_created,
		highest_score,
		highest_scoring_entry,
		id,
		is_current,
		is_next,
		is_previous,
		most_captained,
		most_selected,
		most_transferred_in,
		most_vice_captained,
		name,
		top_element,
		top_element_info,
		transfers_made,
	} = currentGameweek?.[0];

	let playerId = top_element_info.id;
	let topElement = data?.elements.filter((el) => {
		return el.id === top_element_info.id;
	});

	// get player image
	const {
		data: playerImage,
		error,
		isLoading,
		isError,
	} = useQuery(
		['player-image', topElement?.[0].code],
		() => getPlayerImage(topElement?.[0].code as number),
		{
			refetchOnWindowFocus: false,
		}
	);

	// get player summary
	const {
		data: playerSummary,
		error: playerError,
		isLoading: isPlayerImageLoading,
		isError: isPlayerError,
	} = useQuery(['player-summary', playerId], () => getPlayerSummary(playerId), {
		refetchOnWindowFocus: false,
	});

	if (isLoading || isPlayerImageLoading) {
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
			<div className='dashboard-wrapper'>
				<div className='dashboard'>
					<div className='dashboard--gw'>
						<div className='transfers'>
							<p>Transfers Made:</p>
							<span>{formatNumber(transfers_made)}</span>
						</div>
						<div className='score'>
							<div>
								<p>Average Score:</p>
								<span>{average_entry_score}</span>
							</div>
							<div>
								<p>Highest Score:</p>
								<span>{highest_score}</span>
							</div>
						</div>
						<div className='most-player'>
							<div className='most selected'>
								<p>Most Selected:</p>
								<span>
									{mostSelected?.[0].first_name} {mostSelected?.[0].second_name}
								</span>
							</div>
							<div className='most captained'>
								<p>Most Captained:</p>
								<span>
									{mostCaptained?.[0].first_name}{' '}
									{mostCaptained?.[0].second_name}
								</span>
							</div>
							<div className='most vice-captained'>
								<p>Most Vice Captained:</p>
								<span>
									{mostViceCaptained?.[0].first_name}{' '}
									{mostViceCaptained?.[0].second_name}
								</span>
							</div>
							<div className='most transferred'>
								<p>Most Transferred In:</p>
								<span>
									{mostTransferedIn?.[0].first_name}{' '}
									{mostTransferedIn?.[0].second_name}
								</span>
							</div>
						</div>
						<div className='chip--wrapper'>
							{chip_plays.map((chip: statsModule.ChipPlay) => (
								<div
									className={`chip_play chip--${chip.chip_name}`}
									key={chip.chip_name}
								>
									<span className='chip--name' data-chip-name={chip.chip_name}>
										{chip.chip_name}
									</span>{' '}
									<span className='chip--num_played'>
										{formatNumber(chip.num_played)}
									</span>
								</div>
							))}
						</div>
					</div>
					<div className='player--info'>
						<div className='card-wrapper'>
							<div className='card'>
								<div className='card-top'>
									{topElement?.map((el) => (
										<PlayerName
											id={el.id}
											firstName={el.first_name}
											secondName={el.second_name}
										/>
									))}
									<PlayerImage
										isPlayerImageLoading={isPlayerImageLoading}
										playerImage={playerImage}
									/>
								</div>
								<div className='divider'></div>
								<div className='card-bottom'>
									<p>{formatCurrency(currentRound?.[0].value)}</p>
									<p>Points: {top_element_info.points}</p>
									<p>
										Selected by: {formatNumber(currentRound?.[0].selected)}{' '}
										players
									</p>
									<p>
										Transfers in: {formatNumber(currentRound?.[0].transfers_in)}
									</p>
									<p>
										Transfers out:{' '}
										{formatNumber(currentRound?.[0].transfers_out)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Chart playerSummary={playerSummary} />
		</div>
	);
};
