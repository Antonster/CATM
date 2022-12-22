import { memo } from "react";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "../../../ui/Avatar/Avatar";

const PeopleList = ({ list, onSignWorker, userId, workPermitInfo }) => {
	return (
		<div className="work-permit-agree-container">
			{list?.map(
				({
					id: briefingUserId,
					user: { id, avatar, first_name, last_name, position },
					replacement_to,
					signed,
					signed_by_instructor,
					role,
					role_label,
				}) => (
					<div
						key={id + (role_label || "")}
						className={`work-permit-agree-item ${
							replacement_to ? "disabled-wrapper" : ""
						}`}
					>
						{role_label && (
							<div className="work-permit-agree-item__title">{role_label}</div>
						)}
						<div className={`work-permit-agree-item__wrap`}>
							{
								<Avatar
									{...{
										firstName: first_name,
										lastName: last_name,
										image: avatar,
										size: "medium",
									}}
								/>
							}
							<div
								className={`work-permit-agree-item__item-info ${
									signed &&
									userId &&
									!signed_by_instructor &&
									workPermitInfo?.responsible_manager?.id === userId
										? "with-btn"
										: "without-btn"
								}`}
							>
								<div className="work-permit-agree-item__name">
									{first_name} {last_name}
								</div>
								<div className="work-permit-agree-item__job">{position}</div>
							</div>
							{signed &&
								userId &&
								!signed_by_instructor &&
								workPermitInfo?.responsible_manager?.id === userId && (
									<button
										className="btn btn-primary small"
										onClick={() => onSignWorker(briefingUserId)}
									>
										Подписать
									</button>
								)}
							<div className="work-permit-agree-item__item-status">
								{signed && <img src="/img/svg/ok.svg" alt="" />}
								{(signed == null || (signed === false && !role)) && (
									<img src="/img/svg/cancel.svg" alt="" />
								)}
								{signed === false && !!role && (
									<Tooltip
										arrow
										placement="top-start"
										title={
											<div className="employee-permit__health-tooltip">
												Отклонено
											</div>
										}
									>
										<img src="/img/svg/warning.svg" alt="" />
									</Tooltip>
								)}
							</div>
						</div>
					</div>
				)
			)}
		</div>
	);
};

export default memo(PeopleList);
