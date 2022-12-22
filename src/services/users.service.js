import { axiosInstance } from "../API/API";
import { getCookie } from "../assets/helper.funcs";

class userService {
	getAllUsers = async (searchString) => {
		return await axiosInstance.get(`/users?${searchString}`);
	};

	getUserById = async (userId) => {
		return await axiosInstance.get(`/users/${userId}`);
	};

	getCurrentUser = async () => {
		return await axiosInstance.get("/users/current-user");
	};

	patchUser = async (userId, formData) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.patch(`/users/${userId}/`, formData, {
			headers: {
				"X-CSRFToken": csrf,
				"Content-Type": "multipart/form-data",
			},
		});
	};

	createUser = async (formData) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(`/users/`, formData, {
			headers: {
				"X-CSRFToken": csrf,
				"Content-Type": "multipart/form-data",
			},
		});
	};

	getTrainingCategories = async () => {
		return await axiosInstance.get("/trainings/category");
	};

	getBriefingsList = async () => {
		return await axiosInstance.get("/briefings");
	};

	sendUserListToBriefings = async (userIdList, briefingId) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(
			`/briefings/${briefingId}/submit-users/`,
			userIdList,
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};

	setUsersAvatar = async (formData) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(
			`/users/current-user/set-avatar`,
			formData,
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};

	deleteUsersAvatar = async () => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.delete(`/users/current-user/delete-avatar`, {
			headers: {
				"X-CSRFToken": csrf,
			},
		});
	};

	getQRCode = async () => {
		return axiosInstance.get(`/users/qr`);
	};

	getOrganization = async () => {
		return axiosInstance.get(`/users/organization`);
	};

	generateCommonDocument = async (userId) => {
		const csrf = getCookie("csrftoken");
		return axiosInstance.post(
			`/users/${userId}/common-document`,
			{},
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};
}

export default new userService();
