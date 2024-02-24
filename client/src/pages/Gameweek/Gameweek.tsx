import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { GameweekData } from '../../components/GameweekData/GameweekData';
import { GameweekSelect } from '../../components/GameweekSelect/GameweekSelect';
import { Navbar } from '../../components/Navbar/Navbar';
import styles from './Gameweek.module.scss';

export const Gameweek = () => {
	const queryClient = useQueryClient();
	const data: statsModule.RootObject | undefined = queryClient.getQueryData([
		'stats',
	]);

	let currentGameweek = data?.events?.filter((ev: statsModule.Event) => {
		return ev.is_current;
	});
	const [selectGameweek, setSelectGameweek] = useState(
		currentGameweek?.[0]?.name
	);

	return (
		<>
			<Navbar />
			<div className={styles.selectMenu}>
				<div className={styles.select}>
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
