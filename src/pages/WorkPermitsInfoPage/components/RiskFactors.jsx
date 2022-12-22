import { memo } from "react";
import RiskFactorsItem from "./RiskFactorsItem";

const RiskFactors = ({ riskFactors }) => {
	return (
		<>
			{riskFactors?.map(({ stage_id_name, stage_name, risk_factors }) => (
				<div key={stage_id_name} className="risk-factor__wrapper">
					<div className="risk-factor__stage">{stage_id_name}</div>
					<div className="risk-factor__stage-title">{stage_name}</div>
					{risk_factors.map(({ id, risk_name, actions }) => (
						<RiskFactorsItem
							key={id}
							{...{
								risk_name,
								actions,
							}}
						/>
					))}
				</div>
			))}
		</>
	);
};

export default memo(RiskFactors);
