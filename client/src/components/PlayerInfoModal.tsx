import { useEffect, useRef } from 'react';
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

type HeatmapPoints = {
	count: number;
	x: number;
	y: number;
};

type PlayerInfoModalProps = {
	isModalOpen: boolean;
	close: () => void;
	children: React.ReactNode;
	topElement: any;
	elementTypes: ElementType[];
	playerDataHeatmapPoints: HeatmapPoints[];
};

const PlayerInfoModal = ({
	isModalOpen,
	close,
	children,
	topElement,
	elementTypes,
	playerDataHeatmapPoints,
}: PlayerInfoModalProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const elementType = elementTypes.find(
		(el: ElementType) => el.id == topElement?.[0].element_type
	);

	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			const context = canvas.getContext('2d');
			canvas.width = 268;
			canvas.height = 161;
			if (context) {
				const contextWidth = canvas.width;
				const contextHeight = canvas.height;
				context.beginPath();
				const firstPoint = playerDataHeatmapPoints?.[0];
				const xRatio = contextWidth / firstPoint?.x;
				const yRatio = contextHeight / firstPoint?.y;
				context.moveTo(firstPoint?.x * xRatio, firstPoint?.y * yRatio);
				for (let i = 0; i < playerDataHeatmapPoints?.length - 1; i++) {
					const { x, y, count } = playerDataHeatmapPoints?.[i];
					context.fillRect(x, y, 1, 1);
					context.fillStyle = count > 1 ? 'red' : 'yellow';
				}
				context.stroke();
			}
		}
	}, []);

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
					<div className='player--modal--heatmap'>
						<canvas ref={canvasRef} width={258} height={161}></canvas>
					</div>
					<button onClick={close}>close modal</button>
				</div>
			)}
		</div>
	);
};

export default PlayerInfoModal;
