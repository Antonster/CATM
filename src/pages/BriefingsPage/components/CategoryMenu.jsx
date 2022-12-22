import { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Collapse from "@mui/material/Collapse";

const CategoryMenu = ({
	activeCategory,
	setActiveCategory,
	setBriefingsListByType,
	briefingsListByType,
	userBriefingsList,
}) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const briefingsCategories = useSelector(
		(state) => state.briefings?.categories
	);
	const briefingsTypes = useSelector((state) => state.briefings?.types);

	useEffect(() => {
		if (userBriefingsList?.length > 0 && !briefingsListByType) {
			if (id) {
				userBriefingsList.forEach(({ types }, categoryIndex) => {
					types.forEach(({ list }, typeIndex) => {
						if (list?.find((briefing) => briefing.id === +id)) {
							setActiveCategory([categoryIndex, typeIndex]);
							setBriefingsListByType(list);
						}
					});
				});
			} else {
				setBriefingsListByType(userBriefingsList[0].types[0].list);
				setActiveCategory([0, 0]);
			}
		} else if (userBriefingsList?.length > 0 && id) {
			userBriefingsList.forEach(({ types }, categoryIndex) => {
				types.forEach(({ list }, typeIndex) => {
					if (list?.find((briefing) => briefing.id === +id)) {
						setActiveCategory([categoryIndex, typeIndex]);
						setBriefingsListByType(list);
					}
				});
			});
		}
	}, [userBriefingsList, id]);

	return (
		<ul className="briefings__list">
			{userBriefingsList &&
				userBriefingsList.map(({ category, types }, categoryIndex) => (
					<li
						key={category}
						className={`briefings__list-item ${
							activeCategory[0] === categoryIndex ? "active" : ""
						}`}
					>
						<span
							onClick={() => {
								setActiveCategory([categoryIndex, 0]);
								setBriefingsListByType(types[0].list);
								if (id) {
									navigate("/briefings/executor");
								}
							}}
						>
							{briefingsCategories?.find((item) => item.id === +category).value}
						</span>
						<Collapse in={activeCategory[0] === categoryIndex}>
							<ul className="briefings__list-inside">
								{types.map(({ type, list }, typeIndex) => (
									<li
										key={type}
										className={`briefings__list-inside-item ${
											list.every(
												({ userbriefing_signed_at }) => !!userbriefing_signed_at
											)
												? "briefings__list-inside-item--done"
												: ""
										}`}
										onClick={() => {
											setActiveCategory([categoryIndex, typeIndex]);
											setBriefingsListByType(list);
											if (id) {
												navigate("/briefings/executor");
											}
										}}
									>
										<div
											className={`briefings__list-inside-text ${
												activeCategory[1] === typeIndex ? "active" : ""
											}`}
										>
											{briefingsTypes?.find((item) => item.id === +type).value}
										</div>
										{!!list.filter(
											({ userbriefing_signed_at }) => !userbriefing_signed_at
										)?.length && (
											<span>
												{
													list.filter(
														({ userbriefing_signed_at }) =>
															!userbriefing_signed_at
													).length
												}
											</span>
										)}
									</li>
								))}
							</ul>
						</Collapse>
					</li>
				))}
		</ul>
	);
};

export default memo(CategoryMenu);
