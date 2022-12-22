import { memo, Fragment, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import parse from "html-react-parser";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import TitleWrapper from "../../ui/TitleWrapper/TitleWrapper";
import Tabs from "../../ui/Tabs/Tabs";
import Avatar from "../../ui/Avatar/Avatar";
import PeopleList from "./components/PeopleList";
import ModalWide from "../../ui/ModalWide/ModalWide";
import { useCustomSearchParams } from "../../hooks/useSearchParams";
import { briefingsActions } from "../../store/actions";
import { prettifySize } from "../../assets/helper.funcs";

const tableCategories = [
	{
		id: "1",
		text: "",
		filter: false,
	},
	{
		id: "2",
		text: "Имя Фамилия",
		filter: true,
		param: "user__first_name",
	},
	{
		id: "3",
		text: "Подразделение",
		filter: true,
		param: "user__unit",
	},
	{
		id: "4",
		text: "Должность",
		filter: true,
		param: "user__position",
	},
	{
		id: "5",
		text: "Инструктаж пройден",
		filter: false,
	},
	{
		id: "6",
		text: "",
		filter: false,
	},
];

const MyBriefing = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { tabsOptions, updateCurrentTab } = useOutletContext();
	const dispatch = useDispatch();
	const briefingsCategories = useSelector(
		(state) => state.briefings?.categories
	);
	const briefingsTypes = useSelector((state) => state.briefings?.types);
	const briefingUsers = useSelector((state) => state.briefings?.briefingUsers);
	const activeBriefing = useSelector(
		(state) => state.briefings?.activeBriefing
	);
	const { setSearchParams, searchParamsObj, searchParams } =
		useCustomSearchParams();
	const [isPeopleModal, setPeopleModal] = useState("");
	const [deletionPopup, setDeletionPopup] = useState(false);
	const [activeUser, setActiveUser] = useState();
	const [confirmationDialog, setConfirmationDialog] = useState(false);
	const [isDocumentModal, setIsDocumentModal] = useState(false);

	const changeFilter = useCallback(
		(param) => {
			let newParam;

			if (param === searchParamsObj?.ordering?.slice(1)) {
				newParam = param;
			} else if (param === searchParamsObj?.ordering) {
				newParam = `-${param}`;
			} else {
				newParam = param;
			}

			setSearchParams({
				...searchParamsObj,
				ordering: newParam,
			});
		},
		[searchParamsObj, setSearchParams]
	);

	const onOpenPopup = useCallback(
		(userId) => {
			setActiveUser(briefingUsers?.find(({ id }) => id === userId));
			setDeletionPopup(true);
		},
		[briefingUsers]
	);

	const onClosePopup = useCallback(() => {
		setActiveUser();
		setDeletionPopup(false);
	}, []);

	const onDeleteUser = useCallback(
		(user) => {
			dispatch(
				briefingsActions.deleteBriefingUser(
					id,
					user.id,
					searchParams.toString()
				)
			);
			setDeletionPopup(false);
		},
		[dispatch, id, searchParams]
	);

	const onSignUser = useCallback(
		(userId) => {
			dispatch(
				briefingsActions.signBriefingUser(id, userId, searchParams.toString())
			);
		},
		[dispatch, id, searchParams]
	);

	const onSignAll = useCallback(() => {
		dispatch(briefingsActions.signAllBriefingUser(id, searchParams.toString()));
	}, [dispatch, id, searchParams]);

	const onUpdateBriefingAllUsers = useCallback(() => {
		console.log(id);
		dispatch(briefingsActions.updateBriefingAllUsers(id));
		setConfirmationDialog(false);
		setPeopleModal(false);
	}, [dispatch, id]);

	useEffect(() => {
		dispatch(briefingsActions.fetchBriefingUsers(id, searchParams.toString()));
	}, [searchParams]);

	useEffect(() => {
		dispatch(briefingsActions.fetchBriefingById(id));

		return () => {
			dispatch(briefingsActions.setActiveBriefing(null));
			dispatch(briefingsActions.setBriefingUsers(null));
		};
	}, []);

	return (
		<>
			{isDocumentModal && (
				<ModalWide header="" setIsVisible={setIsDocumentModal} paddings="0">
					<iframe
						title={activeBriefing.file_name}
						src={activeBriefing.file}
						className={"iframe_document__wrapper"}
					/>
				</ModalWide>
			)}
			{isPeopleModal && (
				<ModalWide
					header="Направление на инструктаж"
					setIsVisible={setPeopleModal}
					paddings={"0"}
				>
					<PeopleList
						{...{
							briefingId: id,
							setPeopleModal,
							setConfirmationDialog,
						}}
					/>
				</ModalWide>
			)}
			<Dialog
				onClose={() => setConfirmationDialog(false)}
				open={confirmationDialog}
			>
				<div className="sNewPermit-popup">
					<div className="sNewPermit-popup__title">
						Направить всех пользователей на инструктаж?
					</div>
					<button
						className="btn btn-primary"
						onClick={onUpdateBriefingAllUsers}
					>
						Подтвердить
					</button>
					<button
						className="btn btn-outline-primary"
						onClick={() => setConfirmationDialog(false)}
					>
						Отмена
					</button>
				</div>
			</Dialog>
			<Dialog onClose={onClosePopup} open={deletionPopup}>
				<div className="sNewPermit-popup">
					<div className="sNewPermit-popup__title">
						Удалить направление на инструктаж у пользователя{" "}
						{activeUser?.user?.first_name} {activeUser?.user?.last_name}?
					</div>
					<button
						className="btn btn-primary"
						onClick={() => onDeleteUser(activeUser)}
					>
						Подтвердить
					</button>
					<button className="btn btn-outline-primary" onClick={onClosePopup}>
						Отмена
					</button>
				</div>
			</Dialog>
			<TitleWrapper title={"Мои инструктажи"} />
			<Tabs
				value={"/briefings/creator"}
				options={tabsOptions}
				cb={updateCurrentTab}
			/>
			<div className="my-briefing">
				<div
					className="prev-btn"
					onClick={() => navigate("/briefings/creator")}
				>
					<svg className="icon icon-arrow ">
						<use href="/img/svg/sprite.svg#arrow"></use>
					</svg>
				</div>
				<div className="my-briefing__head">
					<h2>{activeBriefing?.title}</h2>
				</div>
				<div className="sWorkPermitCard__status-wrap">
					<div className="badge badge--blue">
						{activeBriefing?.category &&
							briefingsCategories?.find(
								(item) => item.id === +activeBriefing.category
							).value}
					</div>
					<div className="badge badge--gray">
						{activeBriefing?.type &&
							briefingsTypes?.find((item) => item.id === +activeBriefing.type)
								.value}
					</div>
					<div className="sWorkPermitCard__status-text">
						<span className="title">Направлено:</span>
						<span className="caption">{activeBriefing?.count_users}</span>
					</div>
				</div>
				{activeBriefing?.reason && (
					<div className="sWorkPermitCard__status-wrap">
						<div className="sWorkPermitCard__status-text">
							<span className="title">Причина проведения:</span>
							<span className="caption">{activeBriefing.reason}</span>
						</div>
					</div>
				)}
				{activeBriefing?.file &&
					activeBriefing?.file_name &&
					activeBriefing?.file_size && (
						<div className="sWorkPermitCard__file-wrap">
							<div className="file">
								<div className="file__img">
									<img src="/img/svg/pdf.svg" alt="" />
								</div>
								<div className="file__info">
									<div
										className="file__name"
										onClick={() => setIsDocumentModal(activeBriefing.file)}
									>
										{activeBriefing.file_name}
									</div>
									<div className="file__type">
										pdf {prettifySize(activeBriefing.file_size)}
									</div>
								</div>
							</div>
						</div>
					)}
				<div className="my-briefing__content-block">
					{parse(activeBriefing?.content || "")}
				</div>
				<h3>Направленные на инструктаж</h3>
				<div className="my-briefing__btn-wrap">
					<button
						className="my-briefing__plus"
						onClick={() => setPeopleModal(true)}
					>
						<img src="/img/svg/plus-big.svg" alt="" />
						<span>Направить на инструктаж</span>
					</button>
					<button
						className="my-briefing__btn-sign btn btn-primary"
						onClick={onSignAll}
						disabled={
							!briefingUsers?.find(
								({ signed, signed_by_instructor }) =>
									signed && !signed_by_instructor
							)
						}
					>
						Подписать все
					</button>
				</div>
				<div className="my-briefing-grid-list">
					{tableCategories.map(({ id, text, filter, param }) => (
						<div
							key={id}
							className={`employee-list-head__title ${filter ? "pointer" : ""}`}
							onClick={param ? () => changeFilter(param) : null}
						>
							{filter && (
								<svg
									className={`icon icon-select-bg ${
										param === searchParamsObj?.ordering?.slice(1) ? "top" : ""
									}`}
								>
									<use href="/img/svg/sprite.svg#select-bg"></use>
								</svg>
							)}
							<span className="employee-list-head__text">{text}</span>
						</div>
					))}
					{briefingUsers?.map(
						({
							id: userId,
							user: { avatar, first_name, last_name, position, unit },
							signed,
							signed_by_instructor,
						}) => (
							<Fragment key={userId}>
								<div className="employee-list__item">
									<Avatar
										{...{
											firstName: first_name,
											lastName: last_name,
											image: avatar,
											size: "small",
										}}
									/>
								</div>
								<div className="employee-list__item briefings-list-name">
									<span>{first_name + " " + last_name}</span>
								</div>
								<div className="employee-list__item">{unit?.title}</div>
								<div className="employee-list__item">{position}</div>
								<div className="employee-list__item employee-list-center">
									{signed ? (
										<img src="/img/svg/ok.svg" alt="" />
									) : (
										<img src="/img/svg/cancel.svg" alt="" />
									)}
								</div>
								<div className="employee-list__item briefings-list-end briefings-list-without-padding">
									{signed && signed_by_instructor && (
										<div className="employee-list-item__delete-wrap">
											<div className="employee-list-item__signed">
												<img src="/img/svg/ok.svg" alt="" />
												<span>Подписано</span>
											</div>
										</div>
									)}
									{signed && !signed_by_instructor && (
										<div className="employee-list-item__delete-wrap">
											<button
												className="employee-list-item__sign btn btn-primary"
												onClick={() => onSignUser(userId)}
											>
												Подписать
											</button>
										</div>
									)}
									{!signed && (
										<div className="employee-list-item__delete-wrap">
											<button
												className="employee-list-item__delete"
												onClick={() => onOpenPopup(userId)}
											>
												<svg className="icon icon-trash ">
													<use href="/img/svg/sprite.svg#trash"></use>
												</svg>
											</button>
										</div>
									)}
								</div>
							</Fragment>
						)
					)}
				</div>
			</div>
		</>
	);
};

export default memo(MyBriefing);
