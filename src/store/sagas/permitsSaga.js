import { put, call, takeEvery } from "redux-saga/effects";
import permitsService from "../../services/permits.service";
import {
	setEmployees,
	setMoreEmployees,
	setWorkTypes,
	setRiskFactors,
	setEveryoneExceptEmployees,
} from "../actions/permits";

function* fetchEmployees(action) {
	try {
		const result = yield call(() =>
			permitsService.getEmployees(action.payload)
		);
		yield put(setEmployees(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "PERMITS_ERROR" });
	}
}

function* fetchMoreEmployees(action) {
	try {
		const result = yield call(() =>
			permitsService.getEmployees(action.payload)
		);
		yield put(setMoreEmployees(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "PERMITS_ERROR" });
	}
}

function* fetchWorkTypes() {
	try {
		const result = yield call(permitsService.getWorkTypes);
		yield put(setWorkTypes(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "PERMITS_ERROR" });
	}
}

function* fetchRiskFactors() {
	try {
		const result = yield call(permitsService.getRiskFactors);
		yield put(setRiskFactors(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "PERMITS_ERROR" });
	}
}

function* fetchEveryoneExceptEmployees() {
	try {
		const result = yield call(permitsService.getEveryoneExceptEmployees);
		yield put(setEveryoneExceptEmployees(result.data));
	} catch (e) {
		console.log(e);
		yield put({ type: "PERMITS_ERROR" });
	}
}

export default function* permitsSaga() {
	yield takeEvery("PERMITS_FETCH_EMPLOYEES", fetchEmployees);
	yield takeEvery("PERMITS_FETCH_MORE_EMPLOYEES", fetchMoreEmployees);
	yield takeEvery("PERMITS_FETCH_WORK_TYPES", fetchWorkTypes);
	yield takeEvery("PERMITS_FETCH_RISK_FACTORS", fetchRiskFactors);
	yield takeEvery(
		"PERMITS_FETCH_EVERYONE_EXPECT_EMPLOYEES",
		fetchEveryoneExceptEmployees
	);
}
