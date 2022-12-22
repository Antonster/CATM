import { memo } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Outlet } from "react-router";
import TitleWrapper from "../../ui/TitleWrapper/TitleWrapper";
import Tabs from "../../ui/Tabs/Tabs";
import CategoryMenu from "./components/CategoryMenu";
import ExecutorFooterPanel from "./components/ExecutorFooterPanel";
import ModalWide from "../../ui/ModalWide/ModalWide";

const Executor = () => {
	const { id } = useParams();
	const {
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
	} = useOutletContext();

	return (
		<>
			{isDocModalVisible && (
				<ModalWide
					header={briefingsList.find((item) => item.id === +id)?.title}
					setIsVisible={setDocumentModalVisible}
					paddings={"0"}
				>
					<iframe
						title={briefingsList.find((item) => item.id === +id)?.file}
						src={briefingsList.find((item) => item.id === +id)?.file}
						className={"iframe_document__wrapper"}
					/>
				</ModalWide>
			)}
			<TitleWrapper title={"Инструктажи"} />
			<Tabs
				value={"/briefings/executor"}
				options={tabsOptions}
				cb={updateCurrentTab}
			/>
			<div className="briefings">
				<div className="briefings__list-block">
					<CategoryMenu
						{...{
							activeCategory,
							setActiveCategory,
							setBriefingsListByType,
							briefingsListByType,
							userBriefingsList,
						}}
					/>
				</div>
				<div className="briefings__caption-block">
					<Outlet
						context={{
							briefingsListByType,
							setDocumentModalVisible,
							activeTypeItem: briefingsList?.find((item) => item.id === +id),
						}}
					/>
				</div>
			</div>
			<ExecutorFooterPanel
				{...{
					activeTypeItem: briefingsList?.find((item) => item.id === +id),
					signBriefing,
					getQuiz,
				}}
			/>
		</>
	);
};

export default memo(Executor);
