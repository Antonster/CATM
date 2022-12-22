import { memo } from "react";
import { useNavigate } from "react-router-dom";

const CreatorFooterPanel = ({ id, isValid }) => {
	const navigate = useNavigate();

	return (
		<div className="special-menu__footer">
			<button
				className="btn btn-outline-primary"
				onClick={() => navigate("/briefings/creator")}
			>
				Отмена
			</button>
			<button className="btn btn-primary" type="submit" disabled={!isValid}>
				{id ? "Сохранить изменения" : "Создать инструктаж"}
			</button>
		</div>
	);
};

export default memo(CreatorFooterPanel);
