import styles from './Loader.module.scss';

const Loader = () => {
	return (
		<div className={styles.loader}>
			{[1, 2, 3].map((i) => (
				<div key={i} className={styles.dot} id={`dot-${i}`} />
			))}
		</div>
	);
};

export default Loader;
