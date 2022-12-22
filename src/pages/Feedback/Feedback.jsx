import { memo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TitleWrapper from "../../ui/TitleWrapper/TitleWrapper";
import Input from "../../ui/Input/Input";
import Textarea from "../../ui/Textarea/Textarea";
import ConfirmationPopup from "./components/ConfirmationPopup";
import feedbackService from "../../services/feedback.service";
import * as yup from "yup";
import "./feedback.css";

const Feedback = () => {
	const schema = yup.object({
		theme_name: yup.string().required("Поле обязательно к заполнению"),
		email: yup
			.string()
			.email("Введите правильный адрес электронной почты")
			.required("Поле обязательно к заполнению"),
		message: yup.string().required("Поле обязательно к заполнению"),
	});
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		mode: "onSubmit",
		reValidateMode: "onChange",
	});
	const [isConfirmationPopup, setConfirmationPopup] = useState(false);

	const onOpenConfirmationPopup = useCallback(() => {
		setConfirmationPopup(true);
	}, []);

	const onCloseConfirmationPopup = useCallback(() => {
		setConfirmationPopup(false);
	}, []);

	const onPostFeedback = useCallback(
		async (formData) => {
			try {
				await feedbackService.postFeedback(formData);
				onOpenConfirmationPopup();
			} catch (e) {
				console.log(e);
			} finally {
				reset({
					theme_name: "",
					email: "",
					message: "",
				});
			}
		},
		[onOpenConfirmationPopup, reset]
	);

	return (
		<div className="feedback-wrapper">
			<ConfirmationPopup
				onCloseConfirmationPopup={onCloseConfirmationPopup}
				isConfirmationPopup={isConfirmationPopup}
			/>
			<TitleWrapper title={"Обратная связь"} />
			<form className="feedback-form">
				<div className="feedback-form-wrapper">
					<div className="feedback-left-part">
						<div className="form-group">
							<label>
								<span className="form-wrap__input-title">Тема обращения</span>
							</label>
							<Input
								{...{
									register: register("theme_name"),
									placeholder: "Введите",
									type: "text",
									inputStyle: "authInput",
									errorIndication: !!errors["theme_name"],
								}}
							/>
							{errors["theme_name"] && (
								<div className="input-error">
									{errors["theme_name"].message}
								</div>
							)}
						</div>
						<div className="form-group">
							<label>
								<span className="form-wrap__input-title">Ваш e-mail</span>
							</label>
							<Input
								{...{
									register: register("email"),
									placeholder: "Введите",
									type: "text",
									inputStyle: "authInput",
									errorIndication: !!errors["email"],
								}}
							/>
							{errors["email"] && (
								<div className="input-error">{errors["email"].message}</div>
							)}
						</div>
					</div>
					<div className="feedback-right-part">
						<div className="form-group">
							<label>
								<span className="form-wrap__input-title">Содержание</span>
							</label>
							<Textarea
								{...{
									register: register("message"),
									placeholder: "Введите",
									rows: 6,
									errorIndication: !!errors["message"],
								}}
							/>
							{errors["message"] && (
								<div className="input-error">{errors["message"].message}</div>
							)}
						</div>
					</div>
				</div>
				<button
					className="btn btn-primary"
					type="submit"
					onClick={handleSubmit(onPostFeedback)}
				>
					Отправить
				</button>
			</form>
		</div>
	);
};

export default memo(Feedback);
