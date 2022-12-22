import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "./tabs.css";

const Tabs = ({ value, options = [], cb }) => {
	return (
		<Swiper className="tabs-row tabs__caption" slidesPerView="auto">
			<div className="swiper-wrapper">
				{options.map((option) => (
					<SwiperSlide
						onClick={() => cb(option.title)}
						key={option.value}
						className={`tabs-row__item tabs__btn tabs-slide ${
							value === option.value || (!value && option.value === "all")
								? "active"
								: ""
						} ${option.disabled ? "disabled" : ""}`}
					>
						{option.title}
					</SwiperSlide>
				))}
			</div>
		</Swiper>
	);
};

export default memo(Tabs);
