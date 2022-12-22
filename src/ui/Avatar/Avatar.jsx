import { memo, useCallback } from "react";
import "./avatar.css";

const Avatar = ({ firstName, lastName, image, size = "large" }) => {
	const setSize = useCallback(() => {
		switch (size) {
			case "medium":
				return "person-block__avatar-medium";
			case "small":
				return "person-block__avatar-small";
			case "xs":
				return "person-block__avatar-xs";
			default:
				return "";
		}
	}, [size]);

	return (
		<div className={`person-block__avatar ${setSize()}`}>
			{image ? (
				<picture>
					<source type="image/webp" srcSet={image} />
					<img src={image} alt="" />
				</picture>
			) : (
				<div className="avatar-name">
					{firstName?.charAt(0)}
					{lastName?.charAt(0)}
				</div>
			)}
		</div>
	);
};

export default memo(Avatar);
