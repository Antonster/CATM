import { memo } from "react";

const CheckMark = ({ isPositive, hintText }) => {
	return (
		<div
			className={`employee-list-item__covid employee-list-item__covid--${
				isPositive ? "positive" : "negative"
			}`}
		>
			{!isPositive && hintText && <p>{hintText}</p>}
		</div>
	);
};

export default memo(CheckMark);
