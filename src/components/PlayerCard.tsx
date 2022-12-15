import React from 'react';

type PlayerCardProps = {
	data: statsModule.Element;
};

const PlayerCard = ({ data }: PlayerCardProps) => {
	return (
		<div className='card-wrapper'>
			<div className='card'>
				<div className='card-top'>
					<div className='card-top--name'>
						<p>{data.first_name}</p>
						<p>{data.second_name}</p>
					</div>
					<div className='card-top--image'>
						<p>{data.photo}</p>
					</div>
				</div>
				<div className='card-bottom'>
					<p>{data.assists}</p>
					<p>{data.bonus}</p>
					<p>{data.form}</p>
					<p>{data.expected_goals}</p>
					<p>{data.minutes}</p>
					<p>{data.influence}</p>
				</div>
			</div>
		</div>
	);
};

export default PlayerCard;
