import { memo, useCallback } from "react";

const FileInList = ({ name, size, classes, removeHandler, id }) => {
	const onClickRemove = useCallback(() => {
		removeHandler(id);
	}, [id, removeHandler]);

	return (
		<div className={`file-in-list__wrapper ${classes}`}>
			<div className={"file-in-list__txt-wrap"}>
				<div>{name}</div>
				<div>{size}</div>
			</div>
			<div onClick={onClickRemove}>
				<img alt="" src={"/img/svg/cancel.svg"} />
			</div>
		</div>
	);
};

export default memo(FileInList);
