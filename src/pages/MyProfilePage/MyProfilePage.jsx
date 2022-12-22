import { memo } from "react";
import { useSelector } from "react-redux";
import PersonBlock from "./components/PersonBlock";
import ProfileDataTable from "./components/ProfileDataTable";
import { phoneMask } from "../../assets/helper.funcs";
import "./index-page.css";

const IndexPage = () => {
	const isLoading = useSelector((state) => state.currentUser.isLoading);
	const myUserInfo = useSelector((state) => state.currentUser.user);

	return (
		<div className="sProfile" id="sProfile">
			{isLoading ? (
				<span>Loading...</span>
			) : (
				<>
					<PersonBlock
						firstName={myUserInfo?.first_name}
						lastName={myUserInfo?.last_name}
						image={myUserInfo?.avatar}
						position={myUserInfo?.position}
						unit={myUserInfo?.unit}
						phone={phoneMask(myUserInfo?.phone_number)}
					/>

					<div className="person-documents">
						<div className="person-documents__head">
							<h2>Документы</h2>
						</div>
						<ProfileDataTable myUserInfo={myUserInfo} />
					</div>
				</>
			)}
		</div>
	);
};

export default memo(IndexPage);
