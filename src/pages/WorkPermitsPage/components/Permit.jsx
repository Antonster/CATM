import { memo } from "react";
import { NavLink } from "react-router-dom";

const Permit = ({ permit }) => {
	const permitStatuses = {
		pending: {
			title: "На согласовании",
			class: "work-status--accepting",
		},
		signed: {
			title: "Подписанный",
			class: "work-status--done",
		},
		new: {
			title: "Новый",
			class: "work-status--new",
		},
		archived: {
			title: "Архив",
			class: "work-status--archive",
		},
	};

	return (
		<div className="tabs__content active">
			<NavLink to={`/work-permits/${permit.id}`} className="work-permit-item">
				<div className="work-permit-item__head">
					<div className="work-permit-item__head-status">
						<div
							className={"work-status " + permitStatuses[permit.status].class}
						>
							{permitStatuses[permit.status].title}
						</div>
						<div className="work-permit-item__create">
							<div className="title">Создан:</div>
							<div className="caption">{permit.created}</div>
						</div>
						{/*<div className="work-permit-item__prolong">*/}
						{/*    <div className="title">Продлен:</div>*/}
						{/*    <div className="caption">17.08.2022</div>*/}
						{/*</div>*/}
					</div>
					<div className="work-permit-item__badge">
						{permit.work_type.title}
					</div>
				</div>
				<div className="work-permit-item__body">
					<div className="work-permit-item__body-main-info">
						<div className="work-permit-item__title">
							Наряд-допуск №{permit.id}
						</div>
						<div className="work-permit-item__caption">{permit.place}</div>
					</div>
					<div className="work-permit-item__body-caption-info">
						<div className="work-permit-item__workers">
							<div className="title">Работников:&nbsp;</div>
							<div className="caption">{permit.workers_count}</div>
						</div>
						<div className="work-permit-item__boss">
							<div className="title">Руководитель:&nbsp;</div>
							<div className="caption">{permit.responsible_manager}</div>
						</div>
					</div>
				</div>
			</NavLink>
		</div>
	);
};
export default memo(Permit);
