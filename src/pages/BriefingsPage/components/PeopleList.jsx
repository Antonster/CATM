import { memo, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "react-use";
import InfiniteScroll from "react-infinite-scroller";
import Avatar from "../../../ui/Avatar/Avatar";
import { briefingsActions } from "../../../store/actions";
import PeopleFooterPanel from "./PeopleFooterPanel";

const PeopleList = ({ briefingId, setPeopleModal, setConfirmationDialog }) => {
	const dispatch = useDispatch();
	const allUsers = useSelector((state) => state.briefings?.allUsers);
	const briefingUsers = useSelector((state) => state.briefings?.briefingUsers);
	const [selectedFilter, setSelectedFilter] = useState("");
	const [filterQuery, setFilterQuery] = useState("");
	const [isLoading, setLoading] = useState(false);
	const [employees, setEmployees] = useState();
	const [activePage, setActivePage] = useState(1);

	const addSelectedEmployee = useCallback(
		(employee) => {
			setEmployees((prev) => ({
				selected: [...prev.selected, employee],
				selectedFiltered: [...prev.selected, employee]
					.filter(
						(item) =>
							item.last_name
								.toLowerCase()
								.includes(selectedFilter.toLowerCase()) ||
							item.first_name
								.toLowerCase()
								.includes(selectedFilter.toLowerCase())
					)
					.sort((a, b) => a.last_name.localeCompare(b.last_name)),
				all: prev.all.filter((item) => item.id !== employee.id),
			}));
		},
		[selectedFilter]
	);

	const removeSelectedEmployee = useCallback(
		(employee) => {
			setEmployees((prev) => ({
				selected: prev.selected.filter((item) => item.id !== employee.id),
				selectedFiltered: prev.selected
					.filter((item) => item.id !== employee.id)
					.filter(
						(item) =>
							item.last_name
								.toLowerCase()
								.includes(selectedFilter.toLowerCase()) ||
							item.first_name
								.toLowerCase()
								.includes(selectedFilter.toLowerCase())
					)
					.sort((a, b) => a.last_name.localeCompare(b.last_name)),
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
		[filterQuery, selectedFilter]
	);

	const [, cancel] = useDebounce(
		() => {
			setActivePage(1);
			dispatch(
				briefingsActions.fetchAllUsers(
					`page=1&pagesize=20&search=${filterQuery}`
				)
			);
		},
		1000,
		[filterQuery]
	);

	const addItems = useCallback(() => {
		if (!!allUsers?.next && !isLoading) {
			setLoading(true);
			const nextPage = activePage + 1;

			dispatch(
				briefingsActions.fetchMoreUsers(
					`page=${nextPage}&pagesize=20&search=${filterQuery}`
				)
			);
			setActivePage((prev) => prev + 1);
		}
	}, [activePage, allUsers, dispatch, filterQuery, isLoading]);

	useEffect(() => {
		if (allUsers?.next && !isLoading && employees?.all?.length < 10) {
			addItems();
		}
	}, [employees]);

	useEffect(() => {
		if (employees) {
			setEmployees((prev) => ({
				...prev,
				selectedFiltered: prev.selected.filter(
					(item) =>
						item.last_name
							.toLowerCase()
							.includes(selectedFilter.toLowerCase()) ||
						item.first_name.toLowerCase().includes(selectedFilter.toLowerCase())
				),
			}));
		}
	}, [selectedFilter]);

	useEffect(() => {
		if (allUsers && employees) {
			setEmployees((prev) => ({
				...prev,
				all: allUsers.results.filter(
					(item) => !prev.selected.find(({ id }) => id === item.id)
				),
			}));

			setLoading(false);
		}
		if (allUsers && !employees) {
			setEmployees({
				selected: briefingUsers
					.map(({ user }) => ({
						id: user.id,
						avatar: user.avatar,
						first_name: user.first_name,
						last_name: user.last_name,
						position: user.position,
					}))
					.sort((a, b) => a.last_name.localeCompare(b.last_name)),
				selectedFiltered: briefingUsers
					.map(({ user }) => ({
						id: user.id,
						avatar: user.avatar,
						first_name: user.first_name,
						last_name: user.last_name,
						position: user.position,
					}))
					.sort((a, b) => a.last_name.localeCompare(b.last_name)),
				all: allUsers.results
					.filter(
						(item) => !briefingUsers.find(({ user }) => user.id === item.id)
					)
					.sort((a, b) => a.last_name.localeCompare(b.last_name)),
			});

			setLoading(false);
		}
	}, [allUsers]);

	useEffect(() => {
		return () => dispatch(briefingsActions.setAllUsers());
	}, []);

	return (
		<div className="sNewPermit__brigade briefing-brigade">
			<div className="sNewPermit__brigade-body">
				<div className="sNewPermit__brigade-squad">
					<h2>Направленные</h2>
					<div className="search-block form-wrap__input-wrap form-group">
						<label>
							<input
								className="search-block__search form-wrap__input form-control"
								placeholder="Искать"
								type="text"
								onChange={(event) => setSelectedFilter(event.target.value)}
							/>
							<button className="search-block__search-btn" type="button" />
						</label>
					</div>
					<div className="check-all"></div>
					<div className="sNewPermit__brigade-squad-wrapper">
						{employees?.selectedFiltered?.map((employee, index) => {
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
					<div
						className="check-all"
						onClick={() => setConfirmationDialog(true)}
					>
						← Выбрать всех
					</div>
					<div className="sNewPermit__brigade-squad-wrapper">
						{employees && (
							<InfiniteScroll
								loadMore={addItems}
								hasMore={!!allUsers?.next && !isLoading}
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
												<button
													className="employee-permit__plus-btn btn btn-primary"
													onClick={() => addSelectedEmployee(employee)}
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
			<PeopleFooterPanel
				{...{
					employees,
					briefingId,
					setPeopleModal,
				}}
			/>
		</div>
	);
};

export default memo(PeopleList);
