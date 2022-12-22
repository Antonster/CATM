import { memo, useCallback } from "react";

const InputFileInfo = ({ uuid, name, size = "1mb", removeHandler }) => {
	const clickHandle = useCallback(
		(e, uuid) => {
			e.preventDefault();
			removeHandler(uuid);
		},
		[removeHandler]
	);

	return (
		<div className="input-file__file">
			<div className="input-file__file-info">
				<div className="input-file__file-name">{name}</div>
				<div className="input-file__file-size">{size}</div>
			</div>
			<button
				onClick={(e) => clickHandle(e, uuid)}
				className="input-file__file-delete"
			>
				<img src="/img/svg/cancel.svg" alt="" />
			</button>
		</div>
	);
};

export default memo(InputFileInfo);
