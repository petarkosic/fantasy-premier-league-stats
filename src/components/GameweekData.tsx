import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPlayerImage } from '../hooks/getPlayerImage';
import { getPlayerSummary } from '../hooks/getStats';
import { formatCurrency, formatNumber } from '../utils/formatNumber';

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
	let currentRound = playerSummary?.history?.filter((gw) => {
		return gw.round === parseInt(selectedGameweekRound as string);
	});
	let mostSelected = data?.elements.filter((el) => el.id == most_selected);
	let mostTransferedIn = data?.elements.filter(
		(el) => el.id == most_transferred_in
	);

	return (
		<div>
			<div className='dashboard-wrapper'>
				<div className='dashboard'>
					<div className='dashboard--gw'>
						<p>Transfers Made: {formatNumber(transfers_made)}</p>
						<p>Average Score: {average_entry_score}</p>
						<p>Highest Score: {highest_score}</p>
						<p>
							Most Selected: {mostSelected?.[0].first_name}{' '}
							{mostSelected?.[0].second_name}
						</p>
						<p>
							Most Transferred In: {mostTransferedIn?.[0].first_name}{' '}
							{mostTransferedIn?.[0].second_name}
						</p>
						<div>
							{chip_plays.map((chip: statsModule.ChipPlay) => (
								<div key={chip.chip_name}>
									<span>{chip.chip_name}</span> <span>{chip.num_played}</span>
								</div>
							))}
						</div>
					</div>
					<div className='player--info'>
						<div className='card-wrapper'>
							<div className='card'>
								<div className='card-top'>
									{topElement?.map((el) => (
										<div className='card-top--name' key={el.id}>
											<p>{el.first_name}</p>
											<p>{el.second_name}</p>
										</div>
									))}
									<div className='card-top--image'>
										{isPlayerImageLoading ? (
											<img src={'/transparent.png'} alt='' />
										) : (
											<img src={playerImage} alt='player image' />
										)}
									</div>
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
		</div>
	);
};
