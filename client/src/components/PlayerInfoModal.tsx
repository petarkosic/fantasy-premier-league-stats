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
	playerDataHeatmapPointsError: unknown;
	isHeatmapError: boolean;
};

const PlayerInfoModal = ({
	isModalOpen,
	close,
	children,
	topElement,
	elementTypes,
	playerDataHeatmapPoints,
	playerDataHeatmapPointsError,
	isHeatmapError,
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
					context.fillRect(x * 2.5, y * 1.5, 1, 1);
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
										<strong>{topElement?.[0].selected_rank_type}</strong> of,{' '}
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
					<div className='chart--heatmap'>
						<div className='player--modal--chart'>{children}</div>

						<div className='heatmap--wrapper'>
							{isHeatmapError && (
								<div className='heatmap--error'>
									{(playerDataHeatmapPointsError as any).message}
								</div>
							)}
							<div className='heatmap--container'>
								<svg width={88} height={20} viewBox='0 0 88 20'>
									<g fill='white' fillRule='evenodd'>
										<path d='m87.2 9.845-12 8v-16zM.8 7.845h74.4v4H.8z'></path>
									</g>
								</svg>
								<div className='heatmap--fiels'>
									<svg width={258} height={161} viewBox='0 0 238 149'>
										<g fill='white' fillRule='evenodd'>
											<path d='M0 0v149h238V0H0zm119.656 76.121a1.72 1.72 0 0 0 1.094-1.621 1.72 1.72 0 0 0-1.094-1.621V57.628c8.969.35 16.188 7.757 16.188 16.872 0 9.071-7.219 16.521-16.188 16.872v-15.25zM1.312 1.315h3.632a4.577 4.577 0 0 1-3.631 3.637V1.315zm0 54.56h12.032v37.25H1.313v-37.25zm0 38.565h13.344V54.56H1.312V32.65h40.032v83.659H1.312V94.44zm0 53.245v-3.637a4.577 4.577 0 0 1 3.632 3.637H1.313zM118.344 72.88a1.72 1.72 0 0 0-1.094 1.621 1.72 1.72 0 0 0 1.094 1.621v15.251c-8.969-.35-16.188-7.757-16.188-16.872 0-9.071 7.219-16.521 16.188-16.872v15.25zm0-16.566c-9.713.35-17.5 8.37-17.5 18.187 0 9.816 7.787 17.836 17.5 18.187v54.998H6.256c-.394-2.541-2.406-4.601-4.944-4.952v-25.067h41.344V86.157c4.244-2.542 6.825-6.968 6.825-11.657 0-4.69-2.581-9.115-6.825-11.657v-31.51H1.313V6.268c2.537-.35 4.593-2.41 4.943-4.952h112.088v54.998zM42.656 84.58V64.421c3.456 2.366 5.513 6.091 5.513 10.079 0 3.988-2.1 7.713-5.513 10.08zm194.031 63.106h-3.63a4.577 4.577 0 0 1 3.63-3.637v3.637zm0-54.56h-12.03v-37.25h12.03v37.25zm0-38.565h-13.343v39.88h13.344v21.911h-40.032V32.65h40.031V54.56zm0-23.226h-41.343v31.509c-4.244 2.542-6.825 6.968-6.825 11.657 0 4.69 2.581 9.115 6.825 11.657v31.51h41.344v25.066c-2.538.395-4.594 2.41-4.944 4.952H119.656V92.687c9.713-.35 17.5-8.37 17.5-18.187 0-9.816-7.787-17.836-17.5-18.187V1.315h112.088c.393 2.541 2.406 4.601 4.944 4.952v25.067zM195.344 64.42v20.158c-3.457-2.366-5.513-6.091-5.513-10.079 0-3.988 2.056-7.713 5.513-10.08zm41.344-59.469a4.577 4.577 0 0 1-3.632-3.637h3.631v3.637z'></path>
										</g>
									</svg>
									<div className='player--modal--heatmap'>
										<canvas ref={canvasRef} width={258} height={161}></canvas>
									</div>
								</div>
							</div>
						</div>
					</div>
					<button onClick={close}>close modal</button>
				</div>
			)}
		</div>
	);
};

export default PlayerInfoModal;
