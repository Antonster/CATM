import { memo } from "react";
import { NavLink } from "react-router-dom";

const WrongPermit = () => {
	return (
		<div className="sInWork" id="sInWork">
			<div className="sInWork__content">
				<div className="sInWork__pic">
					<img src="/img/svg/wrong-page.svg" alt="" />
				</div>
				<h2>Что-то пошло не так</h2>
				<NavLink className="sInWork__link" to="/work-permits">
					В раздел Наряд-допуски
				</NavLink>
			</div>
		</div>
	);
};

export default memo(WrongPermit);
