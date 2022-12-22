import { memo } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../../../ui/Avatar/Avatar";
import { relativeUrlResolver } from "../../../assets/helper.funcs";

const EmployeePersonBlock = ({
	firstName,
	lastName,
	position,
	image,
	phone,
	unit,
}) => {
	const navigate = useNavigate();

	return (
		<div className="person-block person-block--bg">
			<span onClick={() => navigate(-1)} className="prev-btn">
				<svg className="icon icon-arrow ">
					<use href="/img/svg/sprite.svg#arrow" />
				</svg>
				<span>Назад</span>
			</span>
			<Avatar
				firstName={firstName}
				lastName={lastName}
				image={relativeUrlResolver(image)}
			/>
			<div className="person-block__name-wrapper">
				<div className="person-block__name">{firstName}</div>
				<div className="person-block__name">{lastName}</div>
			</div>
			<p>{position}</p>
			<div className={"person-block__division"}>{unit?.title}</div>
			{phone && phone !== "+7 " && (
				<div className={"person-block__tel"}>{phone}</div>
			)}
		</div>
	);
};

export default memo(EmployeePersonBlock);
