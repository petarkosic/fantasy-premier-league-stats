export const GameweekData = ({ data, selectGameweek }) => {
	return (
		<div>
			{/* {data?.events.map((ev) => {
				<h1>{ev.name}</h1>;
			})} */}
			{data?.events.map((val: statsModule.Event) => (
				<option key={val.id}>{val.name}</option>
			))}
		</div>
	);
};
