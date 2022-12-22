import { memo, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import CustomSelect from "../../../ui/CustomSelect/CustomSelect";
import { permitsActions } from "../../../store/actions";

const Extension = ({ workPermitInfo, setPermitExtensionPopup }) => {
	const [endDay, endMonth, endYear] =
		workPermitInfo?.work_permit?.expiration_date?.split(".");
	const [endHour = 0, endMinute = 0, endSecond = 0] =
		workPermitInfo?.work_permit?.expiration_time?.split(":");
	const dispatch = useDispatch();
	const everyoneExceptEmployees = useSelector(
		(state) => state.permits?.everyoneExceptEmployees
	);
	const [isValid, setValid] = useState(false);
	const [endDateError, setEndDateError] = useState(false);
	const { register, handleSubmit, getValues, control, watch } = useForm({
		mode: "onChange",
		defaultValues: {
			end_date: "",
			end_time: "",
			permit_issuer: "",
		},
	});
	const watchFields = watch();

	const onSubmit = useCallback(
		async (fData) => {
			const data = new FormData();
			const [day, month, year] = fData["end_date"].split(".");
			const [hour = 0, minute = 0, second = 0] = fData["end_time"].split(":");
			const endDate = new Date(year, +month - 1, day, hour, minute, second);
			const utcEndDate = new Date(endDate.setUTCHours(hour, minute, second));
			data.append("date_end", utcEndDate.toISOString());
			data.append("permit_issuer", fData["permit_issuer"]);
			data.append("another", fData["another"]);

			setPermitExtensionPopup(data);
		},
		[setPermitExtensionPopup]
	);

	useEffect(() => {
		const [day, month, year] = watchFields["end_date"].split(".");
		const [hour = 0, minute = 0, second = 0] =
			watchFields["end_time"].split(":");
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
			if (key === "end_date") {
				if (permitDate <= endDate) {
					setEndDateError("Дата продления должна быть позже даты окончания");
					setValid(false);
					break;
				} else if (
					(permitDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24) >
					15
				) {
					setEndDateError("Дата продления не должна превышать 15 дней");
					setValid(false);
					break;
				}
				if (!(permitDate - 0)) {
					setEndDateError(false);
					setValid(false);
					break;
				}
			}
			if (key === "another") {
				continue;
			}
			if (!watchFields[key]) {
				setValid(false);
				break;
			} else {
				setEndDateError(false);
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
			<div className="special-menu__new-allowance borderless">
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
								<span className="form-wrap__input-title">Продлить до</span>
							</label>
							<div className="data-input-wrap">
								<InputMask
									{...register("end_date")}
									mask="99.99.9999"
									className={`input-mask data-input-date ${
										endDateError ? "error" : ""
									}`}
									placeholder="ДД.ММ.ГГГГ"
									defaultValue={getValues("end_date")}
								/>
								<InputMask
									{...register("end_time")}
									mask="99:99"
									className={`input-mask data-input-time ${
										endDateError ? "error" : ""
									}`}
									placeholder="00:00"
									defaultValue={getValues("end_time")}
								/>
							</div>
							{endDateError && <div className="date-error">{endDateError}</div>}
						</div>
						<CustomSelect
							title="Выдавший наряд-допуск"
							control={control}
							regName="permit_issuer"
							options={
								everyoneExceptEmployees?.results?.map(
									({ id, last_name, first_name }) => ({
										id,
										title: last_name + " " + first_name,
									})
								) || []
							}
						/>
					</form>
				</div>
			</div>
			<div className="special-menu__footer ">
				<button
					className="btn btn-primary"
					onClick={handleSubmit(onSubmit)}
					disabled={!isValid}
				>
					Продлить
				</button>
			</div>
		</div>
	);
};

export default memo(Extension);
