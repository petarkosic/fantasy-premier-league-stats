import { motion } from 'framer-motion';
import styles from './PlayerName.module.scss';

type PlayerNameProps = {
	id: number;
	firstName: string;
	secondName: string;
};

export const PlayerName = ({ id, firstName, secondName }: PlayerNameProps) => {
	return (
		<motion.div
			initial={{ y: 50, x: -50, opacity: 0, scale: 0.5 }}
			animate={{ y: 0, x: 0, opacity: 1, scale: 1 }}
			transition={{ duration: 0.2 }}
			className={styles.cardTopName}
			key={id}
		>
			<p>{firstName}</p>
			<p>{secondName}</p>
		</motion.div>
	);
};
