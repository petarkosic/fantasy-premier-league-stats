import {
	AreaChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Area,
	Tooltip,
	Legend,
} from 'recharts';

type ChartProps = {
	playerSummary: playerSummaryModule.PlayerSummary;
};

export const Chart = ({ playerSummary }: ChartProps) => {
	return (
		<div className='chart'>
			<AreaChart
				width={730}
				height={280}
				data={playerSummary?.history}
				margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
			>
				<defs>
					<linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
						<stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
						<stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
					</linearGradient>
					<linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
						<stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
						<stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
					</linearGradient>
					<linearGradient id='colorTop' x1='0' y1='0' x2='0' y2='1'>
						<stop offset='5%' stopColor='#ca82aa' stopOpacity={0.8} />
						<stop offset='95%' stopColor='#ca82aa' stopOpacity={0} />
					</linearGradient>
					<linearGradient id='colorBottom' x1='0' y1='0' x2='0' y2='1'>
						<stop offset='5%' stopColor='#4e810b' stopOpacity={0.8} />
						<stop offset='95%' stopColor='#4e810b' stopOpacity={0} />
					</linearGradient>
				</defs>
				<XAxis dataKey='round' />
				<YAxis />
				<CartesianGrid strokeDasharray='3 3' />
				<Tooltip />
				<Area
					type='monotone'
					dataKey='expected_assists'
					stroke='#8884d8'
					fillOpacity={1}
					fill='url(#colorUv)'
				/>
				<Area
					type='monotone'
					dataKey='expected_goals'
					stroke='#82ca9d'
					fillOpacity={1}
					fill='url(#colorPv)'
				/>
				<Area
					type='monotone'
					dataKey='goals_scored'
					stroke='#ca82a6'
					fillOpacity={1}
					fill='url(#colorTop)'
				/>
				<Area
					type='monotone'
					dataKey='assists'
					stroke='#4e810b'
					fillOpacity={1}
					fill='url(#colorBottom)'
				/>
				<Legend verticalAlign='top' height={36} />
			</AreaChart>
		</div>
	);
};
