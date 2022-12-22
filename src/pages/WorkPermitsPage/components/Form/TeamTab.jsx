import { memo, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import { useDebounce } from "react-use";
import InfiniteScroll from "react-infinite-scroller";
import Avatar from "../../../../ui/Avatar/Avatar";
import { permitsActions } from "../../../../store/actions";

const TeamTab = ({ employees, setEmployees, setIsValid, setValue }) => {
	const dispatch = useDispatch();
	const allEmployees = useSelector((state) => state.permits?.allEmployees);
	const [filterQuery, setFilterQuery] = useState("");
	const [isLoading, setLoading] = useState(false);
	const [activePage, setActivePage] = useState(1);

	const addSelectedEmployee = useCallback(
		(employee) => {
			setEmployees((prev) => ({
				selected: [...prev.selected, employee].sort((a, b) =>
					a.last_name.localeCompare(b.last_name)
				),
				all: prev.all.filter((item) => item.id !== employee.id),
			}));
		},
		[setEmployees]
	);

	const removeSelectedEmployee = useCallback(
		(employee) => {
			setEmployees((prev) => ({
				selected: prev.selected.filter((item) => item.id !== employee.id),
				all: [...prev.all, employee]
					.filter(
						(item) =>
							item.last_name
								.toLowerCase()
								.includes(filterQuery.toLowerCase()) ||
							item.first_name.toLowerCase().includes(filterQuery.toLowerCase())
					)
					.sort((a, b) => a.last_name.localeCompare(b.last_name)),
			}));
		},
		[filterQuery, setEmployees]
	);

	const [, cancel] = useDebounce(
		() => {
			setActivePage(1);
			dispatch(
				permitsActions.fetchEmployees(
					`page=1&pagesize=20&search=${filterQuery}`
				)
			);
		},
		1000,
		[filterQuery]
	);

	const addItems = useCallback(() => {
		if (!!allEmployees?.next && !isLoading) {
			setLoading(true);
			const nextPage = activePage + 1;

			dispatch(
				permitsActions.fetchMoreEmployees(
					`page=${nextPage}&pagesize=20&search=${filterQuery}`
				)
			);
			setActivePage((prev) => prev + 1);
		}
	}, [activePage, allEmployees, dispatch, filterQuery, isLoading]);

	useEffect(() => {
		if (allEmployees?.next && !isLoading && employees?.all?.length < 10) {
			addItems();
		}
	}, [employees]);

	useEffect(() => {
		if (allEmployees && employees) {
			setEmployees((prev) => ({
				...prev,
				all: allEmployees.results.filter(
					(item) => !prev.selected.find(({ id }) => id === item.id)
				),
			}));

			setLoading(false);
		}
		if (allEmployees && !employees) {
			setEmployees({
				selected: [],
				all: allEmployees.results,
			});

			setLoading(false);
		}
	}, [allEmployees]);

	useEffect(() => {
		if (employees?.selected?.length) {
			setIsValid(true);
			setValue(
				"workers",
				employees.selected.map((employee) => employee.id)
			);
		} else {
			setIsValid(false);
			setValue("workers", []);
		}
	}, [employees]);

	useEffect(() => {
		return () => {
			dispatch(permitsActions.setEmployees());
			setEmployees((prev) => ({
				...prev,
				all: [],
			}));
		};
	}, []);

	return (
		<div className="sNewPermit__brigade permit-brigade">
			<div className="sNewPermit__brigade-body">
				<div className="sNewPermit__brigade-squad">
					<h2>Состав бригады</h2>
					<div className="sNewPermit__brigade-squad-wrapper without-input">
						{employees?.selected?.map((employee, index) => {
							return (
								<div
									className="employee-permit"
									key={employee.id + "-" + index}
								>
									<div className={`employee-permit__wrapper`}>
										<Avatar
											firstName={employee.first_name}
											lastName={employee.last_name}
											image={employee.avatar}
											size={"medium"}
										/>
										<div className="employee-permit__info">
											<div className="employee-permit__name">
												{employee.last_name + " " + employee.first_name}
											</div>
											<div className="employee-permit__job">
												{employee.position}
											</div>
										</div>
										<div className="employee-permit__health">
											<Tooltip
												arrow
												placement="top-start"
												title={
													employee.is_ready ? (
														<div className="employee-permit__health-tooltip">
															Медосмотр, Инструктажи, Обучение пройдено
														</div>
													) : (
														<div className="employee-permit__health-tooltip">
															Медосмотр, Инструктаж, Обучение не действительны
														</div>
													)
												}
											>
												{employee.is_ready ? (
													<img src="/img/svg/ok.svg" alt="" />
												) : (
													<img src="/img/svg/cancel.svg" alt="" />
												)}
											</Tooltip>
										</div>
										<button
											className="employee-permit__delete-btn btn btn-outline-primary"
											onClick={() => removeSelectedEmployee(employee)}
										>
											<svg className="icon icon-btn-minus">
												<use href="/img/svg/sprite.svg#btn-minus"></use>
											</svg>
										</button>
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<div className="sNewPermit__all-emp">
					<h2>Все работники</h2>
					<div className="search-block form-wrap__input-wrap form-group">
						<label>
							<input
								className="search-block__search form-wrap__input form-control"
								placeholder="Искать"
								type="text"
								onChange={(event) => setFilterQuery(event.target.value)}
							/>
							<button className="search-block__search-btn" type="button" />
						</label>
					</div>
					<div className="sNewPermit__brigade-squad-wrapper">
						{employees && (
							<InfiniteScroll
								loadMore={addItems}
								hasMore={!!allEmployees?.next && !isLoading}
								pageStart={1}
								initialLoad={false}
								useWindow={false}
							>
								{employees?.all?.map((employee, index) => {
									return (
										<div
											className="employee-permit"
											key={employee.id + "-" + index}
										>
											<div
												className={`employee-permit__wrapper ${
													!employee.is_ready ? "disabled-wrapper" : ""
												}`}
											>
												<Avatar
													firstName={employee.first_name}
													lastName={employee.last_name}
													image={employee.avatar}
													size={"medium"}
												/>
												<div className="employee-permit__info">
													<div className="employee-permit__name">
														{employee.last_name + " " + employee.first_name}
													</div>
													<div className="employee-permit__job">
														{employee.position}
													</div>
												</div>
												<div className="employee-permit__health">
													<Tooltip
														arrow
														placement="top-start"
														title={
															employee.is_ready ? (
																<div className="employee-permit__health-tooltip">
																	Медосмотр, Инструктажи, Обучение пройдено
																</div>
															) : (
																<div className="employee-permit__health-tooltip">
																	Медосмотр, Инструктаж, Обучение не
																	действительны
																</div>
															)
														}
													>
														{employee.is_ready ? (
															<img src="/img/svg/ok.svg" alt="" />
														) : (
															<img src="/img/svg/cancel.svg" alt="" />
														)}
													</Tooltip>
												</div>
												<button
													className="employee-permit__plus-btn btn btn-primary"
													onClick={() => addSelectedEmployee(employee)}
													disabled={!employee.is_ready}
												>
													<svg className="icon icon-btn-plus ">
														<use href="/img/svg/sprite.svg#btn-plus"></use>
													</svg>
												</button>
											</div>
										</div>
									);
								})}
								{isLoading && (
									<div key="loader" className="loader">
										Загрузка...
									</div>
								)}
							</InfiniteScroll>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(TeamTab);
