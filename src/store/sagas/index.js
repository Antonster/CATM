import { spawn, call, all } from "redux-saga/effects";
import currentUserSaga from "./currentUserSaga";
import userAvatarSaga from "./userAvatarSaga";
import loginSaga from "./authSaga";
import logOutSaga from "./logOutSaga";
import briefingsSaga from "./briefingsSaga";
import permitsSaga from "./permitsSaga";
import documentsSaga from "./documentsSaga";

export default function* rootSaga() {
	const sagas = [
		loginSaga,
		logOutSaga,
		currentUserSaga,
		userAvatarSaga,
		briefingsSaga,
		permitsSaga,
		documentsSaga,
	];

	const retrySagas = yield sagas.map((saga) => {
		return spawn(function* () {
			while (true) {
				try {
					yield call(saga);
					break;
				} catch (e) {
					console.log(e);
				}
			}
		});
	});

	yield all(retrySagas);
}
