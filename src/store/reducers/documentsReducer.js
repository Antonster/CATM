const initialState = {
	isLoading: false,
	isDocumentLoading: false,
	error: null,
	documentList: null,
	documentTypes: null,
};

export function documentsReducer(state = initialState, action) {
	switch (action.type) {
		case "DOCUMENTS_FETCH_DOCUMENT_LIST": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "DOCUMENTS_SET_DOCUMENT_LIST": {
			return {
				...state,
				isLoading: false,
				isDocumentLoading: false,
				documentList: action.payload,
				error: null,
			};
		}
		case "DOCUMENTS_FETCH_DOCUMENT_TYPES": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "DOCUMENTS_SET_DOCUMENT_TYPES": {
			return {
				...state,
				isLoading: false,
				documentTypes: action.payload,
				error: null,
			};
		}
		case "DOCUMENTS_UPLOAD_DOCUMENT": {
			return {
				...state,
				isDocumentLoading: true,
			};
		}
		case "DOCUMENTS_ERROR": {
			return {
				...state,
				isLoading: false,
				error: action.payload,
			};
		}
		default:
			return state;
	}
}
