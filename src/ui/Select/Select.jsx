import { memo } from "react";
import "./select.css";

function SelectComponent({ title, regName, options, ...rest }) {
	return (
		<div className="form-wrap__input-wrap form-group">
			<label>
				<span className="form-wrap__input-title">{title}</span>
				<select
					name={regName}
					className="form-wrap__input form-select"
					{...rest}
				>
					<option value={0} hidden="hidden">
						Выберите
					</option>
					{options.map((option) => {
						return (
							<option key={option.id} value={option.id}>
								{option.title}
							</option>
						);
					})}
				</select>
			</label>
		</div>
	);
}

export default memo(SelectComponent);
