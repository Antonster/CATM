import { memo } from "react";
import Team from "./Team";
import PeopleList from "./PeopleList";
import Separator from "./Separator";
import DocumentList from "./DocumentList";
import RiskFactors from "./RiskFactors";
import DailyPermits from "./DailyPermits";
import Analyzes from "./Analyzes";
import Extension from "./Extension";
import ModalWide from "../../../ui/ModalWide/ModalWide";

const ModalWindows = ({
	workPermitInfo,
	userId,
	pdfUrl,
	addDocument,
	riskFactors,
	removeDocument,
	createDailyPermit,
	removeDailyPermit,
	removeAnalyze,
	onCreateAnalyze,
	onUpdateWorkers,
	onSignWorker,
	signDailyPermit,
	closeDailyPermit,
	setPermitExtensionPopup,
	daily_permits,
	analyzes,
	isLoading,
	isDocumentModal,
	isChangeWorkersModal,
	isWorkersModal,
	isManagersModal,
	isDocumentListModal,
	isRiskFactorsModal,
	isDailyPermitModal,
	isAnalyzesModal,
	isExtensionModal,
	setIsDocumentModal,
	setIsChangeWorkersModal,
	setIsWorkersModal,
	setIsManagersModal,
	setIsDocumentListModal,
	setRiskFactorsModal,
	setIsDailyPermitModal,
	setIsAnalyzesModal,
	setIsExtensionModal,
}) => {
	return (
		<>
			{isDocumentModal && (
				<ModalWide header="" setIsVisible={setIsDocumentModal} paddings="0">
					<iframe
						title={pdfUrl}
						src={pdfUrl}
						className={"iframe_document__wrapper"}
					/>
				</ModalWide>
			)}
			{isChangeWorkersModal && (
				<ModalWide
					header="Работники"
					setIsVisible={setIsChangeWorkersModal}
					paddings="0"
				>
					<Team
						{...{
							selectedEmployees: workPermitInfo?.workers,
							onUpdateWorkers,
							setIsChangeWorkersModal,
						}}
					/>
				</ModalWide>
			)}
			{isWorkersModal && (
				<ModalWide
					header="Работники"
					setIsVisible={setIsWorkersModal}
					paddings="0"
				>
					<Separator
						{...{
							onClose: setIsWorkersModal,
						}}
					/>
					<PeopleList
						{...{
							list: workPermitInfo?.workers,
							onSignWorker,
							userId,
							workPermitInfo,
						}}
					/>
				</ModalWide>
			)}
			{isManagersModal && (
				<ModalWide
					header="Согласования"
					setIsVisible={setIsManagersModal}
					paddings="0"
				>
					<Separator
						{...{
							onClose: setIsManagersModal,
						}}
					/>
					<PeopleList
						{...{
							list: workPermitInfo?.signers,
						}}
					/>
				</ModalWide>
			)}
			{isDocumentListModal && (
				<ModalWide
					header="Дополнительная документация"
					setIsVisible={setIsDocumentListModal}
					paddings="0"
				>
					<Separator
						{...{
							onClose: setIsDocumentListModal,
						}}
					/>
					<DocumentList
						{...{
							files: workPermitInfo?.documents,
							addDocument,
							removeDocument,
							isLoading,
						}}
					/>
				</ModalWide>
			)}
			{isRiskFactorsModal && (
				<ModalWide
					header="Обязательные мероприятия по снижению воздействия опасных факторов"
					setIsVisible={setRiskFactorsModal}
					paddings="24px"
				>
					<RiskFactors
						{...{
							riskFactors,
						}}
					/>
				</ModalWide>
			)}
			{isDailyPermitModal && (
				<ModalWide
					header="Ежедневные допуски"
					setIsVisible={setIsDailyPermitModal}
					paddings="0"
				>
					<Separator
						{...{
							onClose: setIsDailyPermitModal,
						}}
					/>
					<DailyPermits
						{...{
							workPermitInfo,
							signDailyPermit,
							closeDailyPermit,
							createDailyPermit,
							removeDailyPermit,
							daily_permits,
						}}
					/>
				</ModalWide>
			)}
			{isAnalyzesModal && (
				<ModalWide
					header="Анализы газовоздушной среды"
					setIsVisible={setIsAnalyzesModal}
					paddings="0"
				>
					<Separator
						{...{
							onClose: setIsAnalyzesModal,
						}}
					/>
					<Analyzes
						{...{
							workPermitInfo,
							userId,
							onCreateAnalyze,
							analyzes,
							removeAnalyze,
						}}
					/>
				</ModalWide>
			)}
			{isExtensionModal && (
				<ModalWide
					header="Продление"
					setIsVisible={setIsExtensionModal}
					paddings="0"
				>
					<Separator
						{...{
							onClose: setIsExtensionModal,
						}}
					/>
					<Extension
						{...{
							workPermitInfo,
							setPermitExtensionPopup,
						}}
					/>
				</ModalWide>
			)}
		</>
	);
};

export default memo(ModalWindows);
