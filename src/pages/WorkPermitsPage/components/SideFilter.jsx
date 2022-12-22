import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Select from "react-select";
import permitsService from "../../../services/permits.service";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import {
	DropdownIndicator,
	selectStyles,
} from "../../../ui/SelectTemplate/SelectTemplate";

registerLocale("ru", ru);

const SideFilter = ({ searchParamsObj, setSearchParams }) => {
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [workTypes, setWorkTypes] = useState([]);
	const [responsibleManagers, setResponsibleManagers] = useState([]);

	const typesOptions = useMemo(
		() =>
			workTypes.find(
				({ value: val }) => val === +searchParamsObj.work_type_id
			) || "",
		[searchParamsObj.work_type_id, workTypes]
	);

	const responsibleManagersOptions = useMemo(
		() =>
			responsibleManagers.find(
				({ value: val }) => val === +searchParamsObj.responsible_manager_id
			) || "",
		[responsibleManagers, searchParamsObj.responsible_manager_id]
	);

	const onUpdateFilters = useCallback(
		(type, value) => {
			setSearchParams({
				...searchParamsObj,
				[type]: value,
			});
		},
		[searchParamsObj, setSearchParams]
	);

	const onResetFilters = useCallback(() => {
		setStartDate(null);
		setEndDate(null);
		setSearchParams({});
	}, [setSearchParams]);

	const onChangeDate = useCallback(
		(dates) => {
			const [start, end] = dates;
			setStartDate(start);
			setEndDate(end);
			if (start && end) {
				setSearchParams({
					...searchParamsObj,
					created_after: format(start, "yyyy-MM-dd"),
					created_before: format(end, "yyyy-MM-dd"),
				});
			}
		},
		[searchParamsObj, setSearchParams]
	);

	const onChangeType = useCallback(
		({ value }) => onUpdateFilters("work_type_id", value),
		[onUpdateFilters]
	);

	const onChangeResponsibleManager = useCallback(
		({ value }) => onUpdateFilters("responsible_manager_id", value),
		[onUpdateFilters]
	);

	useEffect(() => {
		const getWorkTypes = async () => {
			try {
				const res = await permitsService.getWorkTypes();
				setWorkTypes(
					res.data.map(({ title, id }) => ({ label: title, value: id }))
				);
			} catch (e) {
				console.log(e);
			}
		};
		getWorkTypes();
	}, []);

	useEffect(() => {
		const getResponsibleManagers = async () => {
			try {
				const res = await permitsService.getResponsibleManagers();
				setResponsibleManagers(
					res.data.results.map(({ last_name, first_name, id }) => ({
						label: `${last_name} ${first_name}`,
						value: id,
					}))
				);
			} catch (e) {
				console.log(e);
			}
		};
		getResponsibleManagers();
	}, []);

	useEffect(() => {
		if (searchParamsObj.created_after && searchParamsObj.created_before) {
			setStartDate(new Date(searchParamsObj.created_after));
			setEndDate(new Date(searchParamsObj.created_before));
		}
	}, []);

	return (
		<div className="sIndex__filter">
			<div className="index-filter-block">
				<div className="index-filter-block__head">
					<div className="index-filter-block__title">Фильтр</div>
					<div className="index-filter-block__reset" onClick={onResetFilters}>
						Сбросить
					</div>
				</div>
				<div className="form-wrap">
					<form>
						<div className="form-wrap__input-wrap form-group">
							<label>
								<span className="form-wrap__input-title">Период создания</span>
								<DatePicker
									selectsRange
									className={"date-block__input"}
									onChange={onChangeDate}
									startDate={startDate}
									endDate={endDate}
									monthsShown={2}
									dateFormat="dd.MM.yyyy"
									placeholderText="Выберите дату"
									calendarClassName={"date-block-calendar"}
									locale="ru"
									disabledKeyboardNavigation
								/>
							</label>
						</div>
						<div className="form-wrap__input-wrap">
							<div className="form-wrap__input-title">Тип работ</div>
							<Select
								components={{ DropdownIndicator }}
								styles={selectStyles}
								placeholder="Выберите"
								menuPlacement="auto"
								value={typesOptions}
								onChange={onChangeType}
								options={workTypes}
								isSearchable={false}
							/>
						</div>
						<div className="form-wrap__input-wrap">
							<div className="form-wrap__input-title">
								Ответственный руководитель
							</div>
							<Select
								components={{ DropdownIndicator }}
								styles={selectStyles}
								placeholder="Выберите"
								menuPlacement="auto"
								value={responsibleManagersOptions}
								onChange={onChangeResponsibleManager}
								options={responsibleManagers}
								isSearchable={false}
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default memo(SideFilter);
