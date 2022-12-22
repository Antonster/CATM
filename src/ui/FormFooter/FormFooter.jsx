import { memo } from "react";
import "./form-footer.css";

const FormFooter = ({ closeFormHandle, children }) => {
	return (
		<div className="special-menu__footer">
			<div className={"form-footer__children-wrapper"}>{children}</div>
			<button className="btn btn-outline-primary" onClick={closeFormHandle}>
				Отмена
			</button>
			<button type="submit" className="btn btn-primary">
				Сохранить
			</button>
		</div>
	);
};

export default memo(FormFooter);
