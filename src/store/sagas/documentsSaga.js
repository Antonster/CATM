import { put, call, takeEvery } from "redux-saga/effects";
import documentsService from "../../services/documents.service";
import { setDocumentList, setDocumentTypes } from "../actions/documents";

function* fetchDocumentList(action) {
	try {
		const result = yield call(() =>
			documentsService.getDocuments(action.payload)
		);
		yield put(setDocumentList(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "DOCUMENTS_ERROR" });
	}
}

function* fetchDocumentTypes() {
	try {
		const result = yield call(documentsService.getDocumentTypes);
		yield put(setDocumentTypes(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "DOCUMENTS_ERROR" });
	}
}

function* uploadDocument(action) {
	try {
		yield call(() => documentsService.uploadDocument(action.payload.formData));
		const result = yield call(() =>
			documentsService.getDocuments(action.payload.searchString)
		);
		yield put(setDocumentList(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "DOCUMENTS_ERROR" });
	}
}

function* deleteDocument(action) {
	try {
		yield call(() => documentsService.deleteDocument(action.payload.id));
		const result = yield call(() =>
			documentsService.getDocuments(action.payload.searchString)
		);
		yield put(setDocumentList(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "DOCUMENTS_ERROR" });
	}
}

export default function* documentsSaga() {
	yield takeEvery("DOCUMENTS_FETCH_DOCUMENT_LIST", fetchDocumentList);
	yield takeEvery("DOCUMENTS_FETCH_DOCUMENT_TYPES", fetchDocumentTypes);
	yield takeEvery("DOCUMENTS_UPLOAD_DOCUMENT", uploadDocument);
	yield takeEvery("DOCUMENTS_DELETE_DOCUMENT", deleteDocument);
}
