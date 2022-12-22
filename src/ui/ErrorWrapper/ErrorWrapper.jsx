import { memo } from "react";

const ErrorWrapper = ({ errors }) => {
	return (
		<div className="form-input-error__wrapper">
			{errors && (
				<>
					<img
						className={"error-svg-icon"}
						src={"/img/svg/warning.svg"}
						alt="error"
					/>
					<span>{errors.message}</span>
				</>
			)}
		</div>
	);
};

export default memo(ErrorWrapper);
