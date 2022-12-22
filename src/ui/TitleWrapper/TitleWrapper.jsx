import { memo } from "react";

const TitleWrapper = ({ title, cb, cbTitle }) => {
	return (
		<div className="main-block-head">
			<h2>{title}</h2>
			{cb && (
				<button
					className="main-block-head__btn btn btn-outline-primary btn-with-icon"
					onClick={cb}
				>
					<img src="/img/svg/plus-outline.svg" alt="" />
					<span>{cbTitle}</span>
				</button>
			)}
		</div>
	);
};

export default memo(TitleWrapper);
