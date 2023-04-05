import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

type PlayerImageProps = {
	playerImage: any;
	topElement: any;
};

export const PlayerImage = ({
	playerImage,
	topElement,
}: Partial<PlayerImageProps>) => {
	const queryClient = useQueryClient();

	const image = queryClient.getQueryData([
		'player-image',
		topElement?.[0].code,
	]);

	return (
		<motion.div
			initial={{ y: 150, opacity: 0, scale: 0.5 }}
			animate={{ y: 0, opacity: 1, scale: 1 }}
			transition={{ duration: 0.2 }}
			className='card-top--image'
		>
			<img src={playerImage ? playerImage : image} alt='player image' />
		</motion.div>
	);
};
