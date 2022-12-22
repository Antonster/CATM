import { memo, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "react-use";
import Tooltip from "@mui/material/Tooltip";
import InfiniteScroll from "react-infinite-scroller";
import Avatar from "../../../ui/Avatar/Avatar";
import Dialog from "@mui/material/Dialog";
import { permitsActions } from "../../../store/actions";

const Team = ({
	selectedEmployees,
	onUpdateWorkers,
	setIsChangeWorkersModal,
}) => {
	const dispatch = useDispatch();
	const allEmployees = useSelector((state) => state.permits?.allEmployees);
	const [employees, setEmployees] = useState();
	const [filterQuery, setFilterQuery] = useState("");
	const [isLoading, setLoading] = useState(false);
	const [activePage, setActivePage] = useState(1);
	const [changingEmployees, setChangingEmployees] = useState({
		selected: undefined,
		all: undefined,
	});
	const [confirmationPopup, setConfirmationPopup] = useState(false);

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

	const onClosePopup = useCallback(() => {
		setChangingEmployees({
			selected: undefined,
			all: undefined,
		});
		setConfirmationPopup(false);
	}, []);

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

	const addSelectedEmployee = useCallback(
		(employee) => {
			if (employee.id === changingEmployees?.all?.id) {
				setChangingEmployees((prev) => ({
					...prev,
					all: undefined,
				}));
			}
			setEmployees((prev) => ({
				selected: [...prev.selected, employee].sort((a, b) =>
					a.last_name.localeCompare(b.last_name)
				),
				all: prev.all.filter((item) => item.id !== employee.id),
				added: prev?.added
					? [
							...prev.added,
							{
								new_worker: employee.id,
							},
					  ]
					: [
							{
								new_worker: employee.id,
							},
					  ],
			}));
		},
		[changingEmployees]
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
				added: prev.added.filter((item) => item.new_worker !== employee.id),
			}));
		},
		[filterQuery]
	);

	const changeSelectedEmployees = useCallback((employee, type) => {
		setChangingEmployees((prev) => ({
			...prev,
			[type]:
				!prev[type] || prev[type]?.id !== employee.id ? employee : undefined,
		}));
	}, []);

	const onConfirmChanging = useCallback(() => {
		setEmployees((prev) => ({
			selected: [
				...prev.selected.map((item) => {
					if (item.id === changingEmployees.selected.id) {
						return {
							...item,
							replacedBy: changingEmployees.all.id,
						};
					}
					return item;
				}),
				{
					...{
						...changingEmployees.all,
						replaced: changingEmployees.selected.id,
					},
					blocked: true,
				},
			].sort((a, b) => a.last_name.localeCompare(b.last_name)),
			all: prev.all.filter((item) => item.id !== changingEmployees.all.id),
			added: prev?.added
				? [
						...prev.added,
						{
							old_user_briefing: changingEmployees.selected.old_user_briefing,
							new_worker: changingEmployees.all.id,
						},
				  ]
				: [
						{
							old_user_briefing: changingEmployees.selected.old_user_briefing,
							new_worker: changingEmployees.all.id,
						},
				  ],
		}));
		onClosePopup();
	}, [changingEmployees, onClosePopup]);

	useEffect(() => {
		if (changingEmployees.selected && changingEmployees.all) {
			setConfirmationPopup(true);
		}
	}, [changingEmployees]);

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
				selected: selectedEmployees
					.map(({ user, replacement_at, replacement_to, id }) => ({
						id: user.id,
						avatar: user.avatar,
						first_name: user.first_name,
						last_name: user.last_name,
						position: user.position,
						is_ready: user.is_ready,
						blocked: true,
						replacement_at,
						replacement_to,
						replacedBy: undefined,
						old_user_briefing: id,
					}))
					.sort((a, b) => a.last_name.localeCompare(b.last_name)),
				all: allEmployees.results.filter(
					(item) => !selectedEmployees.find(({ user }) => user.id === item.id)
				),
			});

			setLoading(false);
		}
	}, [allEmployees]);

	useEffect(() => {
		return () => {
			dispatch(permitsActions.setEmployees());
		};
	}, []);

	return (
		<div className="sNewPermit__brigade permit-info-brigade">
			<Dialog onClose={onClosePopup} open={confirmationPopup}>
				<div className="sNewPermit-popup">
					<div className="sNewPermit-popup__title">Заменить работника?</div>
					<button className="btn btn-primary" onClick={onConfirmChanging}>
						Заменить
					</button>
					<button className="btn btn-outline-primary" onClick={onClosePopup}>
						Отмена
					</button>
				</div>
			</Dialog>
			<div className="sNewPermit__brigade-body">
				<div className="sNewPermit__brigade-squad">
					<h2>Состав бригады</h2>
					<div className="sNewPermit__brigade-squad-wrapper changing-without-input">
						{employees?.selected?.map((employee, index) => (
							<div className="employee-permit" key={employee.id + "-" + index}>
								<div
									className={`employee-permit__wrapper ${
										employee.replacedBy || employee.replacement_to
											? "disabled-wrapper"
											: ""
									} ${
										employee.id === changingEmployees?.selected?.id
											? "active"
											: ""
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
									{employee.blocked && (
										<button
											className="employee-permit__delete-btn btn btn-outline-primary"
											onClick={() =>
												changeSelectedEmployees(employee, "selected")
											}
											disabled={
												employee.replacedBy ||
												employee.replaced ||
												employee.replacement_to
											}
										>
											<svg className="icon icon-btn-renew">
												<use href="/img/svg/sprite.svg#btn-renew"></use>
											</svg>
										</button>
									)}
									{!employee.blocked && !employee.replacedBy && (
										<button
											className="employee-permit__delete-btn btn btn-outline-primary"
											onClick={() => removeSelectedEmployee(employee)}
										>
											<svg className="icon icon-btn-minus">
												<use href="/img/svg/sprite.svg#btn-minus"></use>
											</svg>
										</button>
									)}
								</div>
							</div>
						))}
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
					<div className="sNewPermit__brigade-squad-wrapper with-changing">
						{employees && (
							<InfiniteScroll
								loadMore={addItems}
								hasMore={!!allEmployees?.next && !isLoading}
								pageStart={1}
								initialLoad={false}
								useWindow={false}
							>
								{employees?.all?.map((employee, index) => (
									<div
										className="employee-permit"
										key={employee.id + "-" + index}
									>
										<div
											className={`employee-permit__wrapper ${
												!employee.is_ready ? "disabled-wrapper" : ""
											} ${
												employee.id === changingEmployees?.all?.id
													? "active"
													: ""
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
												className="employee-permit__plus-btn btn btn-primary"
												onClick={() => addSelectedEmployee(employee)}
												disabled={!employee.is_ready}
											>
												<svg className="icon icon-btn-plus ">
													<use href="/img/svg/sprite.svg#btn-plus"></use>
												</svg>
											</button>
											<button
												className="employee-permit__delete-btn btn btn-outline-primary"
												onClick={() => changeSelectedEmployees(employee, "all")}
												disabled={!employee.is_ready}
											>
												<svg className="icon icon-btn-renew">
													<use href="/img/svg/sprite.svg#btn-renew"></use>
												</svg>
											</button>
										</div>
									</div>
								))}
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
			<div className="special-menu__footer">
				<button
					className="btn btn-outline-primary"
					onClick={() => setIsChangeWorkersModal(false)}
				>
					Отмена
				</button>
				<button
					className="btn btn-primary"
					onClick={() => onUpdateWorkers({ brigade: employees.added })}
					disabled={!employees}
				>
					Сохранить
				</button>
			</div>
		</div>
	);
};

export default memo(Team);
