import {
	memo,
	useEffect,
	useState,
	useContext,
	useCallback,
	useMemo,
} from "react";
import Tabs from "../../../../ui/Tabs/Tabs";
import MainTab from "./MainTab";
import HazardsTab from "./HazardsTab";
import EquipmentTab from "./EquipmentTab";
import SchemeTab from "./SchemeTab";
import TeamTab from "./TeamTab";
import BriefingTab from "./BriefingTab";
import ApprovalsTab from "./ApprovalsTab";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ScrollContext } from "../../../../ui/ModalWide/ModalWide";
import permitsService from "../../../../services/permits.service";

const PermitForm = ({
	setIsCreateModalVisible,
	workType,
	workTypes,
	organization,
}) => {
	const handleScrollTop = useContext(ScrollContext);
	const [isLoading, setIsLoading] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const [startDateError, setStartDateError] = useState(false);
	const [expirationDateError, setExpirationDateError] = useState(false);
	const [options, setOptions] = useState([]);
	const [everyoneExceptEmployees, setEveryoneExceptEmployees] = useState([]);
	const [responsibleManagers, setResponsibleManagers] = useState([]);
	const [employees, setEmployees] = useState();
	const [file, setFile] = useState({});
	const currentUser = useSelector((state) => state.currentUser?.user);

	const [tabStatus, setTabStatus] = useState({
		main: false,
		hazards: true,
		equipment: true,
		scheme: true,
		team: true,
		briefing: true,
		approvals: true,
	});

	const tabsOptions = useMemo(
		() => [
			{
				title: "Основное",
				value: "main",
				nextValue: "hazards",
				component: MainTab,
				disabled: tabStatus.main,
				fields: [
					"organization",
					"work_type",
					"place",
					"start_time",
					"expiration_time",
					"responsible_executor",
					"permit_issuer",
					"permit_acceptor",
				],
			},
			{
				title: "Опасные факторы",
				value: "hazards",
				nextValue: "equipment",
				component: HazardsTab,
				disabled: tabStatus.hazards,
				fields: ["dangerous_factors", "another_factors"],
			},
			{
				title: "Оборудование",
				value: "equipment",
				nextValue: "scheme",
				component: EquipmentTab,
				disabled: tabStatus.equipment,
				fields: ["save_equipment", "used_equipment"],
			},
			{
				title: "Схема проведения работ",
				value: "scheme",
				nextValue: "team",
				component: SchemeTab,
				disabled: tabStatus.scheme,
				fields: ["work_scheme"],
			},
			{
				title: "Бригада",
				value: "team",
				nextValue: "briefing",
				component: TeamTab,
				disabled: tabStatus.team,
				fields: ["workers"],
			},
			{
				title: "Инструктаж",
				value: "briefing",
				nextValue: "approvals",
				component: BriefingTab,
				disabled: tabStatus.briefing,
				fields: ["briefing_file"],
			},
			{
				title: "Согласования",
				value: "approvals",
				nextValue: null,
				component: ApprovalsTab,
				disabled: tabStatus.approvals,
				fields: [
					"manager_executor",
					"admitting_person",
					"work_safety_officer",
					"industry_safety_officer",
					"permit_approver",
				],
			},
		],
		[tabStatus]
	);

	const {
		register,
		setValue,
		handleSubmit,
		getValues,
		formState: { errors },
		reset,
		control,
		watch,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			organization: organization,
			place: "",
			work_type: workType || "",
			status: "",
			briefing_file: "",
			start_date: "",
			start_time: "",
			expiration_date: "",
			expiration_time: "",
			dangerous_factors: [],
			another_factors: [],
			save_equipment: [],
			used_equipment: [],
			work_scheme: [],
			workers: [],
			responsible_executor: "",
			responsible_manager: currentUser.id,
			permit_issuer: "",
			permit_acceptor: "",
			manager_executor: "",
			admitting_person: "",
			work_safety_officer: "",
			industry_safety_officer: "",
			permit_approver: "",
		},
	});

	const watchFields = watch();

	const onSubmit = useCallback(
		async (fData) => {
			const data = new FormData();
			for (const key in fData) {
				if (key === "expiration_time") {
					const [day, month, year] = fData["expiration_date"].split(".");
					const [hour = 0, minute = 0, second = 0] =
						fData["expiration_time"].split(":");
					const expirationDate = new Date(
						year,
						+month - 1,
						day,
						hour,
						minute,
						second
					);
					const utcExpirationDate = new Date(
						expirationDate.setUTCHours(hour, minute, second)
					);
					data.append(key, utcExpirationDate.toISOString());
				} else if (key === "start_time") {
					const [day, month, year] = fData["start_date"].split(".");
					const [hour = 0, minute = 0, second = 0] =
						fData["start_time"].split(":");
					const startDate = new Date(
						year,
						+month - 1,
						day,
						hour,
						minute,
						second
					);
					const utcStartDate = new Date(
						startDate.setUTCHours(hour, minute, second)
					);
					data.append(key, utcStartDate.toISOString());
				} else {
					if (typeof fData[key] === "object" && key !== "briefing_file") {
						fData[key].forEach((item) => {
							data.append(key, Number(item));
						});
					} else {
						data.append(key, fData[key]);
					}
				}
			}

			await permitsService.setWorkPermits(data).then(() => {
				reset();
				window.location = "/work-permits";
			});
		},
		[reset]
	);

	const [currentTab, setCurrentTab] = useState(tabsOptions[0]);

	const updateCurrentTab = useCallback(
		(tabTitle) => {
			const newOption = tabsOptions.find((item) => item.title === tabTitle);
			newOption.disabled || setCurrentTab(newOption);
		},
		[tabsOptions]
	);

	const nextTab = useCallback(
		(e) => {
			e.preventDefault();
			setIsValid(false);
			const newOption = tabsOptions.find(
				(item) => item.value === currentTab.nextValue
			);
			setTabStatus((prev) => ({
				...prev,
				[currentTab.nextValue]: false,
			}));

			setCurrentTab(newOption);
		},
		[currentTab, tabsOptions]
	);

	const updateForm = useCallback(() => {
		const [startDay, startMonth, startYear] =
			watchFields["start_date"].split(".");
		const [startHour = 0, startMinute = 0, startSecond = 0] =
			watchFields["start_time"].split(":");
		const startDate = new Date(
			startYear,
			+startMonth - 1,
			startDay,
			startHour,
			startMinute,
			startSecond
		);
		const [expirationDay, expirationMonth, expirationYear] =
			watchFields["expiration_date"].split(".");
		const [expirationHour = 0, expirationMinute = 0, expirationSecond = 0] =
			watchFields["expiration_time"].split(":");
		const expirationDate = new Date(
			expirationYear,
			+expirationMonth - 1,
			expirationDay,
			expirationHour,
			expirationMinute,
			expirationSecond
		);

		setIsValid(false);
		for (let i = 0; i < currentTab.fields.length; i++) {
			if (currentTab.fields[i] === "start_time") {
				if (Date.now() > startDate) {
					setStartDateError("Можно создать только на будущий период");
					setIsValid(false);
					break;
				}
				if (!(startDate - 0)) {
					setStartDateError(false);
					setIsValid(false);
					break;
				}
			}
			if (currentTab.fields[i] === "expiration_time") {
				if (startDate > expirationDate) {
					setExpirationDateError("Дата истечения раньше даты начала");
					setIsValid(false);
					break;
				}
				if (Date.now() > expirationDate) {
					setExpirationDateError("Можно создать только на будущий период");
					setIsValid(false);
					break;
				}
				if (!(expirationDate - 0)) {
					setExpirationDateError(false);
					setIsValid(false);
					break;
				}
			}
			if (currentTab.fields[i] === "briefing_file") {
				if (getValues("briefing_file")) {
					setIsValid(true);
					break;
				} else {
					setIsValid(false);
					continue;
				}
			}
			if (typeof getValues(currentTab.fields[i]) === "object") {
				if (Object.keys(getValues(currentTab.fields[i])).length) {
					setIsValid(true);
					break;
				} else {
					setIsValid(false);
					continue;
				}
			} else {
				if (!getValues(currentTab.fields[i])) {
					setIsValid(false);
					break;
				}
			}
			setStartDateError(false);
			setIsValid(true);
		}
	}, [currentTab, getValues, watchFields]);

	useEffect(() => {
		handleScrollTop();
		updateForm();
	}, [currentTab]);

	useEffect(() => {
		updateForm();
	}, [watchFields]);

	useEffect(() => {
		const errs = Object.keys(errors).filter((v, i, a) => a.indexOf(v) === i);
		errs.forEach((err) => {
			tabsOptions.forEach((tab) => {
				if (tab.fields.includes(err)) {
					return () => {
						setTabStatus((prev) => ({
							...prev,
							[tab.nextValue]: true,
						}));
					};
				}
			});
		});
	}, [Object.keys(errors).length]);

	useEffect(() => {
		setIsLoading(true);
		let isMounted = true;
		const getOptions = async () => {
			try {
				const res = await permitsService.getOptions();
				if (isMounted) setOptions(res.data);
			} catch (e) {
				console.log(e);
			}
		};
		getOptions();
		setIsLoading(false);
		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		setIsLoading(true);
		let isMounted = true;
		const getEveryoneExceptEmployees = async () => {
			try {
				const res = await permitsService.getEveryoneExceptEmployees();
				if (isMounted) {
					setEveryoneExceptEmployees(
						res.data.results.map((everyone) => {
							return {
								id: everyone.id,
								title: everyone.last_name + " " + everyone.first_name,
							};
						})
					);
				}
			} catch (e) {
				console.log(e);
			}
		};
		getEveryoneExceptEmployees();
		setIsLoading(false);
		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		setIsLoading(true);
		let isMounted = true;
		const getResponsibleManagers = async () => {
			try {
				const res = await permitsService.getResponsibleManagers();
				if (isMounted)
					setResponsibleManagers(
						res.data.results.map((everyone) => {
							return {
								id: everyone.id,
								title: everyone.last_name + " " + everyone.first_name,
							};
						})
					);
			} catch (e) {
				console.log(e);
			}
		};
		getResponsibleManagers();
		setIsLoading(false);
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit)}
				onKeyPress={(e) => {
					e.key === "Enter" && e.preventDefault();
				}}
			>
				<Tabs
					value={currentTab.value}
					options={tabsOptions}
					cb={updateCurrentTab}
				/>
				<div className="tabs-content-wrap">
					{!isLoading && (
						<>
							<currentTab.component
								{...{
									register,
									setValue,
									getValues,
									dangerousFactors: options.dangerous_factors,
									anotherFactors: options.another_factors,
									saveEquipment: options.save_equipment,
									usedEquipment: options.used_equipment,
									workScheme: options.work_scheme,
									employees,
									setEmployees,
									setIsValid,
									everyoneExceptEmployees,
									workTypes,
									responsibleManagers,
									file,
									setFile,
									control,
									startDateError,
									expirationDateError,
								}}
							/>
							<div className="special-menu__footer">
								<button
									className="btn btn-outline-primary"
									onClick={() => setIsCreateModalVisible(false)}
								>
									Отмена
								</button>
								{currentTab.nextValue && (
									<button
										className="btn btn-primary"
										onClick={(e) => nextTab(e)}
										disabled={!isValid}
									>
										Далее
									</button>
								)}
								{!currentTab.nextValue && (
									<input
										className="btn btn-primary create-permit-input"
										type="submit"
										value="Создать наряд-допуск"
										disabled={!isValid}
									/>
								)}
							</div>
						</>
					)}
				</div>
			</form>
		</>
	);
};

export default memo(PermitForm);
