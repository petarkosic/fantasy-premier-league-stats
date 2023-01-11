import { useQueryClient } from '@tanstack/react-query';

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

	if (loading) {
		return <div>Loading....</div>;
	}

	return (
		<div>
			<div className='card-wrapper'>
				<div className='card'>
					<div className='card-top'>
						<div className='card-top--name'>
							<p>{average_entry_score}</p>
							<div style={{ width: '100%' }}>
								{chip_plays.map((chip: statsModule.ChipPlay) => (
									<div
										key={chip.chip_name}
										style={{
											width: '100%',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
										}}
									>
										<span>{chip.chip_name}</span>
										<span>{chip.num_played}</span>
									</div>
								))}
							</div>
							<div className='divider'></div>
						</div>
						{/* <div className='card-top--image'>
							{isPlayerImageLoading ? (
								<img src={'/transparent.png'} alt='' />
							) : (
								<img src={playerImage} alt='player image' />
							)}
						</div> */}
					</div>
				</div>
			</div>
		</div>
	);
};
