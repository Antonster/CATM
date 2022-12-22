import { memo, useState } from "react";
import Collapse from "@mui/material/Collapse";

const RiskFactorsItem = ({ risk_name, actions }) => {
	const [isOpen, setOpen] = useState(false);

	return (
		<div className={`risk-factor__item ${isOpen ? "active" : ""}`}>
			<div
				className="risk-factor__item-title"
				onClick={() => setOpen((prev) => !prev)}
			>
				{risk_name}
			</div>
			<Collapse in={isOpen}>
				<ol className="risk-factor__item-list">
					{actions.map(({ text, subactions }) => (
						<>
							<li key={text} className="risk-factor__item-row">
								{text}
								{subactions && (
									<>
										{subactions.map((item) => (
											<div key={item} className="risk-factor__item-sub-item">
												{item}
											</div>
										))}
									</>
								)}
							</li>
						</>
					))}
				</ol>
			</Collapse>
		</div>
	);
};

export default memo(RiskFactorsItem);
