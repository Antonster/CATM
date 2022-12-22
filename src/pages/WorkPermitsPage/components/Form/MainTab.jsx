import { memo } from "react";
import Input from "../../../../ui/Input/Input";
import Textarea from "../../../../ui/Textarea/Textarea";
import CustomSelect from "../../../../ui/CustomSelect/CustomSelect";
import InputMask from "react-input-mask";

const MainTab = ({
	register,
	getValues,
	control,
	everyoneExceptEmployees,
	workTypes,
	startDateError,
	expirationDateError,
}) => {
	return (
		<div className="special-menu__body">
			<h2>Основная информация</h2>
			<div className="form-wrap">
				<div className="row">
					<div className="col-xl-4 col-6">
						<div className="form-wrap__input-wrap form-group">
							<label>
								<span className="form-wrap__input-title">Организация</span>
							</label>
							<Input
								register={register("organization")}
								placeholder="Введите"
								type="text"
								inputStyle="authInput"
								disabled
							/>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-xl-4 col-6">
						<div className="form-wrap__input-wrap form-group">
							<CustomSelect
								title={"На выполнение работ"}
								control={control}
								regName={"work_type"}
								options={workTypes}
								disabled
							/>
							<span className="form-wrap__input-caption">
								Наименование работ и условия их выполнения
							</span>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-8">
						<div className="form-wrap__input-wrap form-group">
							<label>
								<span className="form-wrap__input-title">
									Место проведения работ
								</span>
								<Textarea
									register={register("place")}
									placeholder="Введите"
									rows={2}
								/>
							</label>
							<span className="form-wrap__input-caption">
								Отделение, цех, участок, установка, аппарат, здание, сооружение
							</span>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-4">
						<div className="form-wrap__input-wrap form-group">
							<label>
								<span className="form-wrap__input-title">Начало работ:</span>
								<div className="data-input-wrap">
									<InputMask
										{...register("start_date")}
										mask="99.99.9999"
										className={`input-mask data-input-date ${
											startDateError ? "error" : ""
										}`}
										placeholder={"ДД.ММ.ГГГГ"}
										defaultValue={getValues("start_date")}
									/>
									<InputMask
										{...register("start_time")}
										mask="99:99"
										className={`input-mask data-input-time ${
											startDateError ? "error" : ""
										}`}
										placeholder={"00:00"}
										defaultValue={getValues("start_time")}
									/>
								</div>
							</label>
							{startDateError && (
								<div className="date-error">{startDateError}</div>
							)}
						</div>
					</div>
					<div className="col-4">
						<div className="form-wrap__input-wrap form-group">
							<label>
								<span className="form-wrap__input-title">Действителен до:</span>
								<div className="data-input-wrap">
									<InputMask
										{...register("expiration_date")}
										mask="99.99.9999"
										className={`input-mask data-input-date ${
											expirationDateError ? "error" : ""
										}`}
										placeholder={"ДД.ММ.ГГГГ"}
										defaultValue={getValues("expiration_date")}
									/>
									<InputMask
										{...register("expiration_time")}
										mask="99:99"
										className={`input-mask data-input-time ${
											expirationDateError ? "error" : ""
										}`}
										placeholder={"00:00"}
										defaultValue={getValues("expiration_time")}
									/>
								</div>
							</label>
							{expirationDateError && (
								<div className="date-error">{expirationDateError}</div>
							)}
						</div>
					</div>
					<div className="col-4">
						<label>
							<span className="form-wrap__input-title">Смена:</span>
							<div className="radio-row">
								<label className="custom-input form-check">
									<input
										className="custom-input__input form-check-input"
										name="radio"
										type="radio"
										value="day"
										{...register("shift")}
										defaultChecked="day"
									/>
									<span className="custom-input__text form-check-label">
										День
									</span>
								</label>
								<label className="custom-input form-check">
									<input
										className="custom-input__input form-check-input"
										name="radio"
										type="radio"
										value="night"
										{...register("shift")}
									/>
									<span className="custom-input__text form-check-label">
										Ночь
									</span>
								</label>
							</div>
						</label>
					</div>
				</div>
				<div className="row">
					<div className="col-4">
						<div className="form-wrap__input-wrap form-group">
							<CustomSelect
								title={"Ответственный руководитель работ"}
								control={control}
								regName={"responsible_manager"}
								options={everyoneExceptEmployees}
								disabled
							/>
						</div>
					</div>
					<div className="col-4">
						<div className="form-wrap__input-wrap form-group">
							<CustomSelect
								title={"Ответственный исполнитель работ"}
								control={control}
								regName={"responsible_executor"}
								options={everyoneExceptEmployees}
							/>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-4">
						<div className="form-wrap__input-wrap form-group">
							<CustomSelect
								title={"Выдавший наряд-допуск"}
								control={control}
								regName={"permit_issuer"}
								options={everyoneExceptEmployees}
							/>
						</div>
					</div>
					<div className="col-4">
						<div className="form-wrap__input-wrap form-group">
							<CustomSelect
								title={"Получивший наряд-допуск"}
								control={control}
								regName={"permit_acceptor"}
								options={everyoneExceptEmployees}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(MainTab);
