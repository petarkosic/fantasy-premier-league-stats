// @ts-nocheck
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { GameweekData } from '../components/GameweekData';
import { GameweekSelect } from '../components/GameweekSelect';

export const Gameweek = () => {
	const queryClient = useQueryClient();
	const data: statsModule.RootObject | undefined = queryClient.getQueryData({
		stats: 'stats',
	});

	let currentGameweek = data?.events?.filter((ev: statsModule.Event) => {
		return ev.is_current;
	});
	const [selectGameweek, setSelectGameweek] = useState(
		currentGameweek?.[0]?.name
	);

	return (
		<>
			<div className='select-menu'>
				<div className='select'>
					<GameweekSelect
						data={data}
						selectGameweek={selectGameweek}
						setSelectGameweek={setSelectGameweek}
					/>
				</div>
			</div>
			<GameweekData selectGameweek={selectGameweek} />
		</>
	);
};
