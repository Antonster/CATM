import { memo } from "react";

const EquipmentTab = ({ register, saveEquipment, usedEquipment }) => {
	return (
		<div className="special-menu__body">
			<h2>Страховочное оборудование</h2>

			<div className="sNewPermit__check-block">
				{saveEquipment.map((factor, index) => {
					return (
						<div
							className="sNewPermit__check-string"
							key={factor.id + "-" + index}
						>
							<label className="custom-input form-check">
								<input
									className="custom-input__input form-check-input"
									name="checkbox"
									{...register("save_equipment")}
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

			<h2 className="middle-title">Используемое оборудование, инструмент</h2>
			<div className="sNewPermit__check-block">
				{usedEquipment.map((factor, index) => {
					return (
						<div
							className="sNewPermit__check-string"
							key={factor.id + "-" + index}
						>
							<label className="custom-input form-check">
								<input
									className="custom-input__input form-check-input"
									name="checkbox"
									{...register("used_equipment")}
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

export default memo(EquipmentTab);
