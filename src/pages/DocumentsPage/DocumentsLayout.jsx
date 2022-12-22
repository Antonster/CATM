import { memo, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleWrapper from "../../ui/TitleWrapper/TitleWrapper";
import ModalWide from "../../ui/ModalWide/ModalWide";
import DocumentsList from "./components/DocumentsList";
import DocumentTypeList from "./components/DocumentTypeList";
import { useCustomSearchParams } from "../../hooks/useSearchParams";
import { documentsActions } from "../../store/actions";
import "./documents-page.css";

const DocumentsLayout = () => {
	const { updateSearchParam, setSearchParams, searchParamsObj, searchParams } =
		useCustomSearchParams();
	const dispatch = useDispatch();
	const documentTypes = useSelector((state) => state.documents?.documentTypes);
	const documentList = useSelector((state) => state.documents?.documentList);
	const [pdf, setPdf] = useState("");
	const [isDocModalVisible, setIsDocumentModalVisible] = useState(false);

	const onUpdateCurrentTab = useCallback((id) => {
		setSearchParams({
			type: id,
		});
	}, []);

	useEffect(() => {
		if (searchParamsObj?.type) {
			dispatch(documentsActions.fetchDocumentList(searchParams.toString()));
		} else {
			setSearchParams({
				type: "1",
			});
		}
	}, [searchParamsObj]);

	useEffect(() => {
		if (!documentTypes) {
			dispatch(documentsActions.fetchDocumentTypes());
		}
	}, [documentTypes]);

	return (
		<div className="sDocumentation" id="sDocumentation">
			{isDocModalVisible && (
				<ModalWide
					header={pdf.title}
					setIsVisible={setIsDocumentModalVisible}
					paddings={"0"}
				>
					<iframe
						title={pdf.title}
						src={pdf.file}
						className={"iframe_document__wrapper"}
					/>
				</ModalWide>
			)}
			<TitleWrapper title={"Документы"} />
			<div className="sDocumentation__wrap">
				<DocumentTypeList
					{...{
						documentTypes,
						searchParamsObj,
						onUpdateCurrentTab,
					}}
				/>
				<DocumentsList
					{...{
						documentList,
						documentTypes,
						setPdf,
						setIsDocumentModalVisible,
						searchParamsObj,
						searchParams,
						updateSearchParam,
						setSearchParams,
					}}
				/>
			</div>
		</div>
	);
};

export default memo(DocumentsLayout);
