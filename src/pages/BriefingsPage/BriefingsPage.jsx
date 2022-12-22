import { memo, useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router";
import { briefingsActions } from "../../store/actions";
import "./briefings-page.css";

const BriefingsPage = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const dispatch = useDispatch();
	const role = useSelector((state) => state.currentUser?.user?.permission);
	const briefingsCategories = useSelector(
		(state) => state.briefings?.categories
	);
	const briefingsTypes = useSelector((state) => state.briefings?.types);
	const briefingsList = useSelector((state) => state.briefings?.list);
	const activeQuiz = useSelector((state) => state.briefings?.activeQuiz);
	const [activeCategory, setActiveCategory] = useState([0, 0]);
	const [isDocModalVisible, setDocumentModalVisible] = useState(false);
	const [briefingsListByType, setBriefingsListByType] = useState();

	const userBriefingsList = useMemo(() => {
		if (briefingsCategories && briefingsTypes && briefingsList) {
			let briefingsObj = {};

			briefingsList.forEach((item) => {
				if (briefingsObj[item.category]?.[item.type]) {
					briefingsObj[item.category][item.type].push(item);
				} else if (briefingsObj[item.category]) {
					briefingsObj = {
						...briefingsObj,
						[item.category]: {
							...briefingsObj[item.category],
							[item.type]: [item],
						},
					};
				} else {
					briefingsObj = {
						...briefingsObj,
						[item.category]: {
							[item.type]: [item],
						},
					};
				}
			});

			const result = Object.keys(briefingsObj).map((category) => {
				const types = Object.keys(briefingsObj[category]).map((type) => {
					return { type, list: briefingsObj[category][type] };
				});

				return { category, types };
			});

			return result;
		} else {
			return null;
		}
	}, [briefingsCategories, briefingsTypes, briefingsList]);

	const tabsOptions = useMemo(
		() =>
			role === "security_manager"
				? [
						{ title: "Инструктажи", value: "/briefings/executor" },
						{ title: "Мои инструктажи", value: "/briefings/creator" },
				  ]
				: [{ title: "Инструктажи", value: "/briefings/executor" }],
		[role]
	);

	const updateCurrentTab = useCallback(
		(tabTitle) => {
			if (tabTitle !== pathname) {
				const newOption = tabsOptions.find((item) => item.title === tabTitle);
				navigate(newOption.value);
			}
		},
		[navigate, pathname, tabsOptions]
	);

	const getQuiz = useCallback(
		async (id) => {
			dispatch(briefingsActions.fetchQuiz(id));
		},
		[dispatch]
	);

	const signBriefing = useCallback(
		(id) => {
			dispatch(briefingsActions.postBriefingSign(id));
		},
		[dispatch]
	);

	useEffect(() => {
		if (activeQuiz) {
			navigate("quiz");
		}
	}, [activeQuiz]);

	return (
		<div className="sBriefing" id="sBriefing">
			<div className="tabs-content-wrap">
				<div className="tabs__content active">
					<Outlet
						context={{
							isDocModalVisible,
							setDocumentModalVisible,
							tabsOptions,
							updateCurrentTab,
							activeCategory,
							setActiveCategory,
							userBriefingsList,
							briefingsList,
							briefingsListByType,
							setBriefingsListByType,
							getQuiz,
							signBriefing,
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default memo(BriefingsPage);
