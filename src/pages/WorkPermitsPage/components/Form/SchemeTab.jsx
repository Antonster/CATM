import { memo } from "react";

const SchemeTab = ({ register, workScheme }) => {
	return (
		<div className="special-menu__body">
			<h2>Схема проведения работ, прилагаемая к наряду-допуску, с указанием</h2>

			<div className="sNewPermit__check-block">
				{workScheme.map((factor, index) => {
					return (
						<div
							className="sNewPermit__check-string"
							key={factor.id + "-" + index}
						>
							<label className="custom-input form-check">
								<input
									className="custom-input__input form-check-input"
									name="checkbox"
									{...register("work_scheme")}
									type="checkbox"
									value={factor.id}
								/>
								<span className="custom-input__text form-check-label">
									{factor.value}
								</span>
							</label>
						</div>
					);
				})}
			</div>
		</div>
	);
};
export default memo(SchemeTab);
