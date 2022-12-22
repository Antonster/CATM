import { memo } from "react";
import FormInput from "../FormInputs/FormInput";
import FileUploader from "../FormInputs/FileUploader";
import { dateMask } from "../../assets/helper.funcs";

const FormBlock = ({
	title,
	control,
	register,
	errors,
	formName,
	removeFileHandler,
	addFileHandler,
	setValue,
}) => {
	return (
		<div className="special-menu__mini-block">
			<h4>{title}</h4>
			<div className="special-menu__mini-block-wrap">
				<div className="special-menu__inputs">
					<div className="row">
						<FormInput
							register={register(`${formName}.number`)}
							label={"Номер документа"}
							type="text"
							inputClasses="col-xxl-6"
							errors={errors[formName] && errors[formName].number}
						/>
						<FormInput
							setValue={setValue}
							maskFunction={dateMask}
							regName={`${formName}.expiration_date`}
							register={register(`${formName}.expiration_date`)}
							label={"Действителен до:"}
							placeholder={"ДД. ММ. ГГГГ"}
							type="text"
							inputClasses="col-xxl-6"
							errors={errors[formName] && errors[formName].expiration_date}
						/>
					</div>
				</div>

				<FileUploader
					register={register}
					control={control}
					formName={formName}
					addFileHandler={addFileHandler}
					removeFileHandler={removeFileHandler}
					errors={errors[formName] && errors[formName].file}
				/>
			</div>
		</div>
	);
};

export default memo(FormBlock);
