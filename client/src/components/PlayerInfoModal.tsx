import { PlayerImage } from './PlayerImage';
import { PlayerName } from './PlayerName';
import { formatCurrency } from '../utils/formatNumber';

type ElementType = {
	id: number;
	plural_name: string;
	plural_name_short: string;
	singular_name: string;
	singular_name_short: string;
	squad_select: number;
	squad_min_play: number;
	squad_max_play: number;
	ui_shirt_specific: true;
	sub_positions_locked: number[] | null[];
	element_count: number;
};

type PlayerInfoModalProps = {
	isModalOpen: boolean;
	close: () => void;
	children: React.ReactNode;
	topElement: any;
	elementTypes: ElementType[];
};

const PlayerInfoModal = ({
	isModalOpen,
	close,
	children,
	topElement,
	elementTypes,
}: PlayerInfoModalProps) => {
	const elementType = elementTypes.find(
		(el: ElementType) => el.id == topElement?.[0].element_type
	);

	return (
		<div>
			{isModalOpen && (
				<div className='player--modal'>
					{/* <div className='bg--image'></div> */}
					<div className='player--modal--summary'>
						<div className='modal--banner'>
							<div className='modalimage'>
								<PlayerImage topElement={topElement} />
							</div>
							<div>
								<div className='player--position'>
									{elementType?.singular_name}
								</div>
								<div className='modal--player--name'>
									{topElement?.map((el: any) => (
										<PlayerName
											key={el.id}
											id={el.id}
											firstName={el.first_name}
											secondName={el.second_name}
										/>
									))}
								</div>
							</div>
						</div>
						<div className='player--modal--info'>
							<ul>
								<li>
									<h3>Price</h3>
									<div>{formatCurrency(topElement?.[0].now_cost)}</div>
									<div className='rank-title'>
										<strong>{topElement?.[0].selected_rank_type}</strong> of{' '}
										{elementType?.element_count}
									</div>
								</li>
								<li>
									<h3>Form</h3>
									<div>{topElement?.[0].form}</div>
								</li>
								<li>
									<h3>Pts/Match</h3>
									<div>{topElement?.[0].points_per_game}</div>
									<div className='rank-title'>
										<strong>{topElement?.[0].points_per_game_rank_type}</strong>{' '}
										of {elementType?.element_count}
									</div>
								</li>
								<li>
									<h3>GW Pts</h3>
									<div>{topElement?.[0].event_points}</div>
								</li>
								<li>
									<h3>Total Pts</h3>
									<div>{topElement?.[0].total_points}</div>
								</li>
								<li>
									<h3>Total Bonus</h3>
									<div>{topElement?.[0].bonus}</div>
								</li>
								<li>
									<h3>ICT Index</h3>
									<div>{topElement?.[0].ict_index}</div>
								</li>
								<li>
									<h3>TSB%</h3>
									<div>{topElement?.[0].selected_by_percent}</div>
									<div className='rank-title'>
										<strong>{topElement?.[0].points_per_game_rank_type}</strong>{' '}
										of {elementType?.element_count}
									</div>
								</li>
							</ul>
						</div>
					</div>
					<div className='player--modal--chart'>{children}</div>

					<button onClick={close}>close modal</button>
				</div>
			)}
		</div>
	);
};

export default PlayerInfoModal;
