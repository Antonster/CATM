import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const TopMenu = ({ workPermitInfo }) => {
	const navigate = useNavigate();

	const badgeColor = useCallback(() => {
		switch (workPermitInfo?.work_permit?.status) {
			case "new":
				return "--gray";
			case "pending":
				return "--yellow";
			case "signed":
				return "--green";
			case "archived":
				return "--archived";
			default:
				return "--gray";
		}
	}, [workPermitInfo?.work_permit?.status]);

	return (
		<>
			{workPermitInfo && (
				<>
					<span onClick={() => navigate("/work-permits")} className="prev-btn">
						<svg className="icon icon-arrow ">
							<use href="/img/svg/sprite.svg#arrow" />
						</svg>
						<span>Назад</span>
					</span>
					<h3>Наряд-допуск №{workPermitInfo?.work_permit?.id}</h3>
					<div className="sWorkPermitCard__status-wrap">
						<div className="badge badge--blue">
							{workPermitInfo?.work_permit?.work_type?.title}
						</div>
						<div className={`badge badge${badgeColor()}`}>
							{workPermitInfo?.work_permit?.status_name}
						</div>
						<div className="sWorkPermitCard__status-text">
							<span className="title">Создан:</span>
							<span className="caption">
								{workPermitInfo?.work_permit?.created}
							</span>
						</div>
						{workPermitInfo?.extension && (
							<div className="sWorkPermitCard__status-text">
								<span className="title">Продлен до:</span>
								<span className="caption">
									{workPermitInfo?.work_permit?.expiration_date}
								</span>
							</div>
						)}
						{workPermitInfo?.work_permit?.closing_date && (
							<div className="sWorkPermitCard__status-text">
								<span className="title">Закрыт:</span>
								<span className="caption">
									{workPermitInfo?.work_permit?.closing_date}
								</span>
							</div>
						)}
					</div>
					<div className="sWorkPermitCard__status-wrap">
						<div className="sWorkPermitCard__status-text">
							<span className="title">Работников:</span>
							<span className="caption">{workPermitInfo?.workers_count}</span>
						</div>
						<div className="sWorkPermitCard__status-text">
							<span className="title">Руководитель:</span>
							<span className="caption">
								{workPermitInfo?.responsible_manager?.last_name &&
									workPermitInfo?.responsible_manager?.first_name &&
									workPermitInfo?.responsible_manager?.last_name +
										" " +
										workPermitInfo?.responsible_manager?.first_name}
							</span>
						</div>
						<div className="sWorkPermitCard__status-text">
							<span className="title">Адрес:</span>
							<span className="caption">
								{workPermitInfo?.work_permit?.place}
							</span>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default memo(TopMenu);
