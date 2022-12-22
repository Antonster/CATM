import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const axiosInstance = axios.create({
	baseURL: API_URL,
	responseType: "json",
});

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (
			error.response.status === 401 &&
			window.location.pathname !== "/login"
		) {
			window.location.replace("/login");
		}
		throw error;
	}
);

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response.status === 403) {
			window.location.replace("/");
		}
		throw error;
	}
);
