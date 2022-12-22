import { memo, useState, useCallback } from "react";
import { prettifySize } from "../../../../assets/helper.funcs";

const imageMimeType = /application\/(pdf)/i;

const BriefingTab = ({ register, setValue, setFile, file }) => {
	const [fileError, setFileError] = useState(false);

	const upload = useCallback(
		(event) => {
			setFileError(false);
			const newFile = event.target.files[0];
			if (!newFile.type.match(imageMimeType)) {
				setFileError("Доступна загрузка только в pdf формате.");
				return;
			}
			if (newFile.size >= 15000000) {
				setFileError("Не удалось загрузить файл. Файл должен быть менее 15МБ.");
				return;
			}
			register("briefing_file");
			setValue("briefing_file", newFile);
			setFile(newFile);
		},
		[register, setFile, setValue]
	);

	const removeFile = useCallback(() => {
		setValue("briefing_file", "");
		setFile({});
	}, [setFile, setValue]);

	return (
		<div className="special-menu__body">
			<div className="sNewPermit__upload-block">
				<h2>Добавить инструктаж</h2>
				<p>
					Выберите и загрузите файл инструктажа для отправки работникам, которые
					будут участвовать в наряд-допуске{" "}
				</p>
				<div className="upload-field form-wrap__input-wrap form-group small">
					{!file?.name && (
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
					{file?.name && (
						<div className="upload-file-wrap small">
							<div className="upload-file-wrap__img">
								<img src="/img/svg/pdf.svg" alt="" />
							</div>
							<div className="upload-file-wrap__info">
								<div className="upload-file-wrap__title">{file.name}</div>
								<div className="upload-file-wrap__type">
									pdf {prettifySize(file.size)}
								</div>
							</div>
							<div
								className="upload-file-wrap__delete"
								onClick={removeFile}
								title="Удалить"
							>
								<img src="/img/svg/cancel.svg" alt="" />
							</div>
						</div>
					)}
				</div>
				{fileError && <div className="file-error">{fileError}</div>}
			</div>
		</div>
	);
};

export default memo(BriefingTab);
