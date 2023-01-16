import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPlayerImage } from '../hooks/getPlayerImage';
import { getPlayerSummary } from '../hooks/getStats';
import { formatNumber } from '../utils/formatNumber';

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
	} = useQuery(['player-image', topElement?.[0].code], () =>
		getPlayerImage(topElement?.[0].code as number)
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

	if (loading) {
		return <div>Loading....</div>;
	}

	let selectedGameweekRound = selectGameweek?.split(' ')[1];
	let currentRound = playerSummary?.history?.filter((gw) => {
		return gw.round === parseInt(selectedGameweekRound as string);
	});

	return (
		<div>
			<div className='dashboard-wrapper'>
				<div className='dashboard'>
					<p>Transfers Made: {formatNumber(transfers_made)}</p>
					<div className='card'>
						<p>Highest Score: {highest_score}</p>
						<p>Most Selected: {most_selected}</p>
						<p>Most Transferred In: {most_transferred_in}</p>
					</div>
					<div className='card-top--image'>
						{isPlayerImageLoading ? (
							<img src={'/transparent.png'} alt='' />
						) : (
							<img src={playerImage} alt='player image' />
						)}
					</div>
					<div className=''>
						{currentRound?.map((el) => (
							<div key={el.round}>
								<p>Total points: {el.total_points}</p>
								<p>Selected by: {formatNumber(el.selected)}</p>
							</div>
						))}
					</div>
					{topElement?.map((el) => (
						<div key={el.id}>
							<p>{el.first_name}</p>
							<p>{el.second_name}</p>
						</div>
					))}
					<p>Top Element ID: {top_element_info.id}</p>
					<p>Top Element Points{top_element_info.points}</p>
					<div>
						{chip_plays.map((chip: statsModule.ChipPlay) => (
							<div key={chip.chip_name}>
								<span>{chip.chip_name}</span> <span>{chip.num_played}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);

	// return (
	// 	<div>
	// 		<div className='card-wrapper'>
	// 			<div className='card'>
	// 				<div className='card-top'>
	// 					<div className='card-top--name'>
	// 						<p>{average_entry_score}</p>
	// 						<div style={{ width: '100%' }}>
	// 							{chip_plays.map((chip: statsModule.ChipPlay) => (
	// 								<div
	// 									key={chip.chip_name}
	// 									style={{
	// 										width: '100%',
	// 										display: 'flex',
	// 										alignItems: 'center',
	// 										justifyContent: 'space-between',
	// 									}}
	// 								>
	// 									<span>{chip.chip_name}</span>
	// 									<span>{chip.num_played}</span>
	// 								</div>
	// 							))}
	// 						</div>
	// 						<div className='divider'></div>
	// 						{/* <p>Highest Scoring Entry: {highest_scoring_entry}</p>
	// 						<p>Highest Score: {highest_score}</p>
	// 						<p>Most Selected: {most_selected}</p>
	// 						<p>Most Transferred In: {most_transferred_in}</p>
	// 						<p>Top Element ID: {top_element_info.id}</p>
	// 						<p>Top Element Points{top_element_info.points}</p>
	// 						<p>Most Captained: {most_captained}</p>
	// 						<p>Most Vice Captained: {most_vice_captained}</p>
	// 						<p>Transfers Made: {transfers_made}</p> */}
	// 					</div>
	// 					{/* <div className='card-top--image'>
	// 						{isPlayerImageLoading ? (
	// 							<img src={'/transparent.png'} alt='' />
	// 						) : (
	// 							<img src={playerImage} alt='player image' />
	// 						)}
	// 					</div> */}
	// 				</div>
	// 				<div className='card-bottom'>hello</div>
	// 			</div>
	// 		</div>
	// 	</div>
	// );
};
