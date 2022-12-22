import { memo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogRow from "./DialogRow";

const dialogRowsData = [
	{
		title: "Автор",
		value: {
			left: "Дмитриев А.С.",
			right: "+7 951 641 76 90",
		},
	},
	{
		title: "Дистрибьютор",
		value: {
			left: "Новак М.Ю.",
			right: "+7 985 995 33 55",
		},
	},
	{
		title: "Версия приложения",
		value: {
			left: "Ver 1.2.1",
		},
	},
];

const SystemInfoDialog = ({ onCloseSystemInfoDialog, isSystemInfoDialog }) => {
	return (
		<Dialog onClose={onCloseSystemInfoDialog} open={isSystemInfoDialog}>
			<div className="sNewPermit-popup">
				<div className="system-info-dialog__logo">
					<img src="/img/svg/logo.svg" alt="" />
				</div>
				{dialogRowsData.map(({ title, value }) => (
					<DialogRow key={title} title={title} value={value} />
				))}
				<button
					className="btn btn-outline-primary"
					onClick={onCloseSystemInfoDialog}
				>
					Закрыть
				</button>
			</div>
		</Dialog>
	);
};

export default memo(SystemInfoDialog);
