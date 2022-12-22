import { memo, Fragment, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, NavLink } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import { briefingsActions } from "../../store/actions";
import TitleWrapper from "../../ui/TitleWrapper/TitleWrapper";
import Tabs from "../../ui/Tabs/Tabs";
import Pagination from "../../ui/Pagination/Pagination";
import { useCustomSearchParams } from "../../hooks/useSearchParams";

const tableCategories = [
	{
		text: "Название инструктажа",
		filter: true,
		param: "title",
	},
	{
		text: "Категория инструктажа",
		filter: true,
		param: "category",
	},
	{
		text: "Вид инструктажа",
		filter: true,
		param: "type",
	},
	{
		text: "Пройдено/Всего",
		filter: false,
	},
	{
		text: "",
		filter: false,
	},
];

const Creator = () => {
	const { tabsOptions, updateCurrentTab } = useOutletContext();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const role = localStorage.getItem("role");
	const briefingsCategories = useSelector(
		(state) => state.briefings?.categories
	);
	const briefingsTypes = useSelector((state) => state.briefings?.types);
	const myBriefingsList = useSelector(
		(state) => state.briefings?.myBriefingsList
	);
	const { setSearchParams, searchParamsObj, searchParams } =
		useCustomSearchParams();
	const [deletionPopup, setDeletionPopup] = useState(false);

	const onMoveFirstPage = useCallback(() => {
		setSearchParams({
			...searchParamsObj,
			page: 1,
		});
	}, [searchParamsObj, setSearchParams]);

	const deleteWorkPermitById = useCallback(async () => {
		if (
			(searchParamsObj?.pagesize &&
				myBriefingsList?.count &&
				myBriefingsList?.count % searchParamsObj?.pagesize === 1) ||
			(myBriefingsList?.count && myBriefingsList?.count % 10 === 1)
		) {
			dispatch(
				briefingsActions.deleteBriefing(deletionPopup, "", onMoveFirstPage)
			);
		} else {
			dispatch(
				briefingsActions.deleteBriefing(deletionPopup, searchParams.toString())
			);
		}
		setDeletionPopup(false);
	}, [
		deletionPopup,
		dispatch,
		myBriefingsList?.count,
		onMoveFirstPage,
		searchParams,
		searchParamsObj?.pagesize,
	]);

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

	useEffect(() => {
		if (role !== "security_manager") {
			navigate(-1);
		}
	}, []);

	useEffect(() => {
		dispatch(briefingsActions.fetchMyBriefingsList(searchParams.toString()));
	}, [searchParams]);

	return (
		<>
			<Dialog onClose={() => setDeletionPopup(false)} open={!!deletionPopup}>
				<div className="sNewPermit-popup">
					<div className="sNewPermit-popup__title">Удалить инструктаж?</div>
					<button className="btn btn-primary" onClick={deleteWorkPermitById}>
						Подтвердить
					</button>
					<button
						className="btn btn-outline-primary"
						onClick={() => setDeletionPopup(false)}
					>
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
				<div className="my-briefing__btn-wrap">
					<button className="my-briefing__plus">
						<img src="/img/svg/plus-big.svg" alt="" />
						<NavLink to={"/briefings/creator/create"}>
							<span>Создать инструктаж</span>
						</NavLink>
					</button>
				</div>
				<div className="briefings-grid-list">
					{tableCategories.map(({ text, filter, param }) => (
						<div
							key={text}
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
					{myBriefingsList?.results?.map(
						({
							id,
							title,
							category,
							type,
							count_signed_users,
							count_users,
						}) => (
							<Fragment key={id}>
								<div className="employee-list__item briefings-list-name">
									<NavLink to={`/briefings/creator/briefing/${id}`}>
										<span>{title}</span>
									</NavLink>
								</div>
								<div className="employee-list__item">
									{
										briefingsCategories?.find((item) => item.id === +category)
											.value
									}
								</div>
								<div className="employee-list__item">
									{briefingsTypes?.find((item) => item.id === +type).value}
								</div>
								<div className="employee-list__item">
									<span className="positive">{count_signed_users}</span>
									<span className="slash">/</span>
									<span className="negative">{count_users}</span>
								</div>
								<div className="employee-list__item">
									<NavLink
										to={`/briefings/creator/edit/${id}`}
										className="employee-list-item__edit"
									>
										<svg className="icon icon-pen">
											<use href="/img/svg/sprite.svg#pen"></use>
										</svg>
									</NavLink>
									<button
										className="employee-list-item__delete"
										onClick={() => setDeletionPopup(id)}
									>
										<svg className="icon icon-trash">
											<use href="/img/svg/sprite.svg#trash"></use>
										</svg>
									</button>
								</div>
							</Fragment>
						)
					)}
				</div>
				{myBriefingsList?.count > 10 && (
					<Pagination itemsTotal={myBriefingsList?.count} />
				)}
			</div>
		</>
	);
};

export default memo(Creator);
