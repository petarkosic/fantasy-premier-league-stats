import '../App.css';

export const GameweekSelect = ({
	data,
	selectGameweek,
	handleSelectGameweekChange,
}) => {
	return (
		<div className='select gameweek'>
			<select
				className='select-dropdown'
				value={selectGameweek}
				onChange={(e) => handleSelectGameweekChange(e)}
				name='gameweek'
			>
				<option>Select Gameweek</option>
				{data?.events.map((val: statsModule.Event) => (
					<option key={val.id}>{val.name}</option>
				))}
			</select>
		</div>
	);
};
