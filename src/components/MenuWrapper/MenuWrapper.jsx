import { memo } from "react";
import { Outlet } from "react-router-dom";
import TopHat from "./TopHat";
import LeftMenu from "./LeftMenu";

const MenuWrapper = () => {
	return (
		<div className="main-wrapper">
			<TopHat />
			<div className="sMainBlock" id="sMainBlock">
				<LeftMenu />
				<Outlet />
			</div>
		</div>
	);
};

export default memo(MenuWrapper);
