import { memo, useCallback } from "react";

const ButtonComponent = ({ buttonStyle, title, ...rest }) => {
	const setStyle = useCallback(() => {
		switch (buttonStyle) {
			case "warning":
				return "btn-warning";
			default:
				return "";
		}
	}, [buttonStyle]);

	return (
		<button className={`btn ${setStyle()}`} {...rest}>
			{title}
		</button>
	);
};

export default memo(ButtonComponent);
