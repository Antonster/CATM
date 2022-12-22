import { memo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import Avatar from "../../../ui/Avatar/Avatar";
import { relativeUrlResolver } from "../../../assets/helper.funcs";
import ImageEditor from "../../../ui/ImageEditor/ImageEditor";

const PersonBlock = ({ firstName, lastName, position, image, phone, unit }) => {
	const dispatch = useDispatch();
	const [isShowDialog, setIsShowDialog] = useState(false);

	const avatarChangeHandle = useCallback(
		async (url, name) => {
			fetch(url)
				.then((res) => res.blob())
				.then((blob) => {
					const file = new File([blob], name, { type: "image/png" });
					const formData = new FormData();
					formData.append("avatar", file);
					dispatch({ type: "CHANGE_USER_AVATAR", payload: formData });
				});
		},
		[dispatch]
	);

	const apiUrl = process.env.REACT_APP_API_URL;

	return (
		<>
			{isShowDialog && (
				<ImageEditor
					header={"Обрежьте фотографию"}
					sourceImage={image}
					changeHandle={avatarChangeHandle}
					setIsVisible={setIsShowDialog}
				></ImageEditor>
			)}
			<div className="person-block">
				<Avatar
					firstName={firstName}
					lastName={lastName}
					image={relativeUrlResolver(image)}
				/>
				<label className={"upload-avatar-label"}>
					<span
						className="person-block__change"
						onClick={() => {
							setIsShowDialog(true);
						}}
					>
						Изменить фото
					</span>
				</label>
				<div className="person-block__name-wrapper">
					<div className="person-block__name">{firstName}</div>
					<div className="person-block__name">{lastName}</div>
				</div>
				<p>{position}</p>
				<div className="person-block__division">{unit?.title}</div>
				{phone && phone !== "+7 " && (
					<div className={"person-block__tel"}>{phone}</div>
				)}
				<span
					onClick={() => dispatch({ type: "LOG_OUT" })}
					className="person-block__change"
				>
					Выйти из профиля
				</span>
				<div className="person-block__qr">
					<img src={`${apiUrl}/users/qr`} alt={"qrCode"} />
				</div>
			</div>
		</>
	);
};

export default memo(PersonBlock);
