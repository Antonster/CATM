import { memo } from "react";
import Dialog from "@mui/material/Dialog";

const ConfirmationPopup = ({
	onCloseConfirmationPopup,
	isConfirmationPopup,
}) => {
	return (
		<Dialog onClose={onCloseConfirmationPopup} open={isConfirmationPopup}>
			<div className="sNewPermit-popup">
				<div className="sNewPermit-popup__title">Ваше сообщение отправлено</div>
				<button className="btn btn-primary" onClick={onCloseConfirmationPopup}>
					Ок
				</button>
			</div>
		</Dialog>
	);
};

export default memo(ConfirmationPopup);
