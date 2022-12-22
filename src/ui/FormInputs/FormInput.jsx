import { memo, useCallback } from "react";
import "./form-inputs.css";
import ErrorWrapper from "../ErrorWrapper/ErrorWrapper";

function InputComponent({
	inputClasses,
	label,
	register,
	errors,
	regName,
	placeholder = "Введите",
	setValue,
	maskFunction = null,
	...rest
}) {
	const newOnChange = useCallback(
		(e) => {
			if (maskFunction) {
				const maskedValue = maskFunction(e.target.value);
				setValue(regName, maskedValue);
				const newE = { ...e, target: { ...e.target, value: maskedValue } };
				register.onChange(newE);
			} else {
				register.onChange(e);
			}
		},
		[maskFunction, regName, register, setValue]
	);

	return (
		<div className={inputClasses}>
			<div className="form-wrap__input-wrap form-group">
				<label>
					<span className="form-wrap__input-title">{label}</span>
					<input
						className="form-wrap__input form-control"
						onChange={newOnChange}
						onBlur={register.onBlur}
						name={register.name}
						ref={register.ref}
						placeholder={placeholder}
						{...rest}
					/>
				</label>
				<ErrorWrapper errors={errors} />
			</div>
		</div>
	);
}

export default memo(InputComponent);
