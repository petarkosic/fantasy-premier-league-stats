import { Link } from 'react-router-dom';

export const Navbar = () => {
	return (
		<div className='select-menu'>
			<div className='select'>
				<Link to={'/'}>Home</Link>
			</div>
			<div className='select'>
				<Link to='/gameweek'>Player of the Week</Link>
			</div>
		</div>
	);
};
