import { call, takeEvery } from "redux-saga/effects";

function* logout() {
	localStorage.removeItem("authToken");
	localStorage.removeItem("expiry");
	localStorage.removeItem("role");
	yield call(() => {
		window.location = "/login";
	});
}

export default function* logOutSaga() {
	yield takeEvery("LOG_OUT", logout);
}
