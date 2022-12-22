import { memo, useCallback } from "react";

const WorkType = ({ setStep, workTypes, workType, setWorkType }) => {
	const onTypeClick = useCallback(
		(id) => {
			setWorkType(id);
			setStep("form");
		},
		[setStep, setWorkType]
	);

	return (
		<div className="special-menu__inner-wrapper">
			<h2 className="permit-type-title">
				Выберите тип опасных работ, на который нужен наряд-допуск
			</h2>
			{workTypes?.map(({ id, title }, index) => (
				<button
					key={id}
					className={`permit-type-item ${workType === id ? "active" : ""}`}
					onClick={() => onTypeClick(id)}
				>
					<div className="permit-type-item__head">
						<div className="permit-type-item__id">{index + 1}</div>
						<div className="permit-type-item__title">{title}</div>
					</div>
				</button>
			))}
		</div>
	);
};

export default memo(WorkType);
