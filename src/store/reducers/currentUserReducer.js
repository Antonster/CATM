const initState = {
	isLoading: false,
	error: null,
	user: null,
	organization: null,
};

export function currentUserReducer(state = initState, action) {
	switch (action.type) {
		case "AUTH_BY_LOGIN": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "SET_AUTH_ERROR": {
			return {
				...state,
				isLoading: false,
				error: action.payload,
			};
		}
		case "FETCH_CURRENT_USER": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "SET_USER_DATA":
			return {
				...state,
				user: action.payload,
				isLoading: false,
				error: null,
			};
		case "FETCH_ORGANIZATION": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "SET_ORGANIZATION":
			return {
				...state,
				organization: action.payload,
				isLoading: false,
				error: null,
			};
		case "FETCH_USER_AVATAR": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "SET_USER_AVATAR":
			return {
				...state,
				user: {
					...state.user,
					avatar: action.payload,
				},
				isLoading: false,
				error: null,
			};
		case "FETCH_USER_ERROR": {
			return {
				...state,
				user: null,
				isLoading: false,
				error: action.payload,
			};
		}
		default:
			return state;
	}
}
