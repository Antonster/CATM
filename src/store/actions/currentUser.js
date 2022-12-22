export const fetchCurrentUser = () => {
	return { type: "FETCH_CURRENT_USER" };
};
export const setCurrentUser = (data) => {
	return { type: "SET_USER_DATA", payload: data };
};
export const fetchOrganization = () => {
	return { type: "FETCH_ORGANIZATION" };
};
export const setOrganization = (data) => {
	return { type: "SET_ORGANIZATION", payload: data };
};
