type PlayerInfoModalProps = {
	isModalOpen: boolean;
	close: () => void;
	children: React.ReactNode;
};

const PlayerInfoModal = ({
	isModalOpen,
	close,
	children,
}: PlayerInfoModalProps) => {
	return (
		<div>
			{isModalOpen && (
				<div className='player--modal'>
					{children}
					<button onClick={close}>close modal</button>
				</div>
			)}
		</div>
	);
};

export default PlayerInfoModal;
