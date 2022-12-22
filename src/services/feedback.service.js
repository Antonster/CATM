import { axiosInstance } from "../API/API";
import { getCookie } from "../assets/helper.funcs";

class feedbackService {
	postFeedback = async (data) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(`/feedbacks/`, data, {
			headers: {
				"X-CSRFToken": csrf,
			},
		});
	};
}

export default new feedbackService();
