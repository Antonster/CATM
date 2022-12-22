import { axiosInstance } from "../API/API";
import { getCookie } from "../assets/helper.funcs";

class documentsService {
	getDocuments = async (searchString) => {
		return await axiosInstance.get(`/documents/?${searchString}`);
	};

	uploadDocument = async (formData) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(`/documents/`, formData, {
			headers: {
				"X-CSRFToken": csrf,
			},
		});
	};

	deleteDocument = async (id) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.delete(`/documents/${id}/`, {
			headers: {
				"X-CSRFToken": csrf,
			},
		});
	};

	getDocumentTypes = async () => {
		return await axiosInstance.get(`/documents/types`);
	};
}

export default new documentsService();
