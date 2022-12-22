import { put, call, takeEvery } from "redux-saga/effects";
import briefingsService from "../../services/briefings.service";
import {
	setBriefingsCategories,
	setBriefingsTypes,
	setBriefingsList,
	setMyBriefingsList,
	setQuiz,
	setActiveBriefing,
	setBriefingUsers,
	setAllUsers,
	setMoreUsers,
} from "../actions/briefings";

function* fetchBriefingsCategories() {
	try {
		const result = yield call(briefingsService.getBriefingsCategories);
		yield put(setBriefingsCategories(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

function* fetchBriefingsTypes() {
	try {
		const result = yield call(briefingsService.getBriefingsTypes);
		yield put(setBriefingsTypes(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

function* fetchBriefingsList() {
	try {
		const result = yield call(briefingsService.getBriefingsList);
		yield put(setBriefingsList(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

function* fetchMyBriefingsList(action) {
	try {
		const result = yield call(() =>
			briefingsService.getMyBriefingsList(action.payload)
		);
		yield put(setMyBriefingsList(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

function* fetchBriefingById(action) {
	try {
		const result = yield call(() =>
			briefingsService.getBriefingById(action.payload.id)
		);
		yield put(setActiveBriefing(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

function* postBriefingSign(action) {
	try {
		yield call(() => briefingsService.postBriefingSign(action.payload.id));
		const result = yield call(briefingsService.getBriefingsList);
		yield put(setBriefingsList(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

function* fetchQuiz(action) {
	try {
		const result = yield call(() =>
			briefingsService.getQuiz(action.payload.id)
		);
		yield put(setQuiz(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

function* postQuiz(action) {
	try {
		yield call(() => briefingsService.postQuiz(action.payload));
		yield put(setQuiz(null));
		const result = yield call(briefingsService.getBriefingsList);
		yield put(setBriefingsList(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
		yield put(setQuiz(null));
	}
}

function* deleteBriefing(action) {
	try {
		yield call(() => briefingsService.deleteBriefing(action.payload.id));

		if (action.payload?.onMoveFirstPage) {
			yield action.payload.onMoveFirstPage();
		} else {
			const result = yield call(() =>
				briefingsService.getMyBriefingsList(action.payload.searchString)
			);
			yield put(setMyBriefingsList(result.data));
		}
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

function* addBriefing(action) {
	try {
		yield call(() => briefingsService.addBriefing(action.payload.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	} finally {
		yield action.payload.navigate("/briefings/creator");
	}
}

function* patchBriefing(action) {
	try {
		yield call(() =>
			briefingsService.patchBriefing(action.payload.id, action.payload.data)
		);
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	} finally {
		yield action.payload.navigate("/briefings/creator");
	}
}

function* fetchBriefingUsers(action) {
	try {
		const result = yield call(() =>
			briefingsService.getBriefingUsers(
				action.payload.id,
				action.payload.searchString
			)
		);
		yield put(setBriefingUsers(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

function* deleteBriefingUser(action) {
	try {
		yield call(() =>
			briefingsService.deleteBriefingUser(
				action.payload.briefingId,
				action.payload.userId
			)
		);
		const users = yield call(() =>
			briefingsService.getBriefingUsers(
				action.payload.briefingId,
				action.payload.searchString
			)
		);
		yield put(setBriefingUsers(users.data));
		const briefing = yield call(() =>
			briefingsService.getBriefingById(action.payload.briefingId)
		);
		yield put(setActiveBriefing(briefing.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

function* signBriefingUser(action) {
	try {
		yield call(() =>
			briefingsService.signBriefingUser(
				action.payload.briefingId,
				action.payload.userId
			)
		);
		const users = yield call(() =>
			briefingsService.getBriefingUsers(
				action.payload.briefingId,
				action.payload.searchString
			)
		);
		yield put(setBriefingUsers(users.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

function* signAllBriefingUser(action) {
	try {
		yield call(() =>
			briefingsService.signAllBriefingUser(action.payload.briefingId)
		);
		const users = yield call(() =>
			briefingsService.getBriefingUsers(
				action.payload.briefingId,
				action.payload.searchString
			)
		);
		yield put(setBriefingUsers(users.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

function* fetchAllUsers(action) {
	try {
		const users = yield call(() =>
			briefingsService.fetchAllUsers(action.payload)
		);
		yield put(setAllUsers(users.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

function* fetchMoreUsers(action) {
	try {
		const users = yield call(() =>
			briefingsService.fetchAllUsers(action.payload)
		);
		yield put(setMoreUsers(users.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

function* updateBriefingUsers(action) {
	try {
		yield call(() =>
			briefingsService.updateBriefingUsers(
				action.payload.briefingId,
				action.payload.data
			)
		);
		const users = yield call(() =>
			briefingsService.getBriefingUsers(action.payload.briefingId)
		);
		yield put(setBriefingUsers(users.data));
		const briefing = yield call(() =>
			briefingsService.getBriefingById(action.payload.briefingId)
		);
		yield put(setActiveBriefing(briefing.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

function* updateBriefingAllUsers(action) {
	try {
		yield call(() => briefingsService.updateBriefingAllUsers(action.payload));
		const users = yield call(() =>
			briefingsService.getBriefingUsers(action.payload)
		);
		yield put(setBriefingUsers(users.data));
		const briefing = yield call(() =>
			briefingsService.getBriefingById(action.payload)
		);
		yield put(setActiveBriefing(briefing.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "BRIEFINGS_ERROR" });
	}
}

export default function* briefingsSaga() {
	yield takeEvery("BRIEFINGS_FETCH_CATEGORIES", fetchBriefingsCategories);
	yield takeEvery("BRIEFINGS_FETCH_TYPES", fetchBriefingsTypes);
	yield takeEvery("BRIEFINGS_FETCH_LIST", fetchBriefingsList);
	yield takeEvery("BRIEFINGS_FETCH_MY_LIST", fetchMyBriefingsList);
	yield takeEvery("BRIEFINGS_POST_SIGN", postBriefingSign);
	yield takeEvery("BRIEFINGS_FETCH_QUIZ", fetchQuiz);
	yield takeEvery("BRIEFINGS_POST_QUIZ", postQuiz);
	yield takeEvery("BRIEFINGS_DELETE", deleteBriefing);
	yield takeEvery("BRIEFINGS_ADD", addBriefing);
	yield takeEvery("BRIEFINGS_FETCH_BY_ID", fetchBriefingById);
	yield takeEvery("BRIEFINGS_PATCH", patchBriefing);
	yield takeEvery("BRIEFINGS_FETCH_USERS", fetchBriefingUsers);
	yield takeEvery("BRIEFINGS_USER_BRIEFING", deleteBriefingUser);
	yield takeEvery("BRIEFINGS_SIGN_USER", signBriefingUser);
	yield takeEvery("BRIEFINGS_SIGN_ALL_USERS", signAllBriefingUser);
	yield takeEvery("BRIEFINGS_FETCH_ALL_USERS", fetchAllUsers);
	yield takeEvery("BRIEFINGS_FETCH_MORE_USERS", fetchMoreUsers);
	yield takeEvery("BRIEFINGS_UPDATE_BRIEFING_USERS", updateBriefingUsers);
	yield takeEvery(
		"BRIEFINGS_UPDATE_BRIEFING_ALL_USERS",
		updateBriefingAllUsers
	);
}
