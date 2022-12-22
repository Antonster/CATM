import { memo, useCallback } from "react";
import { relativeUrlResolver } from "../../assets/helper.funcs";

const ButtonDockFile = ({ title, cb, dockUrl = "/", dockTitle }) => {
	const onClickButton = useCallback(() => {
		cb(dockTitle, relativeUrlResolver(dockUrl));
	}, [cb, dockTitle, dockUrl]);

	return (
		<button
			onClick={onClickButton}
			className="btn btn-outline-primary btn-with-icon"
		>
			<svg className="icon icon-file ">
				<use href="/img/svg/sprite.svg#file" />
			</svg>
			<span>{title}</span>
		</button>
	);
};

export default memo(ButtonDockFile);
