import { memo, useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import Cropper from "react-cropper";
import usersService from "../../services/users.service";
import "cropperjs/dist/cropper.css";
import "./editor.css";

const ImageEditor = ({ header, sourceImage, changeHandle, setIsVisible }) => {
	const dispatch = useDispatch();
	const [image, setImage] = useState(sourceImage);
	const [imageName, setImageName] = useState("");
	const [imageType, setImageType] = useState("image/png");
	const [cropper, setCropper] = useState();

	const handleChange = useCallback((e) => {
		e.preventDefault();
		let files;
		if (e.dataTransfer) {
			files = e.dataTransfer.files;
		} else if (e.target) {
			files = e.target.files;
		}
		const reader = new FileReader();
		reader.onload = () => {
			setImage(reader.result);
			setImageName(files[0].name);
			setImageType(files[0].type);
		};
		reader.readAsDataURL(files[0]);
	}, []);

	const getCropData = useCallback(() => {
		if (typeof cropper !== "undefined") {
			changeHandle(cropper.getCroppedCanvas().toDataURL(), imageName);
			setIsVisible(false);
		}
	}, [changeHandle, cropper, imageName, setIsVisible]);

	const handleDelete = useCallback(
		async (e) => {
			e.stopPropagation();
			try {
				await usersService.deleteUsersAvatar();
				if (typeof cropper !== "undefined") {
					dispatch({ type: "CHANGE_USER_AVATAR", payload: "" });
					setImage("");
				}
			} catch (e) {
				console.log(e);
			}
		},
		[cropper, dispatch]
	);

	const handleClose = (e) => {
		e.stopPropagation();
		setIsVisible(false);
	};

	useEffect(() => {
		document.body.classList.add("fixed");
		return () => {
			document.body.classList.remove("fixed");
		};
	}, []);

	return (
		<div className="sProfileChangePhoto">
			<div className="sProfileChangePhoto__head">
				<h3>{header}</h3>
				<div className="sProfileChangePhoto__btns">
					{image && (
						<button
							className="sProfileChangePhoto__delete btn"
							onMouseDown={handleDelete}
						>
							Удалить фото
						</button>
					)}
					{!image && (
						<>
							<input
								type="file"
								id="upload-avatar"
								className={"upload-avatar-file"}
								onChange={handleChange}
							/>
							<label
								htmlFor="upload-avatar"
								className={"sProfileChangePhoto__delete"}
							>
								<span className={"sProfileChangePhoto__pointer"}>
									Загрузить
								</span>
							</label>
						</>
					)}

					<button
						className="sProfileChangePhoto__cancel btn"
						onMouseDown={handleClose}
					>
						Отмена
					</button>
					<button
						className="sProfileChangePhoto__confirm btn"
						onMouseDown={getCropData}
					>
						Применить
					</button>
				</div>
			</div>
			<div className="sProfileChangePhoto__field image-editor">
				<Cropper
					src={image}
					viewMode={1}
					minCropBoxHeight={100}
					minCropBoxWidth={100}
					background={true}
					responsive={true}
					checkOrientation={false}
					onInitialized={(instance) => {
						setCropper(instance);
					}}
					guides={true}
					movable={false}
					rotatable={false}
					scalable={false}
					zoomable={false}
					style={{ height: 634, width: "100%" }}
				/>
			</div>
		</div>
	);
};

export default memo(ImageEditor);
