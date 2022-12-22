import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import AnalyzesItem from "./AnalyzesItem";

const AnalyzesCard = ({ analyzes, removeAnalyze }) => {
	return (
		<>
			{analyzes && (
				<Swiper className="card-employee-slider" slidesPerView="auto">
					{analyzes.map(
						({
							id,
							components,
							concentration,
							date,
							date_next,
							device_model,
							device_number,
							place,
							result,
							time,
							user,
						}) => (
							<SwiperSlide key={id} className="card-employee-slider__item">
								<AnalyzesItem
									key={id}
									{...{
										id,
										components,
										concentration,
										date,
										date_next,
										device_model,
										device_number,
										place,
										result,
										time,
										user,
										removeAnalyze,
									}}
								/>
							</SwiperSlide>
						)
					)}
				</Swiper>
			)}
		</>
	);
};

export default memo(AnalyzesCard);
