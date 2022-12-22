import { memo, useState, useEffect, useCallback, useRef } from "react";
import useWebSocket from "react-use-websocket";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Portal, ClickAwayListener } from "@mui/material";
import { styled } from "@mui/material/styles";
import Avatar from "../../ui/Avatar/Avatar";
import NotificationItem from "./NotificationItem";
import { relativeUrlResolver } from "../../assets/helper.funcs";

const StyledBadge = styled(Badge)(() => ({
	"& .MuiBadge-badge": {
		backgroundColor: "#FFD664",
		color: "white",
		fontFamily: "Museo Sans Cyrl",
		fontWeight: "600",
	},
}));

const TopHat = () => {
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.currentUser?.user);
	const notificationsSocket = process.env.REACT_APP_NOTIFICATIONS_SOCKET;
	const authToken = localStorage.getItem("authToken");
	const portalContainer = useRef(null);
	const [open, setOpen] = useState(false);
	const [messageHistory, setMessageHistory] = useState([]);

	const { sendMessage, lastMessage } = useWebSocket(notificationsSocket, {
		queryParams: { token: authToken },
		shouldReconnect: (closeEvent) => true,
		reconnectInterval: 10000,
		reconnectAttempts: 30,
	});

	const onRemoveMessage = useCallback(
		(id) => {
			sendMessage(
				JSON.stringify({
					type: "read_notifications",
					data: {
						ids: [id],
					},
				})
			);
			setMessageHistory((prev) =>
				prev.filter((item) => item.notification_id !== id)
			);
		},
		[sendMessage]
	);

	const onRemoveAllMessages = useCallback(() => {
		sendMessage(
			JSON.stringify({
				type: "read_notifications",
				data: {
					ids: messageHistory.map((item) => item.notification_id),
				},
			})
		);
		setMessageHistory([]);
	}, [messageHistory, sendMessage]);

	const onCloseNotificationWindow = useCallback(() => {
		setOpen(false);
	}, []);

	const onClickNotificationsIcon = useCallback(() => {
		setOpen((prev) => !prev);
	}, []);

	const onClickAway = useCallback(() => {
		setOpen(false);
	}, []);

	useEffect(() => {
		if (lastMessage !== null) {
			const messageData = JSON.parse(lastMessage.data);

			if (messageData?.type === "unread_notifications") {
				setMessageHistory((prev) => [...prev, ...messageData.data]);
			}

			if (messageData?.type === "notification") {
				setMessageHistory((prev) => {
					if (
						!prev.find(
							(item) =>
								item.notification_id === messageData.data.notification_id
						)
					) {
						return [messageData.data, ...prev];
					}
					return prev;
				});
			}
		}
	}, [lastMessage, setMessageHistory]);

	useEffect(() => {
		dispatch({ type: "FETCH_CURRENT_USER" });
	}, []);

	return (
		<div className="topLine" id="topLine">
			<Link className="topLine__logo" to="/">
				<img src="/img/svg/logo.svg" alt="" />
			</Link>
			{currentUser && (
				<div className="topLine__block">
					<ClickAwayListener onClickAway={onClickAway}>
						<div className="topLine__notifications" ref={portalContainer}>
							<>
								<StyledBadge badgeContent={messageHistory?.length || 0}>
									<svg
										className="icon icon-notifications"
										onClick={onClickNotificationsIcon}
									>
										<use href="/img/svg/sprite.svg#notifications" />
									</svg>
								</StyledBadge>
								{open ? (
									<Portal container={portalContainer.current}>
										<div className="notifications-container">
											<div className="notifications-header">
												<div className="notifications-header__title">
													Уведомления
												</div>
												<div
													className="notifications-header__clear"
													onClick={onRemoveAllMessages}
												>
													Очистить все
												</div>
											</div>
											<div className="notifications-content">
												{messageHistory?.length ? (
													messageHistory.map(
														({
															notification_id,
															created_at,
															message,
															tags,
															type,
														}) => (
															<NotificationItem
																key={notification_id}
																{...{
																	notification_id,
																	created_at,
																	message,
																	tags,
																	type,
																	onCloseNotificationWindow,
																	onRemoveMessage,
																}}
															/>
														)
													)
												) : (
													<div className="notifications-empty">
														У вас нет новых уведомлений
													</div>
												)}
											</div>
										</div>
									</Portal>
								) : null}
							</>
						</div>
					</ClickAwayListener>
					<Link className="topLine__profile" to="/">
						<Avatar
							firstName={currentUser.first_name}
							lastName={currentUser.last_name}
							image={relativeUrlResolver(currentUser.avatar)}
							size={"xs"}
						/>
					</Link>
				</div>
			)}
		</div>
	);
};

export default memo(TopHat);
