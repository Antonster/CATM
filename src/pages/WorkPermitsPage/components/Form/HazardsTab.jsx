import { memo } from "react";

const HazardsTab = ({ register, dangerousFactors, anotherFactors }) => {
	return (
		<div className="special-menu__body">
			<h2>Действующие опасные факторы (стандартные)</h2>

			<div className="sNewPermit__check-block">
				{dangerousFactors.map((factor, index) => {
					return (
						<div
							className="sNewPermit__check-string"
							key={factor.id + "-" + index}
						>
							<label className="custom-input form-check">
								<input
									className="custom-input__input form-check-input"
									name="checkbox"
									{...register("dangerous_factors")}
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

			<h2 className="middle-title">Другие</h2>
			<div className="sNewPermit__check-block">
				{anotherFactors.map((factor, index) => {
					return (
						<div
							className="sNewPermit__check-string"
							key={factor.id + "-" + index}
						>
							<label className="custom-input form-check">
								<input
									className="custom-input__input form-check-input"
									name="checkbox"
									{...register("another_factors")}
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

export default memo(HazardsTab);
