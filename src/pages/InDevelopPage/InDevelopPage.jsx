import { memo } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const InDevelopPage = () => {
	const navigate = useNavigate();

	return (
		<div className="sInWork" id="sInWork">
			<div className="sInWork__content">
				<div className="sInWork__pic">
					<img src="/img/svg/in-work.svg" alt="" />
				</div>
				<h2>Данный раздел находится в разработке</h2>
				<span className="sInWork__link" onClick={() => navigate(-1)}>
					Назад
				</span>
				<NavLink className="sInWork__link" to={"/"}>
					На главную
				</NavLink>
			</div>
		</div>
	);
};

export default memo(InDevelopPage);
