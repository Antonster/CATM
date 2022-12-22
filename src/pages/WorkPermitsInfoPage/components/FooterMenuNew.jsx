import { memo } from "react";
import { useSelector } from "react-redux";

const FooterMenuNew = ({
	isWorkersModal,
	isManagersModal,
	isDocumentListModal,
	isDocumentModal,
	setDeletionPopup,
	workPermitInfo,
	onSignClick,
}) => {
	const userId = useSelector((state) => state.currentUser?.user?.id);

	return (
		<>
			{!isWorkersModal &&
				!isManagersModal &&
				!isDocumentListModal &&
				!isDocumentModal && (
					<div className="special-menu__footer">
						{workPermitInfo?.responsible_manager?.id === userId && (
							<button
								className="btn btn-outline-primary"
								onClick={() => setDeletionPopup(true)}
							>
								Удалить
							</button>
						)}
						{workPermitInfo?.responsible_manager?.id === userId && (
							<button
								className="btn btn-primary"
								disabled={
									workPermitInfo?.workers_signed_count !==
									workPermitInfo?.workers_count
								}
								onClick={() => onSignClick(true)}
							>
								Отправить на согласование
							</button>
						)}
					</div>
				)}
		</>
	);
};

export default memo(FooterMenuNew);
