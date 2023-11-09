type MostPlayerProps = {
	className: string;
	label: string;
	firstName: string;
	secondName: string;
};

const MostPlayer = ({
	className,
	label,
	firstName,
	secondName,
}: MostPlayerProps) => {
	return (
		<div data-testid='most-player' className={className}>
			<p>{label}</p>
			<span>
				{firstName} {secondName}
			</span>
		</div>
	);
};

export default MostPlayer;
