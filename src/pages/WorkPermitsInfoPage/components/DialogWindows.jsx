import { memo, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import Dialog from "@mui/material/Dialog";

const DialogWindows = ({
	workPermitInfo,
	onSignPermit,
	onRejectPermit,
	deleteWorkPermitById,
	onArchivingPermit,
	removeDailyPermit,
	removeAnalyze,
	signDailyPermit,
	closeDailyPermitPopup,
	onExtendPermit,
	onExtendPermitSign,
	setConfirmationDialog,
	setRejectionDialog,
	setDeletionPopup,
	setArchivingPopup,
	setRemoveDailyPermitPopup,
	setRemoveAnalyzePopup,
	setSignDailyPermitPopup,
	setCloseDailyPermitPopup,
	setPermitExtensionPopup,
	setPermitExtensionSignPopup,
	confirmationDialog,
	rejectionDialog,
	isDeletionPopup,
	isArchivingPopup,
	removeDailyPermitPopup,
	removeAnalyzePopup,
	signDailyPermitPopup,
	permitExtensionPopup,
	permitExtensionSignPopup,
}) => {
	const [isValid, setValid] = useState(false);
	const [dateError, setDateError] = useState(false);
	const { register, handleSubmit, setValue, getValues, watch, reset } = useForm(
		{
			mode: "onChange",
			defaultValues: {
				end_date: "",
				end_time: "",
			},
		}
	);
	const watchFields = watch();

	const onSignDailyPermitSubmit = useCallback(
		async (fData) => {
			const [day, month, year] = fData["end_date"].split(".");
			const [hour = 0, minute = 0, second = 0] = fData["end_time"].split(":");
			const endDate = new Date(year, +month - 1, day, hour, minute, second);
			const utcEndDate = new Date(endDate.setUTCHours(hour, minute, second));

			signDailyPermit(
				closeDailyPermitPopup.id,
				"responsible_manager",
				utcEndDate.toISOString()
			);
			reset({ end_date: "", end_time: "" });
		},
		[closeDailyPermitPopup, reset, signDailyPermit]
	);

	useEffect(() => {
		const [endDay, endMonth, endYear] = watchFields["end_date"].split(".");
		const [endHour, endMinute] = watchFields["end_time"].split(":");
		const fullEndDate = new Date(
			endYear,
			+endMonth - 1,
			endDay,
			endHour,
			endMinute,
			0
		);

		let fullStartDate;
		if (closeDailyPermitPopup) {
			const [startDay, startMonth, startYear] =
				closeDailyPermitPopup?.date_start?.split(" ")[0]?.split(".");
			const [startHour, startMinute] = closeDailyPermitPopup?.date_start
				?.split(" ")[1]
				?.split(":");
			fullStartDate = new Date(
				startYear,
				+startMonth - 1,
				startDay,
				startHour,
				startMinute,
				0
			);
		}

		for (const key in watchFields) {
			if (!fullStartDate || !fullEndDate) {
				setDateError(false);
				setValid(false);
				break;
			} else if (fullStartDate >= fullEndDate) {
				setDateError("Дата окончания должна быть позже даты начала");
				setValid(false);
				break;
			} else if (!(fullEndDate - 0)) {
				setDateError(false);
				setValid(false);
				break;
			} else if (!watchFields[key]) {
				setDateError(false);
				setValid(false);
				break;
			} else {
				setDateError(false);
				setValid(true);
			}
		}
	}, [watchFields]);

	useEffect(() => {
		if (workPermitInfo && closeDailyPermitPopup) {
			setValue(
				"end_date",
				workPermitInfo.daily_permits
					.find(({ id }) => closeDailyPermitPopup.id === id)
					?.date_start.split(" ")[0]
			);
		}
	}, [workPermitInfo, closeDailyPermitPopup]);

	return (
		<>
			<Dialog
				onClose={() => setConfirmationDialog(false)}
				open={!!confirmationDialog}
			>
				<div className="sNewPermit-popup">
					<div className="sNewPermit-popup__title">Подписать наряд-допуск?</div>
					<button
						className="btn btn-primary"
						onClick={() => onSignPermit(confirmationDialog)}
					>
						Подтвердить
					</button>
					<button
						className="btn btn-outline-primary"
						onClick={() => setConfirmationDialog(false)}
					>
						Отмена
					</button>
				</div>
			</Dialog>
			<Dialog
				onClose={() => setRejectionDialog(false)}
				open={!!rejectionDialog}
			>
				<div className="sNewPermit-popup">
					<div className="sNewPermit-popup__title">Отклонить наряд-допуск?</div>
					<button
						className="btn btn-primary"
						onClick={() => onRejectPermit(rejectionDialog)}
					>
						Подтвердить
					</button>
					<button
						className="btn btn-outline-primary"
						onClick={() => setRejectionDialog(false)}
					>
						Отмена
					</button>
				</div>
			</Dialog>
			<Dialog onClose={() => setDeletionPopup(false)} open={isDeletionPopup}>
				<div className="sNewPermit-popup">
					<div className="sNewPermit-popup__title">Удалить наряд-допуск?</div>
					<button className="btn btn-primary" onClick={deleteWorkPermitById}>
						Подтвердить
					</button>
					<button
						className="btn btn-outline-primary"
						onClick={() => setDeletionPopup(false)}
					>
						Отмена
					</button>
				</div>
			</Dialog>
			<Dialog onClose={() => setArchivingPopup(false)} open={isArchivingPopup}>
				<div className="sNewPermit-popup">
					<div className="sNewPermit-popup__title">
						Отправить наряд-допуск в архив?
					</div>
					<button className="btn btn-primary" onClick={onArchivingPermit}>
						Подтвердить
					</button>
					<button
						className="btn btn-outline-primary"
						onClick={() => setArchivingPopup(false)}
					>
						Отмена
					</button>
				</div>
			</Dialog>
			<Dialog
				onClose={() => setRemoveDailyPermitPopup(false)}
				open={!!removeDailyPermitPopup}
			>
				<div className="sNewPermit-popup">
					<div className="sNewPermit-popup__title">
						Хотите удалить ежедневный допуск?
					</div>
					<button
						className="btn btn-primary"
						onClick={() => removeDailyPermit(removeDailyPermitPopup)}
					>
						Подтвердить
					</button>
					<button
						className="btn btn-outline-primary"
						onClick={() => setRemoveDailyPermitPopup(false)}
					>
						Отмена
					</button>
				</div>
			</Dialog>
			<Dialog
				onClose={() => setSignDailyPermitPopup(false)}
				open={!!signDailyPermitPopup}
			>
				<div className={`sNewPermit-popup`}>
					<div className="sNewPermit-popup__title">
						Хотите подписать ежедневный допуск?
					</div>
					<button
						className="btn btn-primary"
						onClick={() =>
							signDailyPermit(signDailyPermitPopup.id, "permitter")
						}
					>
						Подтвердить
					</button>
					<button
						className="btn btn-outline-primary"
						onClick={() => {
							setSignDailyPermitPopup(false);
							reset({ end_date: "", end_time: "" });
						}}
					>
						Отмена
					</button>
				</div>
			</Dialog>
			<Dialog
				onClose={() => setCloseDailyPermitPopup(false)}
				open={!!closeDailyPermitPopup}
			>
				<div className={`sNewPermit-popup form-popup`}>
					<div className="sNewPermit-popup__title form-title">
						Окончить и подписать
					</div>
					<div className="form-wrap__input-wrap info-message small">
						Работы окончены, рабочее место убрано, персонал с рабочего места
						выведен
					</div>
					<div className="form-wrap__input-wrap form-group">
						<label>
							<span className="form-wrap__input-title">
								Дата и время окончания работ
							</span>
						</label>
						<div className="data-input-wrap">
							<InputMask
								{...register("end_date")}
								mask="99.99.9999"
								className={`input-mask data-input-date ${
									dateError ? "error" : ""
								}`}
								placeholder="ДД.ММ.ГГГГ"
								defaultValue={getValues("end_date")}
								disabled
							/>
							<InputMask
								{...register("end_time")}
								mask="99:99"
								className={`input-mask data-input-time ${
									dateError ? "error" : ""
								}`}
								placeholder="00:00"
								defaultValue={getValues("end_time")}
							/>
						</div>
						{dateError && <div className="date-error">{dateError}</div>}
					</div>
					<button
						className="btn btn-primary"
						disabled={!isValid}
						onClick={handleSubmit(onSignDailyPermitSubmit)}
					>
						Подтвердить
					</button>
					<button
						className="btn btn-outline-primary"
						onClick={() => {
							setCloseDailyPermitPopup(false);
							reset({ end_date: "", end_time: "" });
						}}
					>
						Отмена
					</button>
				</div>
			</Dialog>
			<Dialog
				onClose={() => setRemoveAnalyzePopup(false)}
				open={!!removeAnalyzePopup}
			>
				<div className="sNewPermit-popup">
					<div className="sNewPermit-popup__title">Хотите удалить анализ?</div>
					<button
						className="btn btn-primary"
						onClick={() => removeAnalyze(removeAnalyzePopup)}
					>
						Подтвердить
					</button>
					<button
						className="btn btn-outline-primary"
						onClick={() => setRemoveAnalyzePopup(false)}
					>
						Отмена
					</button>
				</div>
			</Dialog>
			<Dialog
				onClose={() => setPermitExtensionPopup(false)}
				open={!!permitExtensionPopup}
			>
				<div className="sNewPermit-popup">
					<div className="sNewPermit-popup__title">Запросить продление?</div>
					<button
						className="btn btn-primary"
						onClick={() => onExtendPermit(permitExtensionPopup)}
					>
						Подтвердить
					</button>
					<button
						className="btn btn-outline-primary"
						onClick={() => setPermitExtensionPopup(false)}
					>
						Отмена
					</button>
				</div>
			</Dialog>
			<Dialog
				onClose={() => setPermitExtensionSignPopup(false)}
				open={permitExtensionSignPopup}
			>
				<div className="sNewPermit-popup">
					<div className="sNewPermit-popup__title">Продлить наряд-допуск?</div>
					<button
						className="btn btn-primary"
						onClick={() => onExtendPermitSign()}
					>
						Подтвердить
					</button>
					<button
						className="btn btn-outline-primary"
						onClick={() => setPermitExtensionSignPopup(false)}
					>
						Отмена
					</button>
				</div>
			</Dialog>
		</>
	);
};

export default memo(DialogWindows);
