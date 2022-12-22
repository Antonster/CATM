const initialState = {
	isLoading: false,
	error: null,
	allEmployees: null,
	workTypes: null,
	riskFactors: null,
	everyoneExceptEmployees: null,
};

export function permitsReducer(state = initialState, action) {
	switch (action.type) {
		case "PERMITS_FETCH_EMPLOYEES": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "PERMITS_SET_EMPLOYEES": {
			return {
				...state,
				isLoading: false,
				allEmployees: action.payload,
				error: null,
			};
		}
		case "PERMITS_FETCH_WORK_TYPES": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "PERMITS_SET_WORK_TYPES": {
			return {
				...state,
				isLoading: false,
				workTypes: action.payload,
				error: null,
			};
		}
		case "PERMITS_FETCH_RISK_FACTORS": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "PERMITS_SET_RISK_FACTORS": {
			return {
				...state,
				isLoading: false,
				riskFactors: action.payload,
				error: null,
			};
		}
		case "PERMITS_FETCH_EVERYONE_EXPECT_EMPLOYEES": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "PERMITS_SET_EVERYONE_EXPECT_EMPLOYEES": {
			return {
				...state,
				isLoading: false,
				everyoneExceptEmployees: action.payload,
				error: null,
			};
		}
		case "PERMITS_FETCH_MORE_EMPLOYEES": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "PERMITS_SET_MORE_EMPLOYEES": {
			return {
				...state,
				isLoading: false,
				allEmployees: {
					...state.allUsers,
					next: action.payload.next,
					results: [...state.allEmployees.results, ...action.payload.results],
				},
				error: null,
			};
		}
		case "PERMITS_ERROR": {
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
