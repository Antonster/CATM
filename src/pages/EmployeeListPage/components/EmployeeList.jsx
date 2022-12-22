import { memo, Fragment } from "react";
import { NavLink } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "../../../ui/Avatar/Avatar";
import { isDatePassed } from "../../../assets/helper.funcs";
import "../employee-page.css";

const EmployeeList = ({ employeeList }) => {
	return (
		<>
			{employeeList.map(
				({
					id,
					first_name,
					last_name,
					avatar,
					unit,
					position,
					medical_exam,
					briefing,
				}) => {
					return (
						<Fragment key={id}>
							<div className="employee-list__item">
								<Avatar
									{...{
										firstName: first_name,
										lastName: last_name,
										image: avatar,
										size: "small",
									}}
								/>
								<NavLink
									to={`/employee/${id}`}
									className="employee-list-item__name"
								>
									{last_name + " " + first_name}
								</NavLink>
							</div>
							<div className="employee-list__item">{unit?.title}</div>
							<div className="employee-list__item">{position}</div>
							<div className="employee-list__item employee-list-center">
								{!isDatePassed(medical_exam?.expiration_date) ? (
									<img src="/img/svg/ok.svg" alt="" />
								) : (
									<Tooltip
										arrow
										placement="top-start"
										title={
											<div className="employee-permit__health-tooltip">
												Необходимо пройти медосмотр
											</div>
										}
									>
										<img src="/img/svg/cancel.svg" alt="" />
									</Tooltip>
								)}
							</div>
							<div className="employee-list__item employee-list-center">
								{briefing?.passed ? (
									<img src="/img/svg/ok.svg" alt="" />
								) : (
									<Tooltip
										arrow
										placement="top-start"
										title={
											<div className="employee-permit__health-tooltip">
												Необходимо пройти инструктаж
											</div>
										}
									>
										<img src="/img/svg/cancel.svg" alt="" />
									</Tooltip>
								)}
							</div>
						</Fragment>
					);
				}
			)}
		</>
	);
};

export default memo(EmployeeList);
