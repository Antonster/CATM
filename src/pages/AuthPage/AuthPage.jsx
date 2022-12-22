import { memo, useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import SystemInfoDialog from "./components/SystemInfoDialog";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import "./auth-page.css";

const schema = yup.object({
	login: yup.string().required(),
	password: yup.string().required(),
});

const AuthPage = () => {
	const dispatch = useDispatch();
	const authError = useSelector((state) => state.currentUser?.error);
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		mode: "onSubmit",
		reValidateMode: "onChange",
	});
	const [isSystemInfoDialog, setSystemInfoDialog] = useState(false);

	const onOpenSystemInfoDialog = useCallback(
		() => setSystemInfoDialog(true),
		[]
	);

	const onCloseSystemInfoDialog = useCallback(
		() => setSystemInfoDialog(false),
		[]
	);

	const onSubmit = useCallback(
		async ({ login, password }) => {
			try {
				dispatch({ type: "AUTH_BY_LOGIN", payload: { login, password } });
			} catch (e) {
				reset();
				console.log(e);
			}
		},
		[dispatch, reset]
	);

	useEffect(() => {
		if (authError) {
			setError("login", { type: "custom", message: "custom error" });
			setError("password", { type: "custom", message: "custom error" });
		}
	}, [authError]);

	return (
		<div className="main-wrapper">
			<SystemInfoDialog
				onCloseSystemInfoDialog={onCloseSystemInfoDialog}
				isSystemInfoDialog={isSystemInfoDialog}
			/>
			<div className="sLogin" id="sLogin">
				<div className="sLogin__wrap">
					<div className="form-wrap">
						<div className="sLogin__logo">
							<img src="/img/svg/logo.svg" alt="" />
						</div>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Input
								register={register("login")}
								placeholder="Логин"
								type="text"
								inputStyle="authInput"
							/>

							<Input
								register={register("password")}
								placeholder="Пароль"
								type="password"
								inputStyle="authInput"
							/>
							{(errors.login?.message || errors.password?.message) && (
								<span style={{ color: "var(--bs-danger)", fontSize: "12px" }}>
									Неверный E-mail или Пароль
								</span>
							)}
							<Button type="submit" title={"Войти"} buttonStyle={"warning"} />
						</form>
					</div>
					<div
						className="sLogin__about system-button"
						onClick={onOpenSystemInfoDialog}
					>
						О системе
					</div>
					<div className="sLogin__bg">
						<img src="/img/svg/login-bg.svg" alt="" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(AuthPage);
