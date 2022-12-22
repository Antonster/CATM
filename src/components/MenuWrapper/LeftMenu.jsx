import { memo, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { briefingsActions, userActions } from "../../store/actions";

const LeftMenu = () => {
	const dispatch = useDispatch();
	const role = useSelector((state) => state.currentUser?.user?.permission);
	const briefingsList = useSelector((state) => state.briefings?.list);
	const briefingsCount = useMemo(
		() =>
			briefingsList?.filter(
				({ userbriefing_signed_at }) => !userbriefing_signed_at
			).length,
		[briefingsList]
	);

	useEffect(() => {
		dispatch(briefingsActions.fetchBriefingsCategories());
		dispatch(briefingsActions.fetchBriefingsTypes());
		dispatch(briefingsActions.fetchBriefingsList());
		dispatch(userActions.fetchOrganization());
	}, []);

	return (
		<div className="sMainMenu" id="sMainMenu">
			<ul>
				{role && (
					<li>
						<NavLink className="sMainMenu__item" to={"/work-permits"}>
							<svg className="icon icon-menu-1 ">
								<use href="/img/svg/sprite.svg#menu-1" />
							</svg>
							<span>Наряд-допуски</span>
						</NavLink>
					</li>
				)}
				{role && (
					<li>
						<NavLink className="sMainMenu__item" to={"/employee"}>
							<svg className="icon icon-menu-2 ">
								<use href="/img/svg/sprite.svg#menu-2" />
							</svg>
							<span>Работники</span>
						</NavLink>
					</li>
				)}
				<li>
					<NavLink className="sMainMenu__item" to={"/briefings/executor"}>
						<svg className="icon icon-menu-3">
							<use href="/img/svg/sprite.svg#menu-3" />
						</svg>
						<span>Инструктажи</span>
						{!!briefingsCount && (
							<div className="sMainMenu__item-new">{briefingsCount}</div>
						)}
					</NavLink>
				</li>
				<li>
					<NavLink className="sMainMenu__item" to={"/trainings"}>
						<svg className="icon icon-menu-4 ">
							<use href="/img/svg/sprite.svg#menu-4" />
						</svg>
						<span>Обучение</span>
					</NavLink>
				</li>
				<li>
					<NavLink className="sMainMenu__item" to={"/documents"}>
						<svg className="icon icon-menu-5 ">
							<use href="/img/svg/sprite.svg#menu-5" />
						</svg>
						<span>Документы</span>
					</NavLink>
				</li>
				<li>
					<NavLink className="sMainMenu__item" to={"/feedback"}>
						<svg className="icon icon-menu-6 ">
							<use href="/img/svg/sprite.svg#menu-6" />
						</svg>
						<span>Обратная связь</span>
					</NavLink>
				</li>
			</ul>
		</div>
	);
};

export default memo(LeftMenu);
