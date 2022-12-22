import { memo, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import FooterMenuNew from "./components/FooterMenuNew";
import FooterMenuPending from "./components/FooterMenuPending";
import FooterMenuSigned from "./components/FooterMenuSigned";
import CardWrapper from "./components/CardWrapper";
import TopMenu from "./components/TopMenu";
import Document from "./components/Document";
import RiskFactorsCard from "./components/RiskFactorsCard";
import WrongPermit from "./components/WrongPermit";
import ModalWindows from "./components/ModalWindows";
import DialogWindows from "./components/DialogWindows";
import permitsService from "../../services/permits.service";
import briefingsService from "../../services/briefings.service";
import { permitsActions } from "../../store/actions";
import "./work-permits-info-page.css";

const WorkPermitsInfoPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const userId = useSelector((state) => state.currentUser?.user?.id);
	const riskFactors = useSelector((state) => state.permits?.riskFactors);
	const [pdfUrl, setPdfUrl] = useState("");
	const [isDocumentModal, setIsDocumentModal] = useState(false);
	const [isChangeWorkersModal, setIsChangeWorkersModal] = useState(false);
	const [isWorkersModal, setIsWorkersModal] = useState(false);
	const [isManagersModal, setIsManagersModal] = useState(false);
	const [isDocumentListModal, setIsDocumentListModal] = useState(false);
	const [isDailyPermitModal, setIsDailyPermitModal] = useState(false);
	const [isAnalyzesModal, setIsAnalyzesModal] = useState(false);
	const [isExtensionModal, setIsExtensionModal] = useState(false);
	const [isDeletionPopup, setDeletionPopup] = useState(false);
	const [isArchivingPopup, setArchivingPopup] = useState(false);
	const [removeDailyPermitPopup, setRemoveDailyPermitPopup] = useState(false);
	const [removeAnalyzePopup, setRemoveAnalyzePopup] = useState(false);
	const [signDailyPermitPopup, setSignDailyPermitPopup] = useState(false);
	const [closeDailyPermitPopup, setCloseDailyPermitPopup] = useState(false);
	const [permitExtensionPopup, setPermitExtensionPopup] = useState(false);
	const [permitExtensionSignPopup, setPermitExtensionSignPopup] =
		useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [workPermitInfo, setWorkPermitInfo] = useState(null);
	const [workPermitInfoError, setWorkPermitInfoError] = useState(false);
	const [document, setDocument] = useState("");
	const [confirmationDialog, setConfirmationDialog] = useState(false);
	const [rejectionDialog, setRejectionDialog] = useState(false);
	const [isRiskFactorsModal, setRiskFactorsModal] = useState(false);

	const menusData = [
		{
			validation: true,
			menuName: "employeesMenu",
			title: "Работники",
			count:
				(workPermitInfo?.workers_signed_count ||
					workPermitInfo?.workers_signed_count === 0) &&
				workPermitInfo?.workers
					? `${workPermitInfo?.workers_signed_count}/${workPermitInfo?.workers_count}`
					: "0/0",
			countFunc: () => setIsWorkersModal(true),
			warningCheck:
				workPermitInfo?.workers_signed_count !== workPermitInfo?.workers_count,
			warningText: "Работники не прошли инструктаж к наряд-допуску",
			buttonCheck:
				workPermitInfo?.responsible_manager?.id === userId &&
				workPermitInfo?.work_permit?.status === "signed",
			buttonFunc: () => setIsChangeWorkersModal(true),
			buttonText: "Добавить или заменить работников",
			people: workPermitInfo?.workers,
		},
		{
			validation: true,
			menuName: "agreementsMenu",
			title: "Согласования",
			count:
				(workPermitInfo?.managers_signed ||
					workPermitInfo?.managers_signed === 0) &&
				workPermitInfo?.signers
					? `${workPermitInfo?.managers_signed}/${workPermitInfo?.signers?.length}`
					: "0/0",
			warningCheck:
				workPermitInfo?.signers?.find(({ user }) => user.id === userId) &&
				workPermitInfo?.signers?.find(({ signed }) => signed === false),
			warningText: "Наряд-допуск отклонен одним из согласующих лиц",
			countFunc: () => setIsManagersModal(true),
			people: workPermitInfo?.signers,
		},
		{
			validation: workPermitInfo?.work_permit?.status === "signed",
			menuName: "dailyPermitsMenu",
			title: "Ежедневные допуски",
			count: workPermitInfo?.daily_permits?.length || `0`,
			buttonCheck:
				workPermitInfo?.responsible_manager?.id === userId &&
				workPermitInfo?.work_permit?.status === "signed",
			buttonFunc: () => setIsDailyPermitModal(true),
			buttonText: "Оформить ежедневный допуск",
			daily_permits: workPermitInfo?.daily_permits,
		},
		{
			validation: workPermitInfo?.work_permit?.status === "signed",
			menuName: "analyzesMenu",
			title: "Анализы газовоздушной среды",
			count: workPermitInfo?.gas_air_analysis?.length || `0`,
			buttonCheck:
				workPermitInfo?.responsible_manager?.id === userId &&
				workPermitInfo?.work_permit?.status === "signed",
			buttonFunc: () => setIsAnalyzesModal(true),
			buttonText: "Заполнить данные анализа",
			analyzes: workPermitInfo?.gas_air_analysis,
		},
		{
			validation: true,
			menuName: "documentsMenu",
			title: "Дополнительная документация",
			count: workPermitInfo?.documents?.length || `0`,
			buttonCheck:
				workPermitInfo?.responsible_manager?.id === userId &&
				workPermitInfo?.work_permit?.status === "new",
			buttonFunc: () => setIsDocumentListModal(true),
			buttonText: "Добавить",
			documents: workPermitInfo?.documents,
		},
	];

	const openDocumentInModal = useCallback((url) => {
		setPdfUrl(url);
		setIsDocumentModal(true);
	}, []);

	const deleteWorkPermitById = useCallback(async () => {
		try {
			setDeletionPopup(false);
			await permitsService.deleteWorkPermitById(id);
			navigate("/work-permits");
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	}, [id, navigate]);

	const fetchWorkPermitById = useCallback(async () => {
		try {
			setWorkPermitInfoError(false);
			const res = await permitsService.getWorkPermitById(id);
			setWorkPermitInfo(res.data);
		} catch (e) {
			setWorkPermitInfoError(true);
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	const generatePdf = useCallback(async () => {
		try {
			await permitsService.generatePdf(id);
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	const addDocument = useCallback(
		async (file) => {
			try {
				setIsLoading(true);
				const data = new FormData();
				data.append("file", file);

				await permitsService.addDocument(id, data);
				await fetchWorkPermitById();
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
			}
		},
		[fetchWorkPermitById, id]
	);

	const removeDocument = useCallback(
		async (documentId) => {
			try {
				await permitsService.removeDocument(id, documentId);
				await fetchWorkPermitById();
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
			}
		},
		[fetchWorkPermitById, id]
	);

	const removeDailyPermit = useCallback(
		async (dailyId) => {
			try {
				await permitsService.removeDailyPermit(id, dailyId);
				await fetchWorkPermitById();
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
				setRemoveDailyPermitPopup(false);
			}
		},
		[fetchWorkPermitById, id]
	);

	const onExtendPermit = useCallback(
		async (formData) => {
			try {
				await permitsService.extendPermit(id, formData);
				await fetchWorkPermitById();
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
				setPermitExtensionPopup(false);
				setIsExtensionModal(false);
			}
		},
		[fetchWorkPermitById, id]
	);

	const onExtendPermitSign = useCallback(async () => {
		try {
			await permitsService.extendPermitSign(id);
			await fetchWorkPermitById();
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
			setPermitExtensionSignPopup(false);
		}
	}, [fetchWorkPermitById, id]);

	const removeAnalyze = useCallback(
		async (analyzeId) => {
			try {
				await permitsService.removeAnalyze(analyzeId);
				await fetchWorkPermitById();
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
				setRemoveAnalyzePopup(false);
			}
		},
		[fetchWorkPermitById]
	);

	const signDailyPermit = useCallback(
		async (dailyId, role, date_end) => {
			try {
				await permitsService.signDailyPermit(id, dailyId, role, date_end);
				await fetchWorkPermitById();
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
				setSignDailyPermitPopup(false);
				setCloseDailyPermitPopup(false);
			}
		},
		[fetchWorkPermitById, id]
	);

	const createDailyPermit = useCallback(
		async (formData) => {
			try {
				await permitsService.createDailyPermit(id, formData);
				await fetchWorkPermitById();
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
			}
		},
		[fetchWorkPermitById, id]
	);

	const onRejectPermit = useCallback(
		async (role) => {
			try {
				await permitsService.signPermit(id, `sign=false&role=${role}`);
				const res = await permitsService.getWorkPermitById(id);
				setWorkPermitInfo(res.data);
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
				setRejectionDialog(false);
			}
		},
		[id]
	);

	const onArchivingPermit = useCallback(async () => {
		try {
			await permitsService.archivingPermit(id);
			const res = await permitsService.getWorkPermitById(id);
			setWorkPermitInfo(res.data);
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
			setArchivingPopup(false);
		}
	}, [id]);

	const onUpdateWorkers = useCallback(
		async (data) => {
			try {
				await permitsService.updateWorkers(id, data);
				const res = await permitsService.getWorkPermitById(id);
				setWorkPermitInfo(res.data);
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
				setIsChangeWorkersModal(false);
			}
		},
		[id]
	);

	const onSignWorker = useCallback(
		async (userId) => {
			try {
				await briefingsService.signBriefingUser(
					workPermitInfo.work_permit.briefing_id,
					userId
				);
				const res = await permitsService.getWorkPermitById(id);
				setWorkPermitInfo(res.data);
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
				setIsChangeWorkersModal(false);
			}
		},
		[id, workPermitInfo]
	);

	const onCreateAnalyze = useCallback(
		async (formData) => {
			try {
				await permitsService.createAnalyze(formData);
				const res = await permitsService.getWorkPermitById(id);
				setWorkPermitInfo(res.data);
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
				setArchivingPopup(false);
			}
		},
		[id]
	);

	const onSignPermit = useCallback(
		async (role) => {
			try {
				if (workPermitInfo?.work_permit?.status === "new") {
					await permitsService.signPermit(
						id,
						"sign=true&role=responsible_manager"
					);
				}
				if (workPermitInfo?.work_permit?.status === "pending") {
					await permitsService.signPermit(id, `sign=true&role=${role}`);
				}
				const res = await permitsService.getWorkPermitById(id);
				setWorkPermitInfo(res.data);
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
				setConfirmationDialog(false);
			}
		},
		[id, workPermitInfo]
	);

	useEffect(() => {
		fetchWorkPermitById();
	}, []);

	useEffect(() => {
		if (!workPermitInfo?.work_permit?.document) {
			generatePdf();
		}
		setDocument(workPermitInfo?.work_permit?.document);
	}, [workPermitInfo]);

	useEffect(() => {
		if (!riskFactors) {
			dispatch(permitsActions.fetchRiskFactors());
		}
	}, [riskFactors]);

	return (
		<div className="sWorkPermitCard" id="sWorkPermitCard">
			<ModalWindows
				{...{
					userId,
					workPermitInfo,
					pdfUrl,
					addDocument,
					riskFactors,
					removeDocument,
					createDailyPermit,
					onCreateAnalyze,
					onUpdateWorkers,
					onSignWorker,
					removeDailyPermit: setRemoveDailyPermitPopup,
					removeAnalyze: setRemoveAnalyzePopup,
					signDailyPermit: setSignDailyPermitPopup,
					closeDailyPermit: setCloseDailyPermitPopup,
					setPermitExtensionPopup,
					daily_permits: workPermitInfo?.daily_permits,
					analyzes: workPermitInfo?.gas_air_analysis,
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
				}}
			/>
			<DialogWindows
				{...{
					workPermitInfo,
					onSignPermit,
					onRejectPermit,
					deleteWorkPermitById,
					onArchivingPermit,
					removeDailyPermit,
					removeAnalyze,
					signDailyPermit,
					closeDailyPermitPopup,
					onExtendPermit,
					onExtendPermitSign,
					setConfirmationDialog,
					setRejectionDialog,
					setDeletionPopup,
					setArchivingPopup,
					setRemoveDailyPermitPopup,
					setRemoveAnalyzePopup,
					setSignDailyPermitPopup,
					setCloseDailyPermitPopup,
					setPermitExtensionPopup,
					setPermitExtensionSignPopup,
					confirmationDialog,
					rejectionDialog,
					isDeletionPopup,
					isArchivingPopup,
					removeDailyPermitPopup,
					removeAnalyzePopup,
					signDailyPermitPopup,
					permitExtensionPopup,
					permitExtensionSignPopup,
				}}
			/>
			<TopMenu
				{...{
					workPermitInfo,
				}}
			/>
			{document && (
				<Document
					{...{
						document,
						openDocumentInModal,
					}}
				/>
			)}
			{workPermitInfo &&
				menusData
					.filter(({ validation }) => !!validation)
					.map((item) => (
						<CardWrapper
							{...{
								...item,
								key: item.menuName,
								workPermitInfo,
								openDocumentInModal,
								removeDailyPermit: setRemoveDailyPermitPopup,
								removeAnalyze: setRemoveAnalyzePopup,
								signDailyPermit: setSignDailyPermitPopup,
								closeDailyPermit: setCloseDailyPermitPopup,
							}}
						/>
					))}
			<RiskFactorsCard
				{...{
					workPermitInfo,
					userId,
					setRiskFactorsModal,
				}}
			/>
			{workPermitInfo?.work_permit?.status === "new" && (
				<FooterMenuNew
					{...{
						isWorkersModal,
						isManagersModal,
						isDocumentListModal,
						isDocumentModal,
						setDeletionPopup,
						workPermitInfo,
						onSignClick: setConfirmationDialog,
					}}
				/>
			)}
			{workPermitInfo?.work_permit?.status === "pending" && (
				<FooterMenuPending
					{...{
						isChangeWorkersModal,
						isDocumentListModal,
						isManagersModal,
						isWorkersModal,
						isRiskFactorsModal,
						isDocumentModal,
						setDeletionPopup,
						workPermitInfo,
						onSignClick: setConfirmationDialog,
						onRejectClick: setRejectionDialog,
					}}
				/>
			)}
			{workPermitInfo?.work_permit?.status === "signed" && (
				<FooterMenuSigned
					{...{
						isChangeWorkersModal,
						isWorkersModal,
						isManagersModal,
						isRiskFactorsModal,
						isDocumentListModal,
						isDocumentModal,
						isDailyPermitModal,
						isAnalyzesModal,
						isExtensionModal,
						setIsExtensionModal,
						setPermitExtensionSignPopup,
						workPermitInfo,
						onArchivingClick: setArchivingPopup,
					}}
				/>
			)}
			{workPermitInfoError && <WrongPermit />}
		</div>
	);
};

export default memo(WorkPermitsInfoPage);
