export const fetchEmployees = (searchString) => {
	return { type: "PERMITS_FETCH_EMPLOYEES", payload: searchString };
};
export const setEmployees = (data) => {
	return { type: "PERMITS_SET_EMPLOYEES", payload: data };
};
export const fetchMoreEmployees = (searchString) => {
	return { type: "PERMITS_FETCH_MORE_EMPLOYEES", payload: searchString };
};
export const setMoreEmployees = (data) => {
	return { type: "PERMITS_SET_MORE_EMPLOYEES", payload: data };
};
export const fetchWorkTypes = () => {
	return { type: "PERMITS_FETCH_WORK_TYPES" };
};
export const setWorkTypes = (data) => {
	return { type: "PERMITS_SET_WORK_TYPES", payload: data };
};
export const fetchRiskFactors = () => {
	return { type: "PERMITS_FETCH_RISK_FACTORS" };
};
export const setRiskFactors = (data) => {
	return { type: "PERMITS_SET_RISK_FACTORS", payload: data };
};
export const fetchEveryoneExceptEmployees = () => {
	return { type: "PERMITS_FETCH_EVERYONE_EXPECT_EMPLOYEES" };
};
export const setEveryoneExceptEmployees = (data) => {
	return { type: "PERMITS_SET_EVERYONE_EXPECT_EMPLOYEES", payload: data };
};
