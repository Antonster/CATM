import { memo, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideFilter from "./components/SideFilter";
import PermitsList from "./components/PermitsList";
import Tabs from "../../ui/Tabs/Tabs";
import Pagination from "../../ui/Pagination/Pagination";
import ModalWide from "../../ui/ModalWide/ModalWide";
import PermitForm from "./components/Form/PermitForm";
import WorkType from "./components/WorkType";
import { useCustomSearchParams } from "../../hooks/useSearchParams";
import permitsService from "../../services/permits.service";
import { permitsActions } from "../../store/actions";
import "./work-permits-page.css";

const tabsOptions = [
	{ title: "Все", value: "all" },
	{ title: "На согласовании", value: "pending" },
	{ title: "Подписанные", value: "signed" },
	{ title: "Новые", value: "new" },
	{ title: "Архив", value: "archived" },
];

const WorkPermitsPage = () => {
	const dispatch = useDispatch();
	const role = localStorage.getItem("role");
	const workTypes = useSelector((state) => state.permits?.workTypes);
	const organization = useSelector(
		(state) => state.currentUser?.organization?.name
	);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const [workType, setWorkType] = useState("");
	const [step, setStep] = useState("type");
	const [permitsList, setPermitsList] = useState([]);
	const [permitsCount, setPermitsCount] = useState(0);
	const { updateSearchParam, setSearchParams, searchParamsObj, searchParams } =
		useCustomSearchParams();
	const currentTab = searchParamsObj["status"];
	const currentSortValue = searchParamsObj?.ordering;

	const updateCurrentTab = useCallback(
		(tabTitle) => {
			if (tabTitle === currentTab) return;
			const newOption = tabsOptions.find((item) => item.title === tabTitle);
			setSearchParams({
				...searchParamsObj,
				status: newOption.value !== "all" ? newOption.value : "",
				ordering: searchParamsObj["ordering"]
					? searchParamsObj["ordering"]
					: "-id",
				page: 1,
			});
		},
		[currentTab, searchParamsObj, setSearchParams]
	);

	const openCreateModal = useCallback(() => {
		setIsCreateModalVisible(true);
	}, []);

	const sortHandle = useCallback(() => {
		if (!currentSortValue || currentSortValue !== "id") {
			updateSearchParam("ordering", "id");
		} else {
			updateSearchParam("ordering", "-id");
		}
	}, [currentSortValue, updateSearchParam]);

	useEffect(() => {
		const getPermits = async () => {
			try {
				const res = await permitsService.getWorkPermits(
					searchParams.toString()
				);
				setPermitsList(res.data.results);
				setPermitsCount(res.data.count);
			} catch (e) {
				console.log(e);
			}
		};
		getPermits();
	}, [searchParamsObj]);

	useEffect(() => {
		if (!isCreateModalVisible) {
			setWorkType("");
			setStep("type");
		}
	}, [isCreateModalVisible]);

	useEffect(() => {
		if (!workTypes) {
			dispatch(permitsActions.fetchWorkTypes());
		}
	}, [workTypes]);

	return (
		<div className="sIndex" id="sIndex">
			{isCreateModalVisible && (
				<ModalWide
					header={"Новый наряд-допуск"}
					setIsVisible={setIsCreateModalVisible}
					paddings={"0"}
				>
					{step === "type" && (
						<WorkType
							{...{
								setStep,
								workTypes,
								workType,
								setWorkType,
							}}
						/>
					)}
					{step === "form" && (
						<PermitForm
							{...{
								setIsCreateModalVisible,
								workType,
								workTypes,
								organization,
							}}
						/>
					)}
				</ModalWide>
			)}
			<div className="sIndex__main">
				<div className="work-permit tabs">
					<Tabs
						value={currentTab}
						options={tabsOptions}
						cb={updateCurrentTab}
					/>
					<div className="work-permit-list">
						<div className="work-permit-list__wrap">
							<h2>Наряд-допуски</h2>
							{role === "director" && (
								<button
									className="btn btn-primary btn-with-icon"
									onClick={openCreateModal}
								>
									<img src="/img/svg/plus.svg" alt="" />
									<span>Добавить новый наряд</span>
								</button>
							)}
						</div>
						<div className="work-permit-list__sort">
							<span>Сортировать по:</span>
							<div
								className={
									"work-permit-list__sort-btn" +
									(currentSortValue === "id" ? "active" : "")
								}
								onClick={sortHandle}
							>
								<svg className="icon icon-sort-line">
									<use href="/img/svg/sprite.svg#sort-line"></use>
								</svg>
								<span>Номеру</span>
								<svg className="icon icon-sort-triangle">
									<use href="/img/svg/sprite.svg#sort-triangle"></use>
								</svg>
							</div>
						</div>
						<div className="tabs-content-wrap">
							<PermitsList permitsList={permitsList}></PermitsList>
							{permitsCount > 10 && <Pagination itemsTotal={permitsCount} />}
						</div>
					</div>
				</div>
			</div>
			<SideFilter
				searchParamsObj={searchParamsObj}
				setSearchParams={setSearchParams}
			/>
		</div>
	);
};

export default memo(WorkPermitsPage);
