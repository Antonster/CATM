export function getCookie(name) {
	let matches = document.cookie.match(
		new RegExp(
			"(?:^|; )" +
				name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
				"=([^;]*)"
		)
	);
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name, value, options = {}) {
	options = {
		path: "/",
		...options,
	};

	if (options.expires instanceof Date) {
		options.expires = options.expires.toUTCString();
	}

	let updatedCookie =
		encodeURIComponent(name) + "=" + encodeURIComponent(value);

	for (let optionKey in options) {
		updatedCookie += "; " + optionKey;
		let optionValue = options[optionKey];
		if (optionValue !== true) {
			updatedCookie += "=" + optionValue;
		}
	}
	document.cookie = updatedCookie;
}

export function phoneMask(value) {
	if (!value || value.length < 3) {
		return "+7 ";
	}
	const x = value
		.slice(2)
		.replace(/\D/g, "")
		.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
	return (
		"+7 " +
		(x[1] ? "(" + x[1] : "") +
		(x[2] ? ") " + x[2] : "") +
		(x[3] ? " " + x[3] : "")
	);
}

export function dateMask(value) {
	if (!value || !value.length) {
		return "";
	}
	const x = value.replace(/\D/g, "").match(/(\d{0,2})(\d{0,2})(\d{0,4})/);
	return x[1] + (x[2] ? "." + x[2] : "") + (x[3] ? "." + x[3] : "");
}

export function relativeUrlResolver(url) {
	if (process.env.REACT_APP_MODE !== "dev") {
		return url;
	}
	if (url && url.slice(0, 4) !== "http") {
		return "http://catm.msharks.ru" + url;
	}
	return url;
}

export function prettifySize(file_size) {
	if (file_size < 1000000) {
		return (file_size / 1024).toFixed(1) + " КБ";
	} else {
		return (file_size / 1024 / 1024).toFixed(1) + " MБ";
	}
}

export function isDatePassed(str) {
	if (!str || !str.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
		return true;
	}
	const dateString = str.split(".").reverse().join("-");
	return Date.now() > new Date(dateString);
}
