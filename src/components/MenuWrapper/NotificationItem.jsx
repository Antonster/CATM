import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { briefingsActions } from "../../store/actions";

const statusData = {
	briefing_invite: "Инструктаж",
	briefing_should_to_sign: "Инструктаж",
	briefing_worker_invite: "Работник",
	document_expired_user: "Документы",
	document_expired_director: "Работник",
	work_permit_signer_invite: "Наряд-допуск",
};

const subData = {
	briefing_invite: "",
	briefing_should_to_sign: "",
	briefing_worker_invite: "",
	document_expired_user: "",
	document_expired_director: "",
	work_permit_signer_invite: "",
};

const buttonData = {
	briefing_invite: "Перейти в инструктаж",
	briefing_should_to_sign: "Перейти в инструктаж",
	briefing_worker_invite: "Перейти в карточку работника",
	document_expired_user: "Перейти в личную карточку",
	document_expired_director: "Перейти в карточку работника",
	work_permit_signer_invite: "Перейти в наряд-допуск",
};

const buttonLink = {
	briefing_invite: (id) => `/briefings/executor/${id}`,
	briefing_should_to_sign: (id) => `/briefings/executor/${id}`,
	briefing_worker_invite: (id) => `/employee/${id}`,
	document_expired_user: () => "/",
	document_expired_director: (id) => `/employee/${id}`,
	work_permit_signer_invite: (id) => `/work-permits/${id}`,
};

const NotificationItem = ({
	notification_id,
	created_at,
	message,
	tags,
	type,
	onCloseNotificationWindow,
	onRemoveMessage,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onClickButton = useCallback(() => {
		if (tags?.user_id) {
			navigate(buttonLink[type](tags.user_id));
		} else if (tags?.briefing_id) {
			dispatch(briefingsActions.fetchBriefingsList());
			navigate(buttonLink[type](tags.briefing_id));
		} else if (tags?.work_permit_id) {
			navigate(buttonLink[type](tags.work_permit_id));
		} else {
			navigate(buttonLink[type]());
		}

		onRemoveMessage(notification_id);
		onCloseNotificationWindow();
	}, [
		dispatch,
		navigate,
		notification_id,
		onCloseNotificationWindow,
		onRemoveMessage,
		tags,
		type,
	]);

	const onClickCloseButton = useCallback(() => {
		onRemoveMessage(notification_id);
	}, [notification_id, onRemoveMessage]);

	return (
		<div className="notifications-item">
			<div className="notifications-item__header">
				<div className="notifications-item__status">
					<div className="notifications-item__date">
						{dayjs(created_at).format("DD.MM.YYYY")}
					</div>
					{statusData[type] && (
						<div className={`notifications-item__type ${type}`}>
							{statusData[type]}
						</div>
					)}
				</div>
				<button
					className="btn notifications-item__close"
					onClick={onClickCloseButton}
				>
					<CloseIcon fontSize="small" />
				</button>
			</div>
			{message && <div className="notifications-item__title">{message}</div>}
			{subData[type] && (
				<div className="notifications-item__description">{subData[type]}</div>
			)}
			{buttonData[type] && (
				<button
					className="btn btn-primary notifications-item__link"
					onClick={onClickButton}
				>
					{buttonData[type]}
				</button>
			)}
		</div>
	);
};

export default memo(NotificationItem);
