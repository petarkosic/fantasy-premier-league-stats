import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss';

export const Navbar = () => {
	return (
		<div className={styles.selectMenu}>
			<div className={styles.select}>
				<Link to={'/'}>Home</Link>
			</div>
			<div className={styles.select}>
				<Link to='/gameweek'>Player of the Week</Link>
			</div>
		</div>
	);
};
