import { memo } from "react";

const Separator = ({ onClose }) => {
	return (
		<div className="special-menu__btn-wrap">
			<div className="prev-btn" onClick={() => onClose(false)}>
				<svg className="icon icon-arrow ">
					<use href="/img/svg/sprite.svg#arrow"></use>
				</svg>
			</div>
		</div>
	);
};

export default memo(Separator);
