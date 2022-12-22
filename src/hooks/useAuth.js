import dayjs from "dayjs";

export default function useAuth() {
	const expiry = localStorage.getItem("expiry");

	if (!!expiry && dayjs(expiry) - dayjs() > 0) {
		return true;
	}

	localStorage.removeItem("authToken");
	localStorage.removeItem("expiry");
	localStorage.removeItem("role");

	return false;
}
