import { memo, useState, useCallback } from "react";
import { prettifySize } from "../../../assets/helper.funcs";

const imageMimeType = /application\/(pdf)/i;

const DocumentList = ({ files, addDocument, removeDocument, isLoading }) => {
	const [fileError, setFileError] = useState();

	const upload = useCallback(
		(event) => {
			setFileError();
			const newFile = event.target.files[0];
			if (!newFile.type.match(imageMimeType)) {
				setFileError("Доступна загрузка только в pdf формате.");
				return;
			}
			if (newFile.size >= 15000000) {
				setFileError("Не удалось загрузить файл. Файл должен быть менее 15МБ.");
				return;
			}
			addDocument(newFile);
		},
		[addDocument]
	);

	const removeFile = useCallback(
		(id) => {
			removeDocument(id);
			setFileError();
		},
		[removeDocument]
	);

	return (
		<div className="special-menu__body">
			<div className="sNewPermit__upload-block">
				<h2>Добавленные файлы</h2>
				<div className="upload-field form-wrap__input-wrap form-group medium">
					{!isLoading && (
						<>
							<input
								className="form-wrap__file"
								name="file"
								type="file"
								id="upload-field"
								onChange={upload}
							/>
							<label className="upload-field__button" htmlFor="upload-field">
								<span>Выбрать и загрузить файл</span>
							</label>
						</>
					)}
					{isLoading && (
						<>
							<label className="upload-field__button" htmlFor="upload-field">
								<img src="/img/svg/wait2.svg" className="icon-wait" alt="" />
								<span>Файл загружается</span>
							</label>
						</>
					)}
				</div>
				{fileError && <div className="file-error">{fileError}</div>}
				{files?.map(({ id, file_name, file_size }) => (
					<div key={id} className="upload-file-wrap medium">
						<div className="upload-file-wrap__img">
							<img src="/img/svg/pdf.svg" alt="" />
						</div>
						<div className="upload-file-wrap__info">
							<div className="upload-file-wrap__title">{file_name}</div>
							<div className="upload-file-wrap__type">
								pdf {prettifySize(file_size)}
							</div>
						</div>
						<div
							className="upload-file-wrap__delete"
							onClick={() => removeFile(id)}
							title="Удалить"
						>
							<img src="/img/svg/cancel.svg" alt="" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(DocumentList);
