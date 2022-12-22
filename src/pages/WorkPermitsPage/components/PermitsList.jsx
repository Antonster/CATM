import { memo } from "react";
import Permit from "./Permit";

const PermitsList = ({ permitsList }) => {
	return (
		<div className="employee-block__list-body">
			{permitsList.map((permit) => {
				return <Permit permit={permit} key={"permit" + permit.id}></Permit>;
			})}
		</div>
	);
};
export default memo(PermitsList);
