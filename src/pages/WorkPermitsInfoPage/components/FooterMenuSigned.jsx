import { memo } from "react";
import { useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";

const FooterMenuSigned = ({
	isChangeWorkersModal,
	isWorkersModal,
	isManagersModal,
	isRiskFactorsModal,
	isDocumentListModal,
	isDocumentModal,
	isDailyPermitModal,
	isAnalyzesModal,
	isExtensionModal,
	setIsExtensionModal,
	setPermitExtensionSignPopup,
	workPermitInfo,
	onArchivingClick,
}) => {
	const userId = useSelector((state) => state.currentUser?.user?.id);

	return (
		<>
			{!isWorkersModal &&
				!isManagersModal &&
				!isDocumentListModal &&
				!isRiskFactorsModal &&
				!isDocumentModal &&
				!isDailyPermitModal &&
				!isExtensionModal &&
				!isAnalyzesModal &&
				!isChangeWorkersModal && (
					<div className="special-menu__footer">
						{workPermitInfo?.responsible_manager?.id === userId &&
							!workPermitInfo?.extension && (
								<button
									className="btn btn-outline-primary"
									onClick={() => setIsExtensionModal(true)}
								>
									Продление
								</button>
							)}
						{workPermitInfo?.responsible_manager?.id === userId &&
							workPermitInfo?.extension &&
							!workPermitInfo?.extension?.signers.find(
								({ role }) => role === "permit_issuer"
							)?.signed &&
							workPermitInfo?.extension?.signers.find(
								({ role }) => role === "permit_issuer"
							)?.user?.id !==
								workPermitInfo?.extension?.signers.find(
									({ role }) => role === "responsible_manager"
								)?.user?.id && (
								<Tooltip
									arrow
									placement="top-start"
									title={
										<div className="permit-button__tooltip">
											Ожидается подпись согласующего лица
										</div>
									}
								>
									<div className="btn-wrapper">
										<button className="btn btn-primary" disabled>
											Запрос на продление до{" "}
											{workPermitInfo?.extension?.date_end}
										</button>
									</div>
								</Tooltip>
							)}
						{workPermitInfo?.responsible_manager?.id === userId &&
							workPermitInfo?.extension &&
							workPermitInfo?.extension?.signers.find(
								({ role }) => role === "permit_issuer"
							)?.signed && (
								<div className="extended-message">
									Продлен до {workPermitInfo?.extension?.date_end}
								</div>
							)}
						{workPermitInfo?.extension?.signers.find(
							({ user }) => user.id === userId
						)?.role === "permit_issuer" &&
							!workPermitInfo?.extension?.signers.find(
								({ role }) => role === "permit_issuer"
							)?.signed && (
								<button
									className="btn btn-primary"
									onClick={() => setPermitExtensionSignPopup(true)}
								>
									Продлить до {workPermitInfo?.extension?.date_end}
								</button>
							)}
						{workPermitInfo?.responsible_manager?.id === userId && (
							<button
								className="btn btn-primary"
								onClick={() => onArchivingClick(true)}
							>
								Закрытие
							</button>
						)}
					</div>
				)}
		</>
	);
};

export default memo(FooterMenuSigned);
