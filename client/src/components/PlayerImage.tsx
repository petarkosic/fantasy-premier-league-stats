import { motion } from 'framer-motion';

type PlayerImageProps = {
	isPlayerImageLoading: boolean;
	playerImage: string;
};

export const PlayerImage = ({
	isPlayerImageLoading,
	playerImage,
}: PlayerImageProps) => {
	return (
		<motion.div
			initial={{ y: 150, opacity: 0, scale: 0.5 }}
			animate={{ y: 0, opacity: 1, scale: 1 }}
			transition={{ duration: 0.2 }}
			className='card-top--image'
		>
			{isPlayerImageLoading ? (
				<img src={'./../assets/transparent.png'} alt='' />
			) : (
				<img src={playerImage} alt='player image' />
			)}
		</motion.div>
	);
};
