import { memo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const BriefingsList = () => {
	const navigate = useNavigate();
	const { briefingsListByType } = useOutletContext();

	return (
		<div className="briefing-unplanned">
			{briefingsListByType &&
				briefingsListByType.map(({ id, title, userbriefing_signed_at }) => (
					<div
						className="briefing-unplanned__item"
						key={id}
						onClick={() => navigate(`/briefings/executor/${id}`)}
					>
						<div className="briefing-unplanned__title">{title}</div>
						<div className="sBriefing__status">
							{userbriefing_signed_at ? (
								<>
									<img src="/img/svg/ok.svg" alt="" />
									<span>Инструктаж пройден</span>
								</>
							) : (
								<>
									<img src="/img/svg/wait.svg" alt="" />
									<span>Ожидает прохождения</span>
								</>
							)}
						</div>
					</div>
				))}
		</div>
	);
};

export default memo(BriefingsList);
