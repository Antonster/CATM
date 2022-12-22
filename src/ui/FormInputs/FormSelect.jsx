import { memo } from "react";
import ErrorWrapper from "../ErrorWrapper/ErrorWrapper";

const FormSelect = ({
	title,
	register,
	regName,
	options,
	errors,
	disabled,
}) => {
	return (
		<div className="form-wrap__input-wrap form-group">
			<label>
				<span className="form-wrap__input-title">{title}</span>
				<select
					name={regName}
					{...register(regName)}
					className="form-wrap__input form-select"
					disabled={disabled}
				>
					<option value="" hidden disabled key={"hidden-" + regName}>
						Выберите
					</option>
					{options.map((option) => {
						return (
							<option key={option.id + "-" + regName} value={option.id}>
								{option.title}
							</option>
						);
					})}
				</select>
			</label>

			<ErrorWrapper errors={errors} />
		</div>
	);
};

export default memo(FormSelect);
