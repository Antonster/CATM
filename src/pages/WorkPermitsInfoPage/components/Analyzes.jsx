import { memo, useMemo, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import Input from "../../../ui/Input/Input";
import AnalyzesItem from "./AnalyzesItem";

const Analyzes = ({
	workPermitInfo,
	userId,
	onCreateAnalyze,
	analyzes,
	removeAnalyze,
}) => {
	const [startDay, startMonth, startYear] =
		workPermitInfo?.work_permit?.start_date?.split(".");
	const [startHour = 0, startMinute = 0, startSecond = 0] =
		workPermitInfo?.work_permit?.start_time?.split(":");
	const [endDay, endMonth, endYear] =
		workPermitInfo?.work_permit?.expiration_date?.split(".");
	const [endHour = 0, endMinute = 0, endSecond = 0] =
		workPermitInfo?.work_permit?.expiration_time?.split(":");
	const { id: permitId } = useParams();
	const [isValid, setValid] = useState(false);
	const [analyzeDateError, setAnalyzeDateError] = useState(false);
	const defaultValues = useMemo(
		() => ({
			user: userId,
			work_permit: permitId,
			analyze_date: "",
			analyze_time: "",
			place: "",
			result: "",
			components: "",
			concentration: "",
			date_next: analyzes[0]?.date_next || "",
			device_model: analyzes[0]?.device_model || "",
			device_number: analyzes[0]?.device_number || "",
		}),
		[analyzes, permitId, userId]
	);
	const { register, handleSubmit, getValues, watch, reset } = useForm({
		mode: "onChange",
		defaultValues,
	});
	const watchFields = watch();

	const onSubmit = useCallback(
		async (fData) => {
			const data = new FormData();

			for (const key in fData) {
				if (key === "analyze_time") {
					continue;
				} else if (key === "analyze_date") {
					const [day, month, year] = fData["analyze_date"].split(".");
					const [hour = 0, minute = 0, second = 0] =
						fData["analyze_time"].split(":");
					const date = new Date(year, +month - 1, day, hour, minute, second);
					const utcDate = new Date(date.setUTCHours(hour, minute, second));

					data.append("date", utcDate.toISOString());
				} else if (key === "date_next") {
					const [day, month, year] = fData["date_next"].split(".");

					data.append("date_next", `${year}-${month}-${day}`);
				} else {
					data.append(key, fData[key]);
				}
			}

			onCreateAnalyze(data);
			reset(defaultValues);
		},
		[defaultValues, onCreateAnalyze, reset]
	);

	useEffect(() => {
		reset(defaultValues);
	}, [analyzes]);

	useEffect(() => {
		const [analyzeDay, analyzeMonth, analyzeYear] =
			watchFields["analyze_date"].split(".");
		const [analyzeHour = 0, analyzeMinute = 0, analyzeSecond = 0] =
			watchFields["analyze_time"].split(":");
		const [nextDay, nextMonth, nextYear] = watchFields["date_next"].split(".");
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
		const analyzeDate = new Date(
			analyzeYear,
			+analyzeMonth - 1,
			analyzeDay,
			analyzeHour,
			analyzeMinute,
			analyzeSecond
		);
		const nextDate = new Date(nextYear, +nextMonth - 1, nextDay);

		for (const key in watchFields) {
			if (key === "analyze_date") {
				if (analyzeDate <= startDate || analyzeDate >= endDate) {
					setAnalyzeDateError(
						"Должна быть в рамках периода работы по наряд-допуску"
					);
					setValid(false);
					break;
				}
				if (
					analyzes?.find(({ date }) => date === watchFields["analyze_date"])
				) {
					setAnalyzeDateError("Анализ для указанной даты уже существует");
					setValid(false);
					break;
				}
				if (!(analyzeDate - 0)) {
					setAnalyzeDateError(false);
					setValid(false);
					break;
				}
			} else if (key === "date_next") {
				if (!(nextDate - 0)) {
					setValid(false);
					break;
				}
			} else if (!watchFields[key]) {
				setValid(false);
				break;
			} else {
				setAnalyzeDateError(false);
				setValid(true);
			}
		}
	}, [watchFields]);

	return (
		<div className="special-menu__new-allowance-wrapper">
			<div className="special-menu__new-allowance">
				<h2>Новый анализ</h2>
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
								<span className="form-wrap__input-title">
									Дата и время отбора проб
								</span>
							</label>
							<div className="data-input-wrap">
								<InputMask
									{...register("analyze_date")}
									mask="99.99.9999"
									className={`input-mask data-input-date ${
										analyzeDateError ? "error" : ""
									}`}
									placeholder="ДД.ММ.ГГГГ"
									defaultValue={getValues("analyze_date")}
								/>
								<InputMask
									{...register("analyze_time")}
									mask="99:99"
									className={`input-mask data-input-time ${
										analyzeDateError ? "error" : ""
									}`}
									placeholder="00:00"
									defaultValue={getValues("analyze_time")}
								/>
							</div>
							{analyzeDateError && (
								<div className="date-error">{analyzeDateError}</div>
							)}
						</div>
						<div className="form-wrap__input-wrap form-group">
							<label>
								<span className="form-wrap__input-title">
									Место отбора проб
								</span>
							</label>
							<Input
								register={register("place")}
								placeholder="Введите"
								type="text"
								inputStyle="authInput"
							/>
						</div>
						<div className="form-wrap__input-wrap form-group">
							<label>
								<span className="form-wrap__input-title">
									Определяемые компоненты
								</span>
							</label>
							<Input
								register={register("components")}
								placeholder="Введите"
								type="text"
								inputStyle="authInput"
							/>
						</div>
						<div className="form-wrap__input-wrap form-group">
							<label>
								<span className="form-wrap__input-title">
									Допустимая концентрация
								</span>
							</label>
							<Input
								register={register("concentration")}
								placeholder="Введите"
								type="text"
								inputStyle="authInput"
							/>
						</div>
						<div className="form-wrap__input-wrap form-group">
							<label>
								<span className="form-wrap__input-title">
									Результаты анализа
								</span>
							</label>
							<Input
								register={register("result")}
								placeholder="Введите"
								type="text"
								inputStyle="authInput"
							/>
						</div>
						<div className="form-wrap__input-wrap form-group">
							<label>
								<span className="form-wrap__input-title">
									Наименование прибора
								</span>
							</label>
							<div className="device-wrapper">
								<div className="device-model">
									<Input
										register={register("device_model")}
										placeholder="Марка"
										type="text"
										inputStyle="authInput"
										disabled={analyzes?.length > 0}
									/>
								</div>
								<div className="device-number">
									<Input
										register={register("device_number")}
										placeholder="№"
										type="text"
										inputStyle="authInput"
										disabled={analyzes?.length > 0}
									/>
								</div>
							</div>
						</div>
						<div className="form-wrap__input-wrap form-group">
							<label>
								<span className="form-wrap__input-title">
									Дата следующей поверки
								</span>
							</label>
							<div className="data-input-wrap">
								<InputMask
									{...register("date_next")}
									mask="99.99.9999"
									className="input-mask data-input-date date-next"
									placeholder="ДД.ММ.ГГГГ"
									disabled={analyzes?.length > 0}
								/>
							</div>
						</div>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={!isValid}
						>
							Добавить анализ
						</button>
					</form>
				</div>
			</div>
			<div className="special-menu__allowance-body">
				<h2>Все анализы</h2>
				<div className="special-menu__allowance-wrap">
					{analyzes?.map(
						({
							id,
							components,
							concentration,
							date,
							date_next,
							device_model,
							device_number,
							place,
							result,
							time,
							user,
						}) => (
							<AnalyzesItem
								key={id}
								{...{
									id,
									components,
									concentration,
									date,
									date_next,
									device_model,
									device_number,
									place,
									result,
									time,
									user,
									removeAnalyze,
								}}
							/>
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(Analyzes);
