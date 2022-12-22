import { memo } from "react";

const RemoveButton = ({ title, cb, removeArg }) => {
	return (
		<button
			onClick={(e) => cb(e, removeArg)}
			className="special-menu__delete-block"
		>
			<img src="/img/svg/cancel.svg" alt={title} />
			<span>{title}</span>
		</button>
	);
};

export default memo(RemoveButton);
