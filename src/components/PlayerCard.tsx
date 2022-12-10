import React from 'react';

type PlayerCardProps = {
	data: statsModule.Element;
};

const PlayerCard = ({ data }: PlayerCardProps) => {
	return (
		<div className='card'>
			<p>{data.first_name}</p>
			<p>{data.second_name}</p>
			<p>{data.assists}</p>
			<p>{data.bonus}</p>
			<p>{data.form}</p>
			<p>{data.expected_goals}</p>
			<p>{data.minutes}</p>
			<p>{data.influence}</p>
			<p>{data.photo}</p>
		</div>
	);
};

export default PlayerCard;
