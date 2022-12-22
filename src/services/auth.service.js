import { axiosInstance } from "../API/API";
import { getCookie } from "../assets/helper.funcs";

class authService {
	getCsrf = async () => {
		return axiosInstance.get(`/auth/set-csrf/ `);
	};

	login = async (login, password) => {
		const csrf = getCookie("csrftoken");

		return axiosInstance.post(
			`/auth/login/ `,
			{},
			{
				headers: {
					"X-CSRFToken": csrf,
					"WWW-Authenticate": 'Basic realm="api"',
					Authorization: "Basic " + window.btoa(`${login}:${password}`),
				},
			}
		);
	};
}

export default new authService();
