import { useNavigate } from 'react-router';
import styles from './NotFound.module.scss';

export const NotFound = () => {
	const navigate = useNavigate();

	const onClickHome = () => {
		navigate('/');
	};

	const onClickBack = () => {
		navigate(-1);
	};

	return (
		<div className={styles.notFoundWrapper}>
			<div className={styles.buttons}>
				<button onClick={onClickBack}>Go back</button>
				<button onClick={onClickHome}>Go home</button>
			</div>
			<div>
				<h1 style={{ fontSize: '2rem' }}>This page does not exist.</h1>
			</div>
		</div>
	);
};
