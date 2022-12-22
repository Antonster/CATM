export const fetchDocumentList = (searchString) => {
	return { type: "DOCUMENTS_FETCH_DOCUMENT_LIST", payload: searchString };
};
export const setDocumentList = (data) => {
	return { type: "DOCUMENTS_SET_DOCUMENT_LIST", payload: data };
};
export const fetchDocumentTypes = () => {
	return { type: "DOCUMENTS_FETCH_DOCUMENT_TYPES" };
};
export const setDocumentTypes = (data) => {
	return { type: "DOCUMENTS_SET_DOCUMENT_TYPES", payload: data };
};
export const uploadDocument = (formData, searchString) => {
	return {
		type: "DOCUMENTS_UPLOAD_DOCUMENT",
		payload: { formData, searchString },
	};
};
export const deleteDocument = (id, searchString) => {
	return { type: "DOCUMENTS_DELETE_DOCUMENT", payload: { id, searchString } };
};
