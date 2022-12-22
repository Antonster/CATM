import { memo, useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";

const FooterMenuPending = ({
	isChangeWorkersModal,
	isDocumentListModal,
	isManagersModal,
	isWorkersModal,
	isRiskFactorsModal,
	isDocumentModal,
	setDeletionPopup,
	workPermitInfo,
	onSignClick,
	onRejectClick,
}) => {
	const userId = useSelector((state) => state.currentUser?.user?.id);
	const [userSings, setUserSigns] = useState();
	const [signValidStep, setSignValidStep] = useState("first");

	useEffect(() => {
		setUserSigns(
			workPermitInfo?.signers.filter(
				({ user, signed }) => user.id === userId && !signed
			)
		);
	}, [workPermitInfo]);

	useEffect(() => {
		if (
			workPermitInfo?.signers.find(({ role }) => role === "permit_approver")
				?.signed &&
			!workPermitInfo?.signers.find(({ role }) => role === "permit_acceptor")
				?.signed
		) {
			setSignValidStep("third");
		} else if (
			workPermitInfo?.signers.find(
				({ role }) => role === "responsible_manager_executor"
			)?.signed &&
			workPermitInfo?.signers.find(({ role }) => role === "permit_issuer")
				?.signed &&
			workPermitInfo?.signers.find(({ role }) => role === "permitter")
				?.signed &&
			workPermitInfo?.signers.find(
				({ role }) => role === "industrial_safety_specialist"
			)?.signed &&
			workPermitInfo?.signers.find(
				({ role }) => role === "labor_protection_specialist"
			)?.signed
		) {
			setSignValidStep("second");
		} else {
			setSignValidStep("first");
		}
	}, [workPermitInfo]);

	return (
		<>
			{!isWorkersModal &&
				!isManagersModal &&
				!isDocumentListModal &&
				!isRiskFactorsModal &&
				!isDocumentModal && (
					<div className="special-menu__footer">
						{!isChangeWorkersModal && (
							<>
								{workPermitInfo?.signers?.find(({ user }) => user.id === userId)
									?.role === "permitter" && (
									<div className="permitter-warn">
										Подписывая, вы подтверждаете, что ознакомились с подробным
										содержимым по каждому разделу
									</div>
								)}
								{workPermitInfo?.responsible_manager?.id === userId && (
									<button
										className="btn btn-outline-primary"
										onClick={() => setDeletionPopup(true)}
									>
										Удалить
									</button>
								)}
								{workPermitInfo?.responsible_manager?.id !== userId &&
									userSings?.length > 0 &&
									userSings[0]?.role !== "permit_acceptor" &&
									!workPermitInfo?.signers?.find(
										({ signed }) => signed === false
									) && (
										<button
											className="btn btn-outline-primary"
											onClick={() => onRejectClick(userSings[0]?.role)}
										>
											Отклонить
										</button>
									)}
								{workPermitInfo?.responsible_manager?.id === userId &&
									!userSings?.length > 0 &&
									!workPermitInfo?.signers?.find(
										({ signed }) => signed === false
									) && (
										<Tooltip
											arrow
											placement="top-start"
											title={
												<div className="permit-button__tooltip">
													Ожидается подпись согласующих лиц
												</div>
											}
										>
											<div className="special-menu__signed">
												<img src="/img/svg/ok.svg" alt="" />
												<span>Подписано</span>
											</div>
										</Tooltip>
									)}
								{!workPermitInfo?.signers?.find(
									({ signed }) => signed === false
								) &&
									userSings?.map(({ role }) => (
										<Fragment key={role}>
											{(signValidStep === "first" &&
												(role === "permit_approver" ||
													role === "permit_acceptor")) ||
											(signValidStep === "second" &&
												role === "permit_acceptor") ||
											(signValidStep === "third" &&
												role === "permit_approver") ? (
												<Tooltip
													arrow
													placement="top-start"
													title={
														<div className="permit-button__tooltip">
															Ожидается подпись согласующих лиц
														</div>
													}
												>
													<div className="btn-wrapper">
														<button className="btn btn-primary" disabled>
															Подписать
														</button>
													</div>
												</Tooltip>
											) : (
												<button
													className="btn btn-primary"
													onClick={() => onSignClick(role)}
												>
													Подписать
												</button>
											)}
										</Fragment>
									))}
								{workPermitInfo?.signers?.find(({ user }) => user.id === userId)
									?.signed &&
									!workPermitInfo?.signers?.find(
										({ signed }) => signed === false
									) &&
									workPermitInfo?.responsible_manager?.id !== userId && (
										<Tooltip
											arrow
											placement="top-start"
											title={
												<div className="permit-button__tooltip">
													Ожидается подпись согласующих лиц
												</div>
											}
										>
											<div className="special-menu__signed">
												<img src="/img/svg/ok.svg" alt="" />
												<span>Подписано</span>
											</div>
										</Tooltip>
									)}
								{workPermitInfo?.signers?.find(
									({ user }) => user.id === userId
								) &&
									workPermitInfo?.signers?.find(
										({ signed }) => signed === false
									) && (
										<Tooltip
											arrow
											placement="top-start"
											title={
												<div className="permit-button__tooltip">
													Наряд-допуск отклонен одним из согласующих лиц
												</div>
											}
										>
											<div className="special-menu__signed">
												<img src="/img/svg/cancel.svg" alt="" />
												<span>Отклонено</span>
											</div>
										</Tooltip>
									)}
							</>
						)}
					</div>
				)}
		</>
	);
};

export default memo(FooterMenuPending);
