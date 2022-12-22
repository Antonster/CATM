import { memo } from "react";
import "./textarea.css";

function Textarea({ register, rows, cols, errors, errorIndication, ...rest }) {
	return (
		<div className="input-wrapper">
			<textarea
				className={`form-control form-wrap__input ${
					errorIndication ? "error" : ""
				}`}
				rows={rows}
				cols={cols}
				{...register}
				{...rest}
			/>
			<div className="form-error__wrapper">
				{errors?.message && <span>{errors.message}</span>}
			</div>
		</div>
	);
}

export default memo(Textarea);
