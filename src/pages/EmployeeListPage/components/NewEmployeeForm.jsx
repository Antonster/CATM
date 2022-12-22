import { memo, useState, useEffect, useCallback } from "react";
import usersService from "../../../services/users.service";
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NewEmployeeDataFields from "./NewEmployeeDataFields";
import FormBlock from "../../../ui/FormBlock/FormBlock";
import FormInput from "../../../ui/FormInputs/FormInput";
import FileUploader from "../../../ui/FormInputs/FileUploader";
import RemoveButton from "../../../ui/FormInputs/RemoveButton";
import CustomSelect from "../../../ui/CustomSelect/CustomSelect";
import FormFooter from "../../../ui/FormFooter/FormFooter";
import { dateMask } from "../../../assets/helper.funcs";

const schema = yup.object({
	username: yup
		.string()
		.required("Введите логин пользователя")
		.min(5, "Минимум 5 символов")
		.max(150, "Максимум 150 символов")
		.matches(/^[a-zA-Zа-яА-Я0-9.@+_-]+$/, "Содержит недопустимые символы"),
	password: yup
		.string()
		.required("Введите пароль")
		.min(8, "Минимум 8 символов")
		.max(128, "Максимум 128 символов"),
	last_name: yup
		.string()
		.required("Введите фамилию пользователя")
		.test("is-min-2", "Минимум 2 символа", (value) => value?.length >= 2),
	first_name: yup
		.string()
		.required("Введите имя пользователя")
		.test("is-min-2", "Минимум 2 символа", (value) => value?.length >= 2),
	middle_name: yup
		.string()
		.test(
			"is-min-2",
			"Минимум 2 символа",
			(value) => !value || value?.length >= 2
		),
	position: yup
		.string()
		.test(
			"is-min-2",
			"Минимум 2 символа",
			(value) => !value || value?.length >= 2
		),
	phone_number: yup
		.string()
		.test(
			"is-phone",
			"Введите корректный номер",
			(value) => !value || value?.length === 17
		),
	email: yup.string(),
	birthday: yup
		.string()
		.test(
			"is-date",
			"Введите корректную дату",
			(value) =>
				!value ||
				value?.match(
					/^((0[1-9]|[12][0-9]).02|(0[1-9]|[12][0-9]|30).(0[469]|11)|(0[1-9]|[12][0-9]|3[01]).(0[13578]|1[02])).\d{4}/
				)
		),
	medical_exam: yup.object().shape({
		number: yup.string(),
		expiration_date: yup
			.string()
			.test(
				"is-date",
				"Введите корректную дату",
				(value) =>
					!value ||
					value?.match(
						/^((0[1-9]|[12][0-9]).02|(0[1-9]|[12][0-9]|30).(0[469]|11)|(0[1-9]|[12][0-9]|3[01]).(0[13578]|1[02])).\d{4}/
					)
			),
		file: yup.string(),
		new_file_key: yup.string(),
	}),
	trainings: yup.array().of(
		yup.object().shape({
			itemId: yup.number(),
			category_id: yup.number().min(1, "Выберите категорию"),
			number: yup.string().required("Поле обязательно к заполнению"),
			expiration_date: yup
				.string()
				.required("Поле обязательно к заполнению")
				.test("is-date", "Введите корректную дату", (value) =>
					value?.match(
						/^((0[1-9]|[12][0-9]).02|(0[1-9]|[12][0-9]|30).(0[469]|11)|(0[1-9]|[12][0-9]|3[01]).(0[13578]|1[02])).\d{4}/
					)
				),
			file: yup.string().required("Загрузите документ").nullable(),
			new_file_key: yup.string(),
		})
	),
	protective_equipment_card: yup.object().shape({
		number: yup.string(),
		expiration_date: yup
			.string()
			.test(
				"is-date",
				"Введите корректную дату",
				(value) =>
					!value ||
					value?.match(
						/^((0[1-9]|[12][0-9]).02|(0[1-9]|[12][0-9]|30).(0[469]|11)|(0[1-9]|[12][0-9]|3[01]).(0[13578]|1[02])).\d{4}/
					)
			),
		file: yup.string(),
		new_file_key: yup.string(),
	}),
	tools: yup.array().of(
		yup.object().shape({
			title: yup.string().required("Введите название инструмента"),
		})
	),
});

