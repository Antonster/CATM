export const fetchBriefingsCategories = () => {
	return { type: "BRIEFINGS_FETCH_CATEGORIES" };
};
export const setBriefingsCategories = (data) => {
	return { type: "BRIEFINGS_SET_CATEGORIES", payload: data };
};
export const fetchBriefingsTypes = () => {
	return { type: "BRIEFINGS_FETCH_TYPES" };
};
export const setBriefingsTypes = (data) => {
	return { type: "BRIEFINGS_SET_TYPES", payload: data };
};
export const fetchBriefingsList = () => {
	return { type: "BRIEFINGS_FETCH_LIST" };
};
export const setBriefingsList = (data) => {
	return { type: "BRIEFINGS_SET_LIST", payload: data };
};
export const postBriefingSign = (id) => {
	return { type: "BRIEFINGS_POST_SIGN", payload: { id } };
};
export const fetchQuiz = (id) => {
	return { type: "BRIEFINGS_FETCH_QUIZ", payload: { id } };
};
export const setQuiz = (data) => {
	return { type: "BRIEFINGS_SET_QUIZ", payload: data };
};
export const postQuiz = (data) => {
	return { type: "BRIEFINGS_POST_QUIZ", payload: data };
};
export const fetchMyBriefingsList = (searchString) => {
	return { type: "BRIEFINGS_FETCH_MY_LIST", payload: searchString };
};
export const setMyBriefingsList = (data) => {
	return { type: "BRIEFINGS_SET_MY_LIST", payload: data };
};
export const deleteBriefing = (id, searchString, onMoveFirstPage) => {
	return {
		type: "BRIEFINGS_DELETE",
		payload: { id, searchString, onMoveFirstPage },
	};
};
export const addBriefing = (data, navigate) => {
	return { type: "BRIEFINGS_ADD", payload: { data, navigate } };
};
export const fetchBriefingById = (id) => {
	return { type: "BRIEFINGS_FETCH_BY_ID", payload: { id } };
};
export const patchBriefing = (id, data, navigate) => {
	return { type: "BRIEFINGS_PATCH", payload: { id, data, navigate } };
};
export const setActiveBriefing = (data) => {
	return { type: "BRIEFINGS_SET_ACTIVE_BRIEFING", payload: data };
};
export const fetchBriefingUsers = (id, searchString) => {
	return { type: "BRIEFINGS_FETCH_USERS", payload: { id, searchString } };
};
export const setBriefingUsers = (data) => {
	return { type: "BRIEFINGS_SET_BRIEFING_USERS", payload: data };
};
export const deleteBriefingUser = (briefingId, userId, searchString) => {
	return {
		type: "BRIEFINGS_USER_BRIEFING",
		payload: { briefingId, userId, searchString },
	};
};
export const signBriefingUser = (briefingId, userId, searchString) => {
	return {
		type: "BRIEFINGS_SIGN_USER",
		payload: { briefingId, userId, searchString },
	};
};
export const signAllBriefingUser = (briefingId, searchString) => {
	return {
		type: "BRIEFINGS_SIGN_ALL_USERS",
		payload: { briefingId, searchString },
	};
};
export const fetchAllUsers = (searchString) => {
	return { type: "BRIEFINGS_FETCH_ALL_USERS", payload: searchString };
};
export const setAllUsers = (data) => {
	return { type: "BRIEFINGS_SET_ALL_USERS", payload: data };
};
export const fetchMoreUsers = (searchString) => {
	return { type: "BRIEFINGS_FETCH_MORE_USERS", payload: searchString };
};
export const setMoreUsers = (data) => {
	return { type: "BRIEFINGS_SET_MORE_USERS", payload: data };
};
export const updateBriefingUsers = (briefingId, data) => {
	return {
		type: "BRIEFINGS_UPDATE_BRIEFING_USERS",
		payload: { briefingId, data },
	};
};
export const updateBriefingAllUsers = (briefingId) => {
	return { type: "BRIEFINGS_UPDATE_BRIEFING_ALL_USERS", payload: briefingId };
};
