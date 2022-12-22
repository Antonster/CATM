import { memo } from "react";
import { components } from "react-select";

const selectStyles = {
	valueContainer: (styles) => ({
		...styles,
		padding: "13px 17px",
	}),
	singleValue: (styles, { isDisabled }) => ({
		...styles,
		color: isDisabled ? "rgba(69, 69, 69, 0.5)" : "#2a2d3f",
		fontSize: "14px",
		fontFamily:
			"'Museo Sans Cyrl', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	}),
	placeholder: (styles) => ({
		...styles,
		color: "rgba(136, 136, 136, 0.5)",
		fontSize: "14px",
		fontFamily:
			"'Museo Sans Cyrl', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	}),
	input: (styles) => ({
		...styles,
		padding: "0",
		margin: "0",
	}),
	control: (styles, { isFocused }) => ({
		...styles,
		borderRadius: "10px",
		border: isFocused ? "1px solid #8db9ff" : "1px solid #e0e0e0",
		boxShadow: "none",
		transition: "all",
		transitionDuration: ".4s",

		"&:hover": {
			border: "1px solid #8db9ff",
		},
	}),
	indicatorSeparator: () => ({}),
	menu: (styles) => ({
		...styles,
		zIndex: 200,
		boxShadow: "0 0 10px rgb(0 0 0 / 10%), 0 4px 30px rgb(0 0 0 / 10%)",
		borderRadius: "10px",
		border: "none",
	}),
	menuList: (styles) => ({
		...styles,
		"&::-webkit-scrollbar-track": {
			borderRadius: "10px",
			backgroundColor: "#f5f5f5",
		},
		"&::-webkit-scrollbar": {
			width: "6px",
			background: "#e7e7e7",
		},
		"&::-webkit-scrollbar-thumb": {
			borderRadius: "15px",
			background: "#b3b3b3",
		},
	}),
	option: (styles, { isSelected }) => ({
		...styles,
		color: "#2a2d3f",
		fontSize: "18px",
		lineHeight: "1.3888888889",
		padding: "10px 42px 10px 24px",
		fontFamily:
			"'Museo Sans Cyrl', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
		background: "none",
		cursor: "pointer",
		position: "relative",

		"&:hover": {
			background: "#dbe9ff",
		},
		"&:after": isSelected
			? {
					backgroundImage: `url('img/svg/check-black.svg')`,
					backgroundRepeat: "no-repeat",
					backgroundSize: "contain",
					content: "''",
					height: "10px",
					position: "absolute",
					right: "24px",
					top: "50%",
					transform: "translateY(-50%)",
					width: "16px",
			  }
			: {},
	}),
};

const DropdownIndicator = memo((props) => {
	return (
		<components.DropdownIndicator {...props}>
			<div className={props.isDisabled ? "" : "select-arrow"} />
		</components.DropdownIndicator>
	);
});

export { DropdownIndicator, selectStyles };
