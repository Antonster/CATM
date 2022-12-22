import { memo } from "react";
import FormInput from "../../../ui/FormInputs/FormInput";
import { phoneMask, dateMask } from "../../../assets/helper.funcs";

const UserDataFields = ({ register, errors, setValue }) => {
	return (
		<div className="special-menu__block">
			<h2>Личная информация</h2>
			<div className="row">
				<FormInput
					register={register("last_name")}
					label={"Фамилия"}
					type="text"
					inputClasses="col-4"
					errors={errors.last_name}
				/>
				<FormInput
					register={register("first_name")}
					label={"Имя"}
					type="text"
					inputClasses="col-4"
					errors={errors.first_name}
				/>
				<FormInput
					register={register("middle_name")}
					label={"Отчество"}
					type="text"
					inputClasses="col-4"
					errors={errors.middle_name}
				/>
				<FormInput
					register={register("position")}
					label={"Должность"}
					type="text"
					inputClasses="col-4"
					errors={errors.position}
				/>
				<FormInput
					maskFunction={phoneMask}
					setValue={setValue}
					register={register("phone_number")}
					regName={"phone_number"}
					label={"Номер телефона"}
					type="text"
					inputClasses="col-4"
					errors={errors.phone_number}
				/>
				<FormInput
					register={register("email")}
					label={"E-mail"}
					type="text"
					inputClasses="col-4"
					errors={errors.email}
				/>
				<FormInput
					setValue={setValue}
					regName={`birthday`}
					maskFunction={dateMask}
					register={register(`birthday`)}
					label={"Дата рождения:"}
					type="text"
					placeholder="ДД.ММ.ГГГГ"
					inputClasses="col-4"
					errors={errors.birthday}
				/>
			</div>
		</div>
	);
};

export default memo(UserDataFields);
