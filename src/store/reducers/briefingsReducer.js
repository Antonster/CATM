const initState = {
	isLoading: false,
	error: null,
	categories: null,
	types: null,
	list: null,
	myBriefingsList: null,
	activeQuiz: null,
	activeBriefing: null,
	briefingUsers: null,
	allUsers: null,
};

export function briefingsReducer(state = initState, action) {
	switch (action.type) {
		case "BRIEFINGS_FETCH_CATEGORIES": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "BRIEFINGS_SET_CATEGORIES": {
			return {
				...state,
				categories: action.payload,
				isLoading: false,
				error: null,
			};
		}
		case "BRIEFINGS_FETCH_TYPES": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "BRIEFINGS_SET_TYPES": {
			return {
				...state,
				types: action.payload,
				isLoading: false,
				error: null,
			};
		}
		case "BRIEFINGS_FETCH_LIST": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "BRIEFINGS_SET_LIST": {
			return {
				...state,
				list: action.payload,
				isLoading: false,
				error: null,
			};
		}
		case "BRIEFINGS_FETCH_BY_ID": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "BRIEFINGS_SET_ACTIVE_BRIEFING": {
			return {
				...state,
				activeBriefing: action.payload,
				isLoading: false,
				error: null,
			};
		}
		case "BRIEFINGS_FETCH_MY_LIST": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "BRIEFINGS_SET_MY_LIST": {
			return {
				...state,
				myBriefingsList: action.payload,
				isLoading: false,
				error: null,
			};
		}
		case "BRIEFINGS_FETCH_ALL_USERS": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "BRIEFINGS_SET_ALL_USERS": {
			return {
				...state,
				allUsers: action.payload,
				isLoading: false,
				error: null,
			};
		}
		case "BRIEFINGS_FETCH_MORE_USERS": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "BRIEFINGS_SET_MORE_USERS": {
			return {
				...state,
				allUsers: {
					...state.allUsers,
					next: action.payload.next,
					results: [...state.allUsers.results, ...action.payload.results],
				},
				isLoading: false,
				error: null,
			};
		}
		case "BRIEFINGS_FETCH_USERS": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "BRIEFINGS_SET_BRIEFING_USERS": {
			return {
				...state,
				briefingUsers: action.payload,
				isLoading: false,
				error: null,
			};
		}
		case "BRIEFINGS_POST_SIGN": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "BRIEFINGS_FETCH_QUIZ": {
			return {
				...state,
				isLoading: true,
				error: null,
			};
		}
		case "BRIEFINGS_SET_QUIZ": {
			return {
				...state,
				activeQuiz: action.payload,
				isLoading: false,
				error: null,
			};
		}
		case "BRIEFINGS_CLEAR_QUIZ": {
			return {
				...state,
				quiz: null,
				isLoading: false,
				error: null,
			};
		}
		case "BRIEFINGS_ERROR": {
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
