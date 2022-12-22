import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import usersService from "../../services/users.service";
import EmployeePersonBlock from "./components/EmployeePersonBlock";
import ProfileDataTable from "../MyProfilePage/components/ProfileDataTable";
import ModalWide from "../../ui/ModalWide/ModalWide";
import ProfileEditForm from "./ProfileEditForm/ProfileEditForm";
import TitleWrapper from "../../ui/TitleWrapper/TitleWrapper";
import { phoneMask } from "../../assets/helper.funcs";
import "../MyProfilePage/index-page.css";
import "./employee-info-page.css";

const EmployeeInfoPage = () => {
	const { id } = useParams();
	const role = localStorage.getItem("role");
	const [isLoading, setIsLoading] = useState(true);
	const [myUserInfo, setMyUserInfo] = useState(null);
	const [isEditFormShown, setIsEditFormShown] = useState(false);

	useEffect(() => {
		const fetchUserById = async () => {
			try {
				const res = await usersService.getUserById(id);
				setMyUserInfo(res.data);
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
			}
		};
		fetchUserById();
	}, [id]);

	return (
		<div className="sEmployeeProfile">
			<TitleWrapper title={"Работники"} />
			<div className="sProfile" id="sProfile">
				{isLoading ? (
					<span>Loading...</span>
				) : (
					<>
						<EmployeePersonBlock
							firstName={myUserInfo?.first_name}
							lastName={myUserInfo?.last_name}
							image={myUserInfo?.avatar}
							position={myUserInfo?.position}
							unit={myUserInfo?.unit}
							qrCode={myUserInfo?.qr_code}
							phone={phoneMask(myUserInfo?.phone_number)}
						/>

						<div className="person-documents">
							<div className="person-documents__head">
								<h2>Документы</h2>
								{role === "director" && (
									<span
										onClick={() => setIsEditFormShown(true)}
										className={"user-edit__wrapper"}
									>
										<img
											src={"/img/svg/edit.svg"}
											alt={"edit user"}
											className={"user-edit-icon"}
										/>
										Редактировать
									</span>
								)}
							</div>
							<ProfileDataTable myUserInfo={myUserInfo} />
						</div>
					</>
				)}

				{isEditFormShown && (
					<ModalWide
						header={"Редактирование пользователя"}
						setIsVisible={setIsEditFormShown}
					>
						<ProfileEditForm
							userData={myUserInfo}
							closeFormHandle={() => setIsEditFormShown(false)}
							setMyUserInfo={setMyUserInfo}
						/>
					</ModalWide>
				)}
			</div>
		</div>
	);
};

export default memo(EmployeeInfoPage);
