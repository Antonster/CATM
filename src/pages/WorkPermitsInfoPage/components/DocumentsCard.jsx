import { memo } from "react";
import { prettifySize } from "../../../assets/helper.funcs";

const DocumentsCard = ({ documents, openDocumentInModal }) => {
	return (
		<>
			{documents?.map(({ id, file, file_name, file_size }) => (
				<div key={id} className="upload-file-wrap medium">
					<div className="upload-file-wrap__img">
						<img src="/img/svg/pdf.svg" alt="" />
					</div>
					<div className="upload-file-wrap__info">
						<div
							className="upload-file-wrap__title"
							onClick={() => openDocumentInModal(file)}
						>
							{file_name}
						</div>
						<div className="upload-file-wrap__type">
							pdf {prettifySize(file_size)}
						</div>
					</div>
				</div>
			))}
		</>
	);
};

export default memo(DocumentsCard);
