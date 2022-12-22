import { memo } from "react";
import { prettifySize } from "../../../assets/helper.funcs";

const Document = ({ document, openDocumentInModal }) => {
	return (
		<div className="sWorkPermitCard__file-wrap">
			<div className="file">
				<div className="file__img">
					<img src="/img/svg/pdf.svg" alt="" />
				</div>
				<div className="file__info">
					<div
						className="file__name"
						onClick={() => openDocumentInModal(document.file)}
					>
						{document.title}
					</div>
					<div className="file__type">
						pdf {prettifySize(document.file_size)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(Document);
