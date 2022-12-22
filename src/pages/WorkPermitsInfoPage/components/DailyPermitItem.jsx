import { memo } from "react";
import { useSelector } from "react-redux";

const DailyPermitItem = ({
	removeDailyPermit,
	signDailyPermit,
	closeDailyPermit,
	id,
	date_start,
	date_end,
	responsible_manager,
	permitter,
}) => {
	const userId = useSelector((state) => state.currentUser.user.id);

	return (
		<div className="permit-info-card">
			<div className="permit-info-card__title">{date_start.split(" ")[0]}</div>
			{!permitter.signed && responsible_manager.user.id === userId && (
				<button
					className="permit-info-card__close"
					onClick={() => removeDailyPermit(id)}
				>
					<img src="/img/svg/cancel.svg" alt="" />
				</button>
			)}
			<div className="permit-info-card__text">
				<span className="title">Начало работ:</span>
				<span className="caption">{date_start.split(" ")[1]}</span>
			</div>
			<div className="permit-info-card__text">
				<span className="title">Ответственный:</span>
				<span className="caption">
					{responsible_manager.user.last_name +
						" " +
						responsible_manager.user.first_name}
				</span>
			</div>
			<div className="permit-info-card__text">
				<span className="title">Допускающий:</span>
				<span className="caption">
					{permitter.user.last_name + " " + permitter.user.first_name}
				</span>
			</div>
			{!date_end &&
				!permitter.signed &&
				!responsible_manager.signed &&
				permitter.user.id !== userId && (
					<button className="permit-info-card__btn btn btn-primary" disabled>
						На согласовании
					</button>
				)}
			{!date_end &&
				!permitter.signed &&
				!responsible_manager.signed &&
				permitter.user.id === userId && (
					<button
						className="permit-info-card__btn btn btn-primary"
						onClick={() => signDailyPermit({ id, date_start })}
					>
						Подписать ежедневный допуск
					</button>
				)}
			{!date_end &&
				permitter.signed &&
				!responsible_manager.signed &&
				responsible_manager.user.id !== userId && (
					<button className="permit-info-card__btn btn btn-primary" disabled>
						Подписано
					</button>
				)}
			{!date_end &&
				permitter.signed &&
				!responsible_manager.signed &&
				responsible_manager.user.id === userId && (
					<button
						className="permit-info-card__btn btn btn-primary"
						onClick={() => closeDailyPermit({ id, date_start })}
					>
						Окончить работы и подписать
					</button>
				)}
			{date_end && (
				<button className="permit-info-card__btn btn btn-primary" disabled>
					Работы окончены {date_end.split(" ")[0]} в {date_end.split(" ")[1]}
				</button>
			)}
		</div>
	);
};

export default memo(DailyPermitItem);
