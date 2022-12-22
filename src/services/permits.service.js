import { axiosInstance } from "../API/API";
import { getCookie } from "../assets/helper.funcs";

class permitsService {
	getWorkPermits = async (searchString) => {
		return await axiosInstance.get(`/work-permits?${searchString}`);
	};

	getWorkPermitById = async (permitId) => {
		return await axiosInstance.get(`/work-permits/${permitId}`);
	};

	deleteWorkPermitById = async (permitId) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.delete(`/work-permits/${permitId}`, {
			headers: {
				"X-CSRFToken": csrf,
			},
		});
	};

	addDocument = async (permitId, data) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(
			`/work-permits/${permitId}/upload_document/`,
			data,
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};

	removeDocument = async (permitId, documentId) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.delete(
			`/work-permits/${permitId}/${documentId}`,
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};

	postWorkers = async (permitId, data) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.patch(
			`/work-permits/${permitId}/update_workers/`,
			data,
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};

	generatePdf = async (permitId) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(
			`/work-permits/${permitId}/pdf`,
			{},
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};

	getWorkTypes = async () => {
		return await axiosInstance.get(`/work-permits/work-type`);
	};

	getOptions = async () => {
		return await axiosInstance.get(`/work-permits/options`);
	};

	getEmployees = async (searchString) => {
		return await axiosInstance.get(
			searchString
				? `/work-permits/users/employees?${searchString}`
				: `/work-permits/users/employees`
		);
	};

	getEveryoneExceptEmployees = async () => {
		return await axiosInstance.get(
			`/work-permits/users/everyone_except_employees`
		);
	};

	getResponsibleManagers = async () => {
		return await axiosInstance.get(`/work-permits/users/responsible_managers`);
	};

	setWorkPermits = async (formData) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(`/work-permits/`, formData, {
			headers: {
				"X-CSRFToken": csrf,
				"Content-Type": "multipart/form-data",
			},
		});
	};

	signPermit = async (permitId, queryParams) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(
			`/work-permits/${permitId}/sign?${queryParams}`,
			{},
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};

	getRiskFactors = async () => {
		return await axiosInstance.get(`/work-permits/risk_factors_document`);
	};

	archivingPermit = async (permitId) => {
		const csrf = getCookie("csrftoken");
		const data = new FormData();
		return await axiosInstance.post(`/work-permits/${permitId}/close/`, data, {
			headers: {
				"X-CSRFToken": csrf,
				"Content-Type": "multipart/form-data",
			},
		});
	};

	createDailyPermit = async (id, formData) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(
			`/work-permits/${id}/add_daily/`,
			formData,
			{
				headers: {
					"X-CSRFToken": csrf,
					"Content-Type": "multipart/form-data",
				},
			}
		);
	};

	removeDailyPermit = async (permitId, dailyId) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.delete(
			`/work-permits/${permitId}/daily/${dailyId}/sign`,
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};

	signDailyPermit = async (permitId, dailyId, role, date_end) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(
			!!date_end
				? `/work-permits/${permitId}/daily/${dailyId}/sign?date_end=${date_end}&role=${role}`
				: `/work-permits/${permitId}/daily/${dailyId}/sign?role=${role}`,
			{},
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};

	createAnalyze = async (formData) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(`/work-permits/gas_analysis`, formData, {
			headers: {
				"X-CSRFToken": csrf,
				"Content-Type": "multipart/form-data",
			},
		});
	};

	removeAnalyze = async (id) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.delete(`/work-permits/gas_analysis/${id}`, {
			headers: {
				"X-CSRFToken": csrf,
			},
		});
	};

	extendPermit = async (id, formData) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(`/work-permits/${id}/extend/`, formData, {
			headers: {
				"X-CSRFToken": csrf,
			},
		});
	};

	extendPermitSign = async (id) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(
			`/work-permits/${id}/extend/sign?sign=true`,
			{},
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};

	updateWorkers = async (id, data) => {
		const csrf = getCookie("csrftoken");
		return await axiosInstance.post(
			`/work-permits/${id}/update_workers`,
			data,
			{
				headers: {
					"X-CSRFToken": csrf,
				},
			}
		);
	};
}

export default new permitsService();
