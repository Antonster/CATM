import { memo, useState, useCallback } from "react";
import { useWatch } from "react-hook-form";
import ErrorWrapper from "../ErrorWrapper/ErrorWrapper";

const FileUploader = ({
	register,
	control,
	formName,
	addFileHandler,
	removeFileHandler = null,
	errors,
}) => {
	const fileName = useWatch({
		control,
		name: `${formName}.file`,
	});

	const [initFileName, setInitFileName] = useState(fileName);
	const [buttonWord, setButtonWord] = useState(null);

	const onChangeHandle = useCallback(
		(e) => {
			addFileHandler(e, `${formName}.file`, `${formName}.new_file_key`);
			setInitFileName(null);
			setButtonWord(true);
		},
		[addFileHandler, formName]
	);

	const onRemoveHandle = useCallback(
		(e, inputName) => {
			removeFileHandler(e, inputName);
			setButtonWord(false);
		},
		[removeFileHandler]
	);

	return (
		<div className="special-menu__file-wrap">
			<div className={"file-uploader__wrapper"}>
				<div className={"file-uploader-inputs__wrapper"}>
					<div className="input-file form-wrap__input-wrap form-group">
						<span className="form-wrap__input-title">
							Подтверждающий документ
						</span>
						<input
							className="form-wrap__file"
							type="file"
							id={`${formName}`}
							onChange={onChangeHandle}
						/>
						<label className="input__file-button" htmlFor={`${formName}`}>
							<span className="input-file__button">
								{!initFileName && !buttonWord ? "Загрузить" : "Изменить"}
							</span>
						</label>
					</div>

					<div className="input-file__file">
						<div
							className={`input-file__file-info ${initFileName && "d-none"}`}
						>
							<div className="input-file__file-name">
								<input
									className={"input-file-info__name"}
									type="text"
									disabled
									name={`${formName}.file`}
									{...register(`${formName}.file`)}
								/>
							</div>

							<div className="input-file__file-size d-none">- mb</div>
						</div>

						{initFileName && (
							<a
								className={"init-file-info__wrapper"}
								href={initFileName}
								target="_blank"
								rel="noreferrer"
							>
								<img
									src="/img/svg/pdf-icon.svg"
									style={{ marginRight: "10px" }}
									alt="Скачать документ"
								/>
								<span>Скачать документ</span>
							</a>
						)}

						{removeFileHandler && buttonWord && !initFileName && (
							<button
								onClick={(e) => onRemoveHandle(e, `${formName}.file`)}
								className="input-file__file-delete"
							>
								<img src="/img/svg/cancel.svg" alt="" />
							</button>
						)}
					</div>
				</div>

				<ErrorWrapper errors={errors} />
			</div>
		</div>
	);
};

export default memo(FileUploader);
