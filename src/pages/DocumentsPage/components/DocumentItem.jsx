import { memo, useMemo } from "react";
import { prettifySize } from "../../../assets/helper.funcs";

const DocumentsItem = ({
	id,
	title,
	file,
	file_size,
	role,
	searchParamsObj,
	onOpenDocumentInModal,
	onDeleteDocument,
}) => {
	const memoPrettySize = useMemo(() => prettifySize(file_size), [file_size]);

	return (
		<div className="upload-file-wrap">
			<div className="upload-file-wrap__img">
				<img src="/img/svg/pdf.svg" alt="" />
			</div>
			<div className="upload-file-wrap__info">
				<div
					className="upload-file-wrap__title"
					onClick={() => onOpenDocumentInModal({ file, title })}
				>
					<span className="upload-file-wrap__link">{title}</span>
				</div>
				<div className="upload-file-wrap__type">pdf {memoPrettySize}</div>
			</div>
			{role === "security_manager" &&
				+searchParamsObj?.type !== 4 &&
				+searchParamsObj?.type !== 5 && (
					<button className="upload-file-wrap__delete">
						<img
							src="/img/svg/cancel.svg"
							alt=""
							onClick={() => onDeleteDocument(id)}
						/>
					</button>
				)}
		</div>
	);
};

export default memo(DocumentsItem);
