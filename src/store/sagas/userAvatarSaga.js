import { call, put, takeEvery } from "redux-saga/effects";
import usersService from "../../services/users.service";

function* changeAvatar(action) {
	const formData = action.payload;

	try {
		const res = yield call(() => usersService.setUsersAvatar(formData));
		yield put({ type: "SET_USER_AVATAR", payload: res.data.avatar });
	} catch (e) {
		console.log(e);
	}
}

export default function* userAvatarSaga() {
	yield takeEvery("CHANGE_USER_AVATAR", changeAvatar);
}
