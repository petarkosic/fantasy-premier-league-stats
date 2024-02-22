import { useNavigate } from 'react-router';

export const NotFound = () => {
	const navigate = useNavigate();

	const onClickHome = () => {
		navigate('/');
	};

	const onClickBack = () => {
		navigate(-1);
	};

	return (
		<div>
			<div>
				<div>
					<h1 style={{ fontSize: '2rem' }}>Ooops. This page does not exist.</h1>
				</div>
				<div>
					<button onClick={onClickBack}>Go back</button>
					<button onClick={onClickHome}>Go home</button>
				</div>
			</div>
		</div>
	);
};
