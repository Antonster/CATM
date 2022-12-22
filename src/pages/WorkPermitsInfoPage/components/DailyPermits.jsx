import { memo, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import CustomSelect from "../../../ui/CustomSelect/CustomSelect";
import { permitsActions } from "../../../store/actions";
import DailyPermitItem from "./DailyPermitItem";

const DailyPermits = ({
	workPermitInfo,
	createDailyPermit,
	removeDailyPermit,
	signDailyPermit,
	closeDailyPermit,
	daily_permits,
}) => {
	const [startDay, startMonth, startYear] =
		workPermitInfo?.work_permit?.start_date?.split(".");
	const [startHour = 0, startMinute = 0, startSecond = 0] =
		workPermitInfo?.work_permit?.start_time?.split(":");
	const [endDay, endMonth, endYear] =
		workPermitInfo?.work_permit?.expiration_date?.split(".");
	const [endHour = 0, endMinute = 0, endSecond = 0] =
		workPermitInfo?.work_permit?.expiration_time?.split(":");
	const dispatch = useDispatch();
	const everyoneExceptEmployees = useSelector(
		(state) => state.permits?.everyoneExceptEmployees
	);
	const [isValid, setValid] = useState(false);
	const [startDateError, setStartDateError] = useState(false);
	const { register, handleSubmit, getValues, control, watch, reset } = useForm({
		mode: "onChange",
		defaultValues: {
			start_date: "",
			start_time: "",
			permitter: "",
		},
	});
	const watchFields = watch();

	const onSubmit = useCallback(
		async (fData) => {
			const data = new FormData();
			const [day, month, year] = fData["start_date"].split(".");
			const [hour = 0, minute = 0, second = 0] = fData["start_time"].split(":");
			const startDate = new Date(year, +month - 1, day, hour, minute, second);
			const utcStartDate = new Date(
				startDate.setUTCHours(hour, minute, second)
			);
			data.append("date_start", utcStartDate.toISOString());
			data.append("permitter", fData["permitter"]);

			createDailyPermit(data);
			reset({ start_date: "", start_time: "", permitter: "" });
		},
		[createDailyPermit, reset]
	);

	useEffect(() => {
		const [day, month, year] = watchFields["start_date"].split(".");
		const [hour = 0, minute = 0, second = 0] =
			watchFields["start_time"].split(":");
		const startDate = new Date(
			startYear,
			+startMonth - 1,
			startDay,
			startHour,
			startMinute,
			startSecond
		);
		const endDate = new Date(
			endYear,
			+endMonth - 1,
			endDay,
			endHour,
			endMinute,
			endSecond
		);
		const permitDate = new Date(year, +month - 1, day, hour, minute, second);

		for (const key in watchFields) {
			if (key === "start_date") {
				if (permitDate <= startDate || permitDate >= endDate) {
					setStartDateError(
						"Должна быть в рамках периода работы по наряд-допуску"
					);
					setValid(false);
					break;
				}
				if (
					daily_permits.find(
						({ date_start }) => date_start.split(" ")[0] === watchFields[key]
					)
				) {
					setStartDateError(
						"Ежедневный допуск для указанной даты уже существует"
					);
					setValid(false);
					break;
				}
				if (!(permitDate - 0)) {
					setStartDateError(false);
					setValid(false);
					break;
				}
			} else if (!watchFields[key]) {
				setValid(false);
				break;
			} else {
				setStartDateError(false);
				setValid(true);
			}
		}
	}, [watchFields]);

	useEffect(() => {
		if (!everyoneExceptEmployees) {
			dispatch(permitsActions.fetchEveryoneExceptEmployees());
		}
	}, [everyoneExceptEmployees]);

	return (
		<div className="special-menu__new-allowance-wrapper">
			<div className="special-menu__new-allowance">
				<h2>Новый допуск</h2>
				<div className="form-wrap">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="form-wrap__input-wrap form-group">
							<div className="sWorkPermitCard__status-text inner">
								<div className="title">Начало работ:</div>
								<div className="caption">
									<div className="caption-date">
										{workPermitInfo?.work_permit?.start_date}
									</div>
									<div className="caption-time">
										{workPermitInfo?.work_permit?.start_time}
									</div>
								</div>
							</div>
							<div className="sWorkPermitCard__status-text inner">
								<div className="title">Окончание работ:</div>
								<div className="caption">
									<div className="caption-date">
										{workPermitInfo?.work_permit?.expiration_date}
									</div>
									<div className="caption-time">
										{workPermitInfo?.work_permit?.expiration_time}
									</div>
								</div>
							</div>
						</div>
						<div className="form-wrap__input-wrap form-group">
							<label>
								<span className="form-wrap__input-title">Начало работ</span>
							</label>
							<div className="data-input-wrap">
								<InputMask
									{...register("start_date")}
									mask="99.99.9999"
									className={`input-mask data-input-date ${
										startDateError ? "error" : ""
									}`}
									placeholder="ДД.ММ.ГГГГ"
									defaultValue={getValues("start_date")}
								/>
								<InputMask
									{...register("start_time")}
									mask="99:99"
									className={`input-mask data-input-time ${
										startDateError ? "error" : ""
									}`}
									placeholder="00:00"
									defaultValue={getValues("start_time")}
								/>
							</div>
							{startDateError && (
								<div className="date-error">{startDateError}</div>
							)}
						</div>
						<CustomSelect
							title={"Допускающий"}
							control={control}
							regName={"permitter"}
							options={
								everyoneExceptEmployees?.results?.map(
									({ id, last_name, first_name }) => ({
										id,
										title: last_name + " " + first_name,
									})
								) || []
							}
						/>
						<div className="form-wrap__input-wrap info-message">
							Указанные в наряде-допуске меры безопасности выполнены, персонал
							проинструктирован, работы разрешены
						</div>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={!isValid}
						>
							Создать и подписать допуск
						</button>
					</form>
				</div>
			</div>
			<div className="special-menu__allowance-body">
				<h2>Все допуски</h2>
				<div className="special-menu__allowance-wrap">
					{daily_permits?.map(({ id, date_start, date_end, signers }) => (
						<DailyPermitItem
							key={id}
							{...{
								removeDailyPermit,
								signDailyPermit,
								closeDailyPermit,
								id,
								date_start,
								date_end,
								responsible_manager: signers.find(
									({ role }) => role === "responsible_manager"
								),
								permitter: signers.find(({ role }) => role === "permitter"),
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default memo(DailyPermits);
