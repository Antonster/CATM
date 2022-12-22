import { axiosInstance } from "../API/API";

class trainingsService {
	getSchool = async () => {
		return await axiosInstance.get(`/trainings/school`);
	};
}

export default new trainingsService();
