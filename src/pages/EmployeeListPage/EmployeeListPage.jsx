import { memo, useState, useEffect, useMemo, useCallback } from "react";
import TitleWrapper from "../../ui/TitleWrapper/TitleWrapper";
import Tabs from "../../ui/Tabs/Tabs";
import SearchBlock from "../../ui/SearchBlock/SearchBlock";
import { useCustomSearchParams } from "../../hooks/useSearchParams";
import EmployeePageListMenu from "./components/EmployeePageListMenu";
import EmployeeList from "./components/EmployeeList";
import Pagination from "../../ui/Pagination/Pagination";
import ModalWide from "../../ui/ModalWide/ModalWide";
import NewEmployeeForm from "./components/NewEmployeeForm";
import { NavLink } from "react-router-dom";
import usersService from "../../services/users.service";

const tabsOptions = [
	{ title: "Все", value: "all" },
	{ title: "Отправлены на инструктажи", value: "sent_to_briefing" },
];

const WorkersPage = () => {
	const role = localStorage.getItem("role");
	const { setSearchParams, searchParamsObj, searchParams } =
		useCustomSearchParams();
	const [employeeList, setEmployeeList] = useState([]);
	const [employeeCount, setEmployeeCount] = useState(0);
	const [isEditFormShown, setIsEditFormShown] = useState(false);

	const memoCurrentTab = useMemo(
		() => searchParamsObj["filter"],
		[searchParamsObj]
	);

	const memoDefaultSearchValue = useMemo(
		() => searchParams.get("search"),
		[searchParams]
	);

	const memoIsClear = useMemo(
		() => !searchParams.get("search"),
		[searchParams]
	);

	const updateCurrentTab = useCallback(
		(tabTitle) => {
			if (tabTitle === memoCurrentTab) return;
			const newOption = tabsOptions.find((item) => item.title === tabTitle);
			setSearchParams({
				...searchParamsObj,
				search: "",
				filter: newOption.value,
				page: 1,
			});
		},
		[memoCurrentTab, searchParamsObj]
	);

	const updateEmployeeSearch = useCallback(
		(searchString) => {
			setSearchParams({
				...searchParamsObj,
				search: searchString,
			});
		},
		[searchParamsObj]
	);

	const getUsers = useCallback(async () => {
		try {
			const res = await usersService.getAllUsers(searchParams.toString());
			setEmployeeList(res.data.results);
			setEmployeeCount(res.data.count);
		} catch (e) {
			console.log(e);
		}
	}, [searchParams]);

	useEffect(() => {
		getUsers();
	}, [searchParamsObj]);

	return (
		<div className="sEmployee" id="sEmployee">
			{isEditFormShown && (
				<ModalWide
					header={"Создание пользователя"}
					setIsVisible={setIsEditFormShown}
				>
					<NewEmployeeForm
						closeFormHandle={() => setIsEditFormShown(false)}
						getUsers={getUsers}
					/>
				</ModalWide>
			)}
			<TitleWrapper title="Работники" />
			<div className="tabs">
				<Tabs
					value={memoCurrentTab}
					options={tabsOptions}
					cb={updateCurrentTab}
				/>
				<div className="tabs__content-wrap">
					<div className="tabs__content active">
						<div className="employee-block">
							<button
								className="create-user-button btn"
								onClick={() => setIsEditFormShown(true)}
							>
								<img src="/img/svg/plus-big.svg" alt="" />
								<div>Добавить карточку нового работника</div>
							</button>
							<SearchBlock
								placeholder="Найти работника"
								cb={updateEmployeeSearch}
								defaultValue={memoDefaultSearchValue}
								isClear={memoIsClear}
							/>
							{role === "security_manager" &&
								searchParamsObj.filter !== "sent_to_briefing" && (
									<div className="employee-block__list-menu">
										<NavLink
											to="/briefings/creator"
											className="employee-block__list-menu-link"
										>
											<svg className="icon icon-book ">
												<use href="/img/svg/sprite.svg#book" />
											</svg>
											<span>Направить на инструктаж</span>
										</NavLink>
									</div>
								)}
							<div className="employees-grid-list">
								<EmployeePageListMenu
									{...{
										employeeList,
										setSearchParams,
										searchParamsObj,
									}}
								/>
								<EmployeeList employeeList={employeeList} />
							</div>
							{employeeCount > 10 && <Pagination itemsTotal={employeeCount} />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(WorkersPage);
