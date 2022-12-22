import { memo } from "react";

const RiskFactorsCard = ({ workPermitInfo, userId, setRiskFactorsModal }) => {
	return (
		<>
			{(workPermitInfo?.work_permit?.status === "pending" ||
				workPermitInfo?.work_permit?.status === "signed") &&
				(workPermitInfo?.responsible_manager?.id === userId ||
					workPermitInfo?.signers?.find(({ user }) => user.id === userId)
						?.role === "permitter") && (
					<div className="risk-factors__menu">
						<div className="risk-factors__title">
							Обязательные мероприятия по снижению воздействия опасных факторов
						</div>
						{workPermitInfo?.responsible_manager?.id === userId &&
							workPermitInfo?.signers?.find(({ user }) => user.id === userId)
								?.role !== "permitter" && (
								<>
									{workPermitInfo?.signers?.find(
										({ role }) => role === "permitter"
									)?.signed ? (
										<img src="/img/svg/ok.svg" alt="" />
									) : (
										<img src="/img/svg/cancel.svg" alt="" />
									)}
								</>
							)}
						{workPermitInfo?.signers?.find(({ user }) => user.id === userId)
							?.role === "permitter" && (
							<button
								className="btn risk-factors__btn"
								onClick={() => setRiskFactorsModal(true)}
							>
								Ознакомиться
							</button>
						)}
					</div>
				)}
		</>
	);
};

export default memo(RiskFactorsCard);
