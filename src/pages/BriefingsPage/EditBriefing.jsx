import { memo, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { prettifySize } from "../../assets/helper.funcs";
import { briefingsActions } from "../../store/actions";
import Input from "../../ui/Input/Input";
import CustomSelect from "../../ui/CustomSelect/CustomSelect";
import Editor from "./components/Editor";
import CreatorFooterPanel from "./components/CreatorFooterPanel";

const EditBriefing = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.currentUser?.user);
	const briefingsCategories = useSelector(
		(state) => state.briefings?.categories
	);
	const briefingsTypes = useSelector((state) => state.briefings?.types);
	const activeBriefing = useSelector(
		(state) => state.briefings?.activeBriefing
	);
	const { register, reset, setValue, handleSubmit, getValues, control, watch } =
		useForm({
			mode: "onChange",
			defaultValues: {
				instructing_user: "",
				title: "",
				reason: "",
				type: "",
				category: "",
				content: "<p><br></p>",
				delta: { ops: [{ insert: "\n" }] },
				file: "",
			},
		});
	const watchFields = watch();
	const imageMimeType = /application\/(pdf)/i;
	const [isValid, setValid] = useState(false);
	const [fileError, setFileError] = useState(false);
	const [downloadedFile, setDownloadedFile] = useState();

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
			register("file");
			setValue("file", newFile);
		},
		[imageMimeType, register, setValue]
	);

	const removeFile = useCallback(() => {
		setValue("file", "");
		setDownloadedFile(null);
	}, [setValue]);

	const onSubmit = useCallback(
		async (formData) => {
			const data = new FormData();
			for (const key in formData) {
				if (key === "content") {
					data.append(key, JSON.stringify(formData["content"]));
				} else if (key === "delta") {
					data.append(key, JSON.stringify(formData["delta"]));
				} else if (key === "file") {
					if (formData[key]) {
						data.append(key, formData[key]);
					} else if (downloadedFile) {
						continue;
					} else {
						data.append("file_delete", "1");
					}
				} else if (formData[key]) {
					data.append(key, formData[key]);
				}
			}
			if (id) {
				dispatch(briefingsActions.patchBriefing(id, data, navigate));
			} else {
				dispatch(briefingsActions.addBriefing(data, navigate));
			}
			reset({
				instructing_user: "",
				title: "",
				reason: "",
				type: "",
				category: "",
				content: "<p><br></p>",
				delta: { ops: [{ insert: "\n" }] },
				file: "",
			});
		},
		[dispatch, downloadedFile, id, navigate, reset]
	);

	useEffect(() => {
		if (id) {
			if (
				getValues("title") &&
				getValues("type") &&
				getValues("category") &&
				currentUser?.id === activeBriefing?.instructing_user
			) {
				setValid(true);
			} else {
				setValid(false);
			}
		} else {
			if (getValues("title") && getValues("type") && getValues("category")) {
				setValid(true);
			} else {
				setValid(false);
			}
		}
	}, [watchFields]);

	useEffect(() => {
		if (currentUser) {
			setValue("instructing_user", currentUser.id);
		}
	}, [currentUser]);

	useEffect(() => {
		if (id) {
			dispatch(briefingsActions.fetchBriefingById(id));

			return () => dispatch(briefingsActions.setActiveBriefing(null));
		}
	}, [id]);

	useEffect(() => {
		if (activeBriefing) {
			setValue("title", activeBriefing.title);
			setValue("reason", activeBriefing.reason);
			setValue("type", activeBriefing.type);
			setValue("category", activeBriefing.category);
			setValue("content", activeBriefing.content || "<p><br></p>");

			setDownloadedFile({
				file: activeBriefing.file,
				name: activeBriefing.file_name,
				size: activeBriefing.file_size,
			});
		}
	}, [activeBriefing]);

	return (
		<div className="briefing-creation">
			<div className="prev-btn" onClick={() => navigate("/briefings/creator")}>
				<svg className="icon icon-arrow ">
					<use href="/img/svg/sprite.svg#arrow"></use>
				</svg>
				<span>Назад</span>
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="briefing-creation-wrapper"
			>
				<div className="briefing-creation-fields-left-wrapper">
					<div className="form-group">
						<label>
							<span className="form-wrap__input-title">
								Название инструктажа
							</span>
						</label>
						<Input
							{...{
								register: register("title"),
								placeholder: "Введите",
								type: "text",
								inputStyle: "authInput",
							}}
						/>
					</div>
					<CustomSelect
						{...{
							title: "Категория инструктажа",
							control,
							regName: "category",
							options:
								briefingsCategories?.map(({ id, value }) => ({
									title: value,
									id,
								})) || [],
							disabled: !!id,
						}}
					/>
					<CustomSelect
						{...{
							title: "Вид инструктажа",
							control,
							regName: "type",
							options:
								briefingsTypes?.map(({ id, value }) => ({
									title: value,
									id,
								})) || [],
							disabled: !!id,
						}}
					/>
					<div className="upload-block">
						<p>
							Выберите и загрузите файл инструктажа для отправки работникам,
							которые будут участвовать в наряд-допуске
						</p>
						<div className="upload-field form-wrap__input-wrap form-group small">
							{!getValues("file")?.name && !downloadedFile?.name && (
								<>
									<input
										className="form-wrap__file"
										name="file"
										type="file"
										id="upload-field"
										onChange={upload}
									/>
									<label
										className="upload-field__button"
										htmlFor="upload-field"
									>
										<span>Выбрать и загрузить файл</span>
									</label>
								</>
							)}
							{downloadedFile?.name && (
								<div className="upload-file-wrap small">
									<div className="upload-file-wrap__img">
										<img src="/img/svg/pdf.svg" alt="" />
									</div>
									<div className="upload-file-wrap__info">
										<div className="upload-file-wrap__title">
											{downloadedFile.name}
										</div>
										<div className="upload-file-wrap__type">
											pdf {prettifySize(downloadedFile.size)}
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
							{getValues("file")?.name && (
								<div className="upload-file-wrap small">
									<div className="upload-file-wrap__img">
										<img src="/img/svg/pdf.svg" alt="" />
									</div>
									<div className="upload-file-wrap__info">
										<div className="upload-file-wrap__title">
											{getValues("file").name}
										</div>
										<div className="upload-file-wrap__type">
											pdf {prettifySize(getValues("file").size)}
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
					</div>
					{fileError && <div className="file-error">{fileError}</div>}
				</div>
				<div className="briefing-creation-fields-right-wrapper">
					<div className="form-group">
						<label>
							<span className="form-wrap__input-title">
								Причина проведения инструктажа
							</span>
						</label>
						<Input
							{...{
								register: register("reason"),
								placeholder: "Введите",
								type: "text",
								inputStyle: "authInput",
							}}
						/>
					</div>
					<div className="form-group">
						<div>
							<span className="form-wrap__input-title">Содержание</span>
						</div>
						<Editor
							{...{
								setValue,
								getValues,
							}}
						/>
					</div>
				</div>
				<CreatorFooterPanel
					{...{
						id,
						isValid,
					}}
				/>
			</form>
		</div>
	);
};

export default memo(EditBriefing);
