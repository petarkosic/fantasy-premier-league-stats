import { PlayerImage } from './PlayerImage';
import { PlayerName } from './PlayerName';
import { formatCurrency } from '../utils/formatNumber';

type PlayerInfoModalProps = {
	isModalOpen: boolean;
	close: () => void;
	children: React.ReactNode;
	topElement: any;
};

const PlayerInfoModal = ({
	isModalOpen,
	close,
	children,
	topElement,
}: PlayerInfoModalProps) => {
	return (
		<div>
			{isModalOpen && (
				<div className='player--modal'>
					<div className='bg--image'></div>
					{topElement?.map((el: any) => (
						<PlayerName
							key={el.id}
							id={el.id}
							firstName={el.first_name}
							secondName={el.second_name}
						/>
					))}
					<PlayerImage topElement={topElement} />
					<p className='price'>
						{/* {formatCurrency(currentRound?.[0].value)} */}
						{formatCurrency(topElement?.[0].now_cost)}
					</p>
					{children}
					<p>Total Points: {topElement?.[0].total_points}</p>
					<p>Points Per Game: {topElement?.[0].points_per_game}</p>
					<p>Goals Scored: {topElement?.[0].goals_scored}</p>
					<p>Assists: {topElement?.[0].assists}</p>
					<p>Clean Sheets: {topElement?.[0].clean_sheets}</p>
					<button onClick={close}>close modal</button>
				</div>
			)}
		</div>
	);
};

export default PlayerInfoModal;
