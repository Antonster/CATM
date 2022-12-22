import { memo, useCallback } from "react";
import { useCustomSearchParams } from "../../hooks/useSearchParams";
import "./sortArrow.css";

const SortArrow = ({ title, dirSortName, revSortName }) => {
	const { updateSearchParam, searchParamsObj } = useCustomSearchParams();
	const currentSortValue = searchParamsObj?.ordering;

	const sortHandle = useCallback(() => {
		if (!currentSortValue || currentSortValue !== dirSortName) {
			updateSearchParam("ordering", dirSortName);
		} else {
			updateSearchParam("ordering", revSortName);
		}
	}, [currentSortValue, dirSortName, revSortName, updateSearchParam]);

	return (
		<div onClick={sortHandle}>
			<svg
				className={`icon icon-select-bg ${
					currentSortValue === dirSortName ? "sort-arrow__revert" : ""
				}`}
			>
				<use href="/img/svg/sprite.svg#select-bg" />
			</svg>
			<span>{title}</span>
		</div>
	);
};

export default memo(SortArrow);
