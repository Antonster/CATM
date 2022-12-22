import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const useCustomSearchParams = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const searchParamsObj = useMemo(() => {
		return Object.fromEntries(searchParams.entries());
	}, [searchParams]);

	const updateSearchParam = (paramName, newParamValue) => {
		const currentParamValue = searchParams.get(paramName);
		if (currentParamValue === newParamValue) {
			return;
		}
		setSearchParams({
			...searchParamsObj,
			[paramName]: newParamValue,
		});
	};

	return {
		updateSearchParam,
		searchParamsObj,
		setSearchParams,
		searchParams,
	};
};
