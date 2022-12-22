import { memo, useEffect, useState } from "react";
import TitleWrapper from "../../ui/TitleWrapper/TitleWrapper";
import trainingsService from "../../services/trainings.service";
import "./trainings-page.css";

const TrainingsPage = () => {
	const [school, setSchool] = useState([]);

	useEffect(() => {
		const getTrainings = async () => {
			try {
				const res = await trainingsService.getSchool();
				setSchool(res.data[0]);
			} catch (e) {
				console.log(e);
			}
		};
		getTrainings();
	}, []);

	return (
		<div className="sStudy" id="sStudy">
			<TitleWrapper title={"Обучение"} />
			<iframe
				title={school.url}
				src={school.url}
				className={"iframe_document__wrapper"}
			/>
		</div>
	);
};

export default memo(TrainingsPage);
