import { memo } from "react";
import { useSelector } from "react-redux";

const AnalyzesItem = ({
	id,
	components,
	concentration,
	date,
	date_next,
	device_model,
	device_number,
	place,
	result,
	time,
	user,
	removeAnalyze,
}) => {
	const userId = useSelector((state) => state.currentUser.user.id);

	return (
		<div className="permit-info-card">
			<div className="permit-info-card__title">{date}</div>
			{user.id === userId && (
				<button
					className="permit-info-card__close"
					onClick={() => removeAnalyze(id)}
				>
					<img src="/img/svg/cancel.svg" alt="" />
				</button>
			)}
			<div className="permit-info-card__text">
				<span className="title">Отбор проб:</span>
				<span className="caption">{time}</span>
			</div>
			<div className="permit-info-card__text">
				<span className="title">Место отбора проб:</span>
				<span className="caption">{place}</span>
			</div>
			<div className="permit-info-card__text">
				<span className="title">Определяемые компоненты:</span>
				<span className="caption">{components}</span>
			</div>
			<div className="permit-info-card__text">
				<span className="title">Допустимая концентрация:</span>
				<span className="caption">{concentration}</span>
			</div>
			<div className="permit-info-card__text">
				<span className="title">Результаты анализа:</span>
				<span className="caption">{result}</span>
			</div>
			<div className="permit-info-card__text">
				<span className="title">Лицо, проводящее анализ:</span>
				<span className="caption">
					{user.last_name + " " + user.first_name}
				</span>
			</div>
			<div className="permit-info-card__text">
				<span className="title">Наименование прибора:</span>
				<span className="caption">{device_model + " " + device_number}</span>
			</div>
			<div className="permit-info-card__text">
				<span className="title">Дата следующей поверки:</span>
				<span className="caption">{date_next}</span>
			</div>
		</div>
	);
};

export default memo(AnalyzesItem);
