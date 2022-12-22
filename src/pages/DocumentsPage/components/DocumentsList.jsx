import { memo, useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { prettifySize } from "../../../assets/helper.funcs";
import SearchBlock from "../../../ui/SearchBlock/SearchBlock";
import Pagination from "../../../ui/Pagination/Pagination";
import DocumentItem from "./DocumentItem";
import { documentsActions } from "../../../store/actions";

const DocumentsList = ({
	documentList,
	documentTypes,
	setPdf,
	setIsDocumentModalVisible,
	searchParamsObj,
	searchParams,
	setSearchParams,
}) => {
	const dispatch = useDispatch();
	const isDocumentLoading = useSelector(
		(state) => state.documents?.isDocumentLoading
	);
	const role = useSelector((state) => state.currentUser?.user?.permission);

	const memoDefaultSearchValue = useMemo(
		() => searchParams.get("title"),
		[searchParams]
	);
	const memoIsClear = useMemo(() => !searchParams.get("title"), [searchParams]);

	const onOpenDocumentInModal = useCallback((url) => {
		setPdf(url);
		setIsDocumentModalVisible(true);
	}, []);

	const updateDocumentSearch = useCallback(
		(searchString) => {
			setSearchParams({
				...searchParamsObj,
				title: searchString,
				page: 1,
			});
		},
		[searchParamsObj]
	);

	const uploadDocument = useCallback(
		(e) => {
			const formData = new FormData();
			formData.append("file", e.target.files[0]);
			formData.append("title", e.target.files[0].name.split(".")[0]);
			formData.append("type", searchParamsObj.type);

			dispatch(
				documentsActions.uploadDocument(formData, searchParams.toString())
			);
			e.target.value = "";
		},
		[dispatch, searchParams, searchParamsObj]
	);

	const onDeleteDocument = useCallback(
		async (id) => {
			dispatch(documentsActions.deleteDocument(id, searchParams.toString()));
		},
		[searchParams]
	);

	useEffect(() => {
		setSearchParams({
			type: searchParamsObj.type,
			title: searchParamsObj.title || "",
			page: 1,
		});
	}, []);

	return (
		<>
			<div className="sDocumentation__caption-block">
				<h3>
					{documentTypes?.find(({ id }) => id === +searchParamsObj?.type)?.name}
				</h3>
				<SearchBlock
					placeholder="Найти документ"
					defaultValue={memoDefaultSearchValue}
					cb={updateDocumentSearch}
					isClear={memoIsClear}
				/>
				<div className="upload-field form-wrap__input-wrap form-group">
					{role === "security_manager" && (
						<>
							{!isDocumentLoading &&
								+searchParamsObj?.type !== 4 &&
								+searchParamsObj?.type !== 5 && (
									<>
										<label
											className="upload-field__button"
											htmlFor="upload-field"
										>
											<span>Выбрать и загрузить файл</span>
										</label>
										<input
											className="form-wrap__file"
											name="file"
											type="file"
											id="upload-field"
											onChange={uploadDocument}
										/>
									</>
								)}
							{isDocumentLoading && (
								<>
									<label
										className="upload-field__button"
										htmlFor="upload-field"
									>
										<img
											src="/img/svg/wait2.svg"
											className="icon-wait"
											alt=""
										/>
										<span>Файл загружается</span>
									</label>
								</>
							)}
						</>
					)}
				</div>
				{documentList?.results.map(({ id, file, title, file_size }) => (
					<DocumentItem
						key={id}
						{...{
							id,
							title,
							file,
							file_size,
							role,
							searchParamsObj,
							onOpenDocumentInModal,
							onDeleteDocument,
						}}
					/>
				))}
				{documentList?.count > 10 && (
					<Pagination itemsTotal={documentList?.count} />
				)}
			</div>
		</>
	);
};

export default memo(DocumentsList);
