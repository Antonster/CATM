import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import DailyPermitItem from "./DailyPermitItem";

const DailyPermitCard = ({
	removeDailyPermit,
	daily_permits,
	signDailyPermit,
	closeDailyPermit,
}) => {
	return (
		<>
			{daily_permits && (
				<Swiper className="card-employee-slider" slidesPerView="auto">
					{daily_permits.map(({ id, date_start, date_end, signers }) => (
						<SwiperSlide key={id} className="card-employee-slider__item">
							<DailyPermitItem
								{...{
									removeDailyPermit,
									signDailyPermit,
									closeDailyPermit,
									id,
									date_start,
									date_end,
									responsible_manager: signers.find(
										({ role }) => role === "responsible_manager"
									),
									permitter: signers.find(({ role }) => role === "permitter"),
								}}
							/>
						</SwiperSlide>
					))}
				</Swiper>
			)}
		</>
	);
};

export default memo(DailyPermitCard);
