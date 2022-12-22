import { axiosInstance } from "../API/API";
import { getCookie } from "../assets/helper.funcs";

class briefingsService {
	getBriefingsCategories = async () => {
		return await axiosInstance.get(`/briefings/categories`);
	};

	getBriefingsTypes = async () => {
		return await axiosInstance.get(`/briefings/types`);
	};

	getBriefingsList = async () => {
		return await axiosInstance.get(`/briefings`);
	};

	getMyBriefingsList = async (searchString) => {
		return await axiosInstance.get(
			searchString
				? `/briefings/my_briefings?${searchString}`
				: `/briefings/my_briefings`
		);
	};

	getBriefingById = async (id) => {
		return await axiosInstance.get(`/briefings/${id}`);
	};

	deleteBriefing = async (id) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.delete(`/briefings/${id}`, {
			headers: {
				"X-CSRFToken": csrf,
			},
		});
	};

	getQuiz = async (id) => {
		return await axiosInstance.get(`/briefings/quiz/${id}`);
	};

	postBriefingSign = async (id) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(
			`/briefings/${id}/sign`,
			{},
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};

	postQuiz = async (data) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(`/briefings/quiz`, data, {
			headers: {
				"X-CSRFToken": csrf,
			},
		});
	};

	addBriefing = async (formData) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(`/briefings/`, formData, {
			headers: {
				"X-CSRFToken": csrf,
				"Content-Type": "multipart/form-data",
			},
		});
	};

	patchBriefing = async (id, formData) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.patch(`/briefings/${id}/`, formData, {
			headers: {
				"X-CSRFToken": csrf,
				"Content-Type": "multipart/form-data",
			},
		});
	};

	getBriefingUsers = async (id, searchString) => {
		return await axiosInstance.get(
			searchString
				? `/briefings/${id}/users?${searchString}`
				: `/briefings/${id}/users`
		);
	};

	deleteBriefingUser = async (briefingId, userId) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.delete(
			`/briefings/${briefingId}/user_briefing/?user_briefing_id=${userId}`,
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};

	signBriefingUser = async (briefingId, userId) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(
			`/briefings/${briefingId}/${userId}/sign`,
			{},
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};

	signAllBriefingUser = async (briefingId) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(
			`/briefings/${briefingId}/sign_all`,
			{},
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};

	fetchAllUsers = async (searchString) => {
		return await axiosInstance.get(
			searchString ? `/users?${searchString}` : `/users`
		);
	};

	updateBriefingUsers = async (briefingId, data) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(
			`/briefings/${briefingId}/submit-users/`,
			data,
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};

	updateBriefingAllUsers = async (briefingId) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(
			`/briefings/${briefingId}/submit-users/all`,
			{},
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};
}

export default new briefingsService();
