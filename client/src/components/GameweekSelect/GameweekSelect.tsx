import { ChangeEvent } from 'react';
import styles from './GameweekSelect.module.scss';

type GameweekSelectProps = {
	data: statsModule.RootObject | undefined;
	selectGameweek: string | undefined;
	setSelectGameweek: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const GameweekSelect = ({
	data,
	selectGameweek,
	setSelectGameweek,
}: GameweekSelectProps) => {
	const handleSelectGameweekChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectGameweek(e.target.value);
	};

	return (
		<div className={`${styles.select} ${styles.gameweek}`}>
			<select
				className={styles.selectDropdown}
				value={selectGameweek}
				onChange={(e) => handleSelectGameweekChange(e)}
				name='gameweek'
			>
				{data?.events?.map(
					(val: statsModule.Event) =>
						(val.finished || val.is_current) && (
							<option key={val.id}>{val.name}</option>
						)
				)}
			</select>
		</div>
	);
};
