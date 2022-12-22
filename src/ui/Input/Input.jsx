import { memo } from "react";
import "./input.css";

function Input({ inputStyle, register, errors, errorIndication, ...rest }) {
	return (
		<div className="input-wrapper">
			<input
				className={`form-control ${
					inputStyle === "authInput" ? "form-wrap__input" : ""
				} ${errorIndication ? "error" : ""}`}
				{...register}
				{...rest}
			/>
			<div className="form-error__wrapper">
				{errors?.message && <span>{errors.message}</span>}
			</div>
		</div>
	);
}

export default memo(Input);
