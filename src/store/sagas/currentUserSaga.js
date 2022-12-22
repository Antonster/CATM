import { put, call, takeEvery } from "redux-saga/effects";
import usersService from "../../services/users.service";
import { setCurrentUser, setOrganization } from "../actions/currentUser";

function* fetchCurrentUser() {
	try {
		const userRes = yield call(usersService.getCurrentUser);
		yield call(() => localStorage.setItem("role", userRes.data.permission));
		yield put(setCurrentUser(userRes.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "FETCH_USER_ERROR" });
	}
}

function* fetchOrganization() {
	try {
		const organization = yield call(usersService.getOrganization);
		yield put(setOrganization(organization.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "FETCH_USER_ERROR" });
	}
}

export default function* currentUserSaga() {
	yield takeEvery("FETCH_CURRENT_USER", fetchCurrentUser);
	yield takeEvery("FETCH_ORGANIZATION", fetchOrganization);
}