const NewEmployeeForm = ({ closeFormHandle, getUsers }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [trainingCategories, setTrainingCategories] = useState([]);
	const [filesToUpload, setFilesToUpload] = useState([]);

	const { register, handleSubmit, setValue, control, formState } = useForm({
		resolver: yupResolver(schema),
	});
	const { errors } = formState;

	const {
		fields: toolsFields,
		append: toolsAppend,
		remove: toolsRemove,
	} = useFieldArray({ name: "tools", control });
	const {
		fields: trainingsFields,
		append: trainingsAppend,
		remove: trainingsRemove,
	} = useFieldArray({ name: "trainings", control });

	useEffect(() => {
		const fetchTrainingCats = async () => {
			setIsLoading(true);
			try {
				const trainingCatsRes = await usersService.getTrainingCategories();
				setTrainingCategories(trainingCatsRes.data);
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
			}
		};
		fetchTrainingCats();
	}, []);

	const removeTrainingHandle = useCallback(
		(e, i) => {
			e.preventDefault();
			trainingsRemove(i);
		},
		[trainingsRemove]
	);

	const addTrainingHandle = useCallback(
		(e) => {
			e.preventDefault();
			trainingsAppend({
				itemId: 0,
				category_id: 0,
				expiration_date: "",
				number: "",
				file: "",
			});
		},
		[trainingsAppend]
	);

	const removeToolHandle = useCallback(
		(e, i) => {
			e.preventDefault();
			toolsRemove(i);
		},
		[toolsRemove]
	);

	const addToolHandle = useCallback(
		(e) => {
			e.preventDefault();
			toolsAppend({ title: "" });
		},
		[toolsAppend]
	);

	const removeFileHandle = useCallback(
		(e, inputName) => {
			e.preventDefault();
			setValue(inputName, "");
			setFilesToUpload((prev) => {
				return prev.filter((file) => file.name !== inputName);
			});
		},
		[setValue]
	);

	const addFileHandle = useCallback(
		(e, inputName, fileNameKey) => {
			setValue(inputName, e.target.files[0].name);
			setValue(fileNameKey, inputName);
			setFilesToUpload((prev) => {
				const filteredFilesArr = prev.filter((file) => file.name !== inputName);
				return [
					...filteredFilesArr,
					{ name: inputName, file: e.target.files[0] },
				];
			});
		},
		[setValue]
	);

	const onSubmit = useCallback(
		async (data) => {
			let serializedData = {};

			for (const key in data) {
				if (data[key]) {
					serializedData = {
						...serializedData,
						[key]: data[key],
					};
				}
			}

			// если нет номера у СИЗ, он не отправляется на сервер.
			if (
				!data.protective_equipment_card.number ||
				!data.protective_equipment_card.expiration_date ||
				!data.protective_equipment_card.file
			) {
				delete serializedData.protective_equipment_card;
			}
			// если нет номера у медосмотра, он не отправляется на сервер.
			if (
				!data.medical_exam.number ||
				!data.medical_exam.expiration_date ||
				!data.medical_exam.file
			) {
				delete serializedData.medical_exam;
			}

			// Заменяем itemId на id
			if (data.trainings?.length) {
				serializedData.trainings = data.trainings.map((train) => {
					const newTrain = {
						...train,
						id: train.itemId,
					};
					delete newTrain.itemId;
					if (newTrain.id === 0) {
						delete newTrain.id;
					}
					return newTrain;
				});
			}

			if (data.birthday) {
				const [day, month, year] = data.birthday.split(".");
				serializedData.birthday = `${year}-${month}-${day}`;
			}

			const JSONUserData = JSON.stringify(serializedData);
			const formData = new FormData();
			formData.append("json_payload", JSONUserData);

			if (filesToUpload.length) {
				for (let i = 0; i < filesToUpload.length; i++) {
					formData.append(filesToUpload[i].name, filesToUpload[i].file);
				}
			}
			try {
				await usersService.createUser(formData);
				await getUsers();
				closeFormHandle();
			} catch (e) {
				console.log(e);
			}
		},
		[closeFormHandle, filesToUpload]
	);

	return (
		<div className="form-wrap">
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<form onSubmit={handleSubmit(onSubmit)}>
					<NewEmployeeDataFields
						register={register}
						errors={errors}
						setValue={setValue}
					/>

					<div className="special-menu__block">
						<h2>Документы</h2>

						<FormBlock
							setValue={setValue}
							title={"Медицинский осмотр"}
							register={register}
							control={control}
							formName={"medical_exam"}
							errors={errors}
							removeFileHandler={null}
							addFileHandler={addFileHandle}
						/>

						<div className="special-menu__mini-block">
							<h4>Обучение</h4>
							{trainingsFields.map((item, i) => {
								return (
									<div key={item.number + item.itemId}>
										<div className="special-menu__mini-block-wrap">
											<div className="special-menu__inputs">
												<CustomSelect
													title={"Название обучения"}
													control={control}
													regName={`trainings.${i}.category_id`}
													options={trainingCategories}
													errors={
														errors.trainings &&
														errors.trainings[i] &&
														errors.trainings[i].category_id
													}
												/>
											</div>
											<div className="form-input-remove__wrapper">
												<RemoveButton
													title={"Удалить"}
													cb={removeTrainingHandle}
													removeArg={i}
												/>
											</div>
										</div>
										<div className="special-menu__mini-block-wrap">
											<div className="special-menu__inputs">
												<div className="row">
													<input
														type={"hidden"}
														disabled
														{...register(`trainings.${i}.itemId`)}
													/>

													<FormInput
														register={register(`trainings.${i}.number`)}
														label={"Номер документа"}
														type="text"
														inputClasses="col-xxl-6"
														errors={
															errors.trainings &&
															errors.trainings[i] &&
															errors.trainings[i].number
														}
													/>
													<FormInput
														setValue={setValue}
														regName={`trainings.${i}.expiration_date`}
														maskFunction={dateMask}
														register={register(
															`trainings.${i}.expiration_date`
														)}
														label={"Действителен до:"}
														type="text"
														placeholder="ДД.ММ.ГГГГ"
														inputClasses="col-xxl-6"
														errors={
															errors.trainings &&
															errors.trainings[i] &&
															errors.trainings[i].expiration_date
														}
													/>
												</div>
											</div>
											<FileUploader
												idx={i}
												register={register}
												control={control}
												formName={`trainings.${i}`}
												addFileHandler={addFileHandle}
												errors={
													errors.trainings &&
													errors.trainings[i] &&
													errors.trainings[i].file
												}
											/>
										</div>
									</div>
								);
							})}
							<button
								className="special-menu__add-btn"
								onClick={addTrainingHandle}
							>
								<img src="/img/svg/plus-outline.svg" alt="" />
								<span>
									Добавить {trainingsFields.length ? "еще " : ""}обучение
								</span>
							</button>
						</div>

						<FormBlock
							setValue={setValue}
							title={"Личная карточка учета выдачи СИЗ"}
							register={register}
							control={control}
							formName={"protective_equipment_card"}
							errors={errors}
							removeFileHandler={removeFileHandle}
							addFileHandler={addFileHandle}
						/>

						<div className="special-menu__mini-block">
							<h4>Инструмент</h4>

							{toolsFields.map((item, i) => {
								return (
									<div
										key={"item.title" + i}
										className="special-menu__mini-block-wrap"
									>
										<div className="special-menu__inputs">
											<FormInput
												register={register(`tools.${i}.title`)}
												label={"Название инструмента"}
												type="text"
												inputClasses="col-xxl-6"
												errors={
													errors.tools &&
													errors.tools[i] &&
													errors.tools[i].title
												}
											/>
										</div>
										<div className="form-input-remove__wrapper">
											<RemoveButton
												title={"Удалить"}
												cb={removeToolHandle}
												removeArg={i}
											/>
										</div>
									</div>
								);
							})}
							<button
								onClick={(e) => addToolHandle(e)}
								className="special-menu__add-btn"
							>
								<img src="/img/svg/plus-outline.svg" alt="" />
								<span>Добавить еще инструмент</span>
							</button>
						</div>
					</div>

					<FormFooter closeFormHandle={closeFormHandle} />
				</form>
			)}
		</div>
	);
};

export default memo(NewEmployeeForm);
