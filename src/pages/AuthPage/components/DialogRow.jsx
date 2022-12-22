import { memo } from "react";

const DialogRow = ({ title, value }) => {
	return (
		<div className="system-info-dialog__row">
			<div className="system-info-dialog__title">{title}</div>
			<div className="system-info-dialog__content">
				{value?.left && (
					<div className="system-info-dialog__content-left">{value.left}</div>
				)}
				{value?.right && (
					<div className="system-info-dialog__content-right">{value.right}</div>
				)}
			</div>
		</div>
	);
};

export default memo(DialogRow);
