type PlayerInfoModalProps = {
	isModalOpen: boolean;
	close: () => void;
};

const PlayerInfoModal = ({ isModalOpen, close }: PlayerInfoModalProps) => {
	return (
		<div>
			{isModalOpen && (
				<div>
					<p>show modal</p>
					<button onClick={close}>close modal</button>
				</div>
			)}
		</div>
	);
};

export default PlayerInfoModal;
