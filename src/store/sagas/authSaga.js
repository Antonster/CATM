import { put, call, takeEvery } from "redux-saga/effects";
import authService from "../../services/auth.service";

function* login(action) {
	try {
		const { login, password } = action.payload;
		yield call(authService.getCsrf);
		const loginRes = yield call(() => authService.login(login, password));

		if (loginRes.status === 200) {
			yield put({ type: "FETCH_CURRENT_USER" });
			yield call(() => localStorage.setItem("authToken", loginRes.data.token));
			yield call(() => localStorage.setItem("expiry", loginRes.data.expiry));
			yield call(() => {
				window.location = "/";
			});
		}
	} catch (e) {
		yield put({ type: "SET_AUTH_ERROR", payload: "Ошибка авторизации" });
	}
}

export default function* loginSaga() {
	yield takeEvery("AUTH_BY_LOGIN", login);
}
