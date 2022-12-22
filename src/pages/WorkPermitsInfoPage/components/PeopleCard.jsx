import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "../../../ui/Avatar/Avatar";

const PeopleCard = ({ people, menuName }) => {
	return (
		<>
			{people && (
				<Swiper className="card-employee-slider" slidesPerView="auto">
					{people.map(
						({
							user: { id, avatar, first_name, last_name, position },
							signed,
							replacement_to,
							role_label,
							role,
						}) => (
							<SwiperSlide
								key={id + (role || "")}
								className="card-employee-slider__item"
							>
								<div
									className={`card-employee-slider__card ${
										replacement_to ? "disabled-wrapper" : ""
									}`}
								>
									<Avatar
										{...{
											firstName: first_name,
											lastName: last_name,
											image: avatar,
											size: "medium",
										}}
									/>
									<div className="card-employee-slider__item-info">
										<div className="card-employee-slider__name">
											{first_name} {last_name}
										</div>
										<div className="card-employee-slider__job">{position}</div>
									</div>
									<div className="card-employee-slider__item-status">
										{signed && <img src="/img/svg/ok.svg" alt="" />}
										{(signed == null ||
											(signed === false && menuName === "employeesMenu")) && (
											<img src="/img/svg/cancel.svg" alt="" />
										)}
										{signed === false && menuName !== "employeesMenu" && (
											<Tooltip
												arrow
												placement="top-start"
												title={
													<div className="employee-permit__health-tooltip">
														Отклонено
													</div>
												}
											>
												<img src="/img/svg/warning.svg" alt="" />
											</Tooltip>
										)}
									</div>
								</div>
								{role_label && (
									<div className="card-employee-slider__caption">
										{role_label}
									</div>
								)}
							</SwiperSlide>
						)
					)}
				</Swiper>
			)}
		</>
	);
};

export default memo(PeopleCard);
