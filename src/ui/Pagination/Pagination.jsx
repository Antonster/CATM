import { memo, useCallback } from "react";
import { useCustomSearchParams } from "../../hooks/useSearchParams";
import MuiPagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Select from "react-select";
import { styled } from "@mui/material/styles";
import { DropdownIndicator } from "../SelectTemplate/SelectTemplate";
import "./pagination.css";

const StyledPagination = styled(MuiPagination)(() => ({
	"& .MuiPaginationItem-text": {
		fontFamily: "Museo Sans Cyrl",
		fontStyle: "normal",
		fontWeight: "400",
		fontSize: "16px",
		lineHeight: "20px",
		color: "#2A2D3F",
	},
	"& .Mui-selected": {
		color: "#1a72fe",
		fontWeight: "700",
	},
	"& .MuiPagination-ul": {
		padding: 0,
		listStyleType: "none",
	},
}));

const selectStyles = {
	valueContainer: (styles) => ({
		...styles,
		padding: "0",
	}),
	control: (styles) => ({
		...styles,
		width: "60px",
		border: "none",

		"&:hover": {
			border: "none",
		},
	}),
	indicatorSeparator: () => ({}),
	option: (styles) => ({
		...styles,
		cursor: "pointer",
	}),
};

const pageOptions = [
	{ label: 10, value: 10 },
	{ label: 20, value: 20 },
	{ label: 30, value: 30 },
];

const Pagination = ({ itemsTotal }) => {
	const { updateSearchParam, searchParamsObj, setSearchParams } =
		useCustomSearchParams();
	const currentPage = searchParamsObj.page || 1;
	const itemsOnPage = searchParamsObj.pagesize || 10;
	const totalPages = itemsTotal ? Math.ceil(itemsTotal / itemsOnPage) : 1;
	const itemsFrom = itemsTotal === 0 ? 0 : (currentPage - 1) * itemsOnPage + 1;
	const itemsTo =
		currentPage < totalPages ? currentPage * itemsOnPage : itemsTotal;

	const onChangeItemsOnPage = useCallback(
		(newTasksOnPage) => {
			setSearchParams({
				...searchParamsObj,
				pagesize: newTasksOnPage,
				page: 1,
			});
		},
		[searchParamsObj, setSearchParams]
	);

	const onChangeCurrentPage = useCallback(
		(event, newPageNumber) => {
			if (
				+newPageNumber > +totalPages ||
				+newPageNumber < 1 ||
				+newPageNumber === currentPage
			) {
				return;
			}
			updateSearchParam("page", newPageNumber);
		},
		[currentPage, totalPages, updateSearchParam]
	);

	const onChangeSelectValue = useCallback(
		({ value }) => onChangeItemsOnPage(value),
		[onChangeItemsOnPage]
	);

	return (
		<div className="pagination-wrap">
			<div className="pagination-wrap__count-block">
				<div className="pagination-wrap__count">
					<div className="pagination-wrap__count-text">Отображать по:</div>
					<div>
						<Select
							components={{ DropdownIndicator }}
							styles={selectStyles}
							placeholder=""
							menuPlacement="top"
							value={
								pageOptions.find(
									({ value: val }) => val === +searchParamsObj.pagesize
								) || { label: 10, value: 10 }
							}
							onChange={onChangeSelectValue}
							options={pageOptions}
							isSearchable={false}
						/>
					</div>
				</div>
				<div className="pagination-wrap__item-number">{`${itemsFrom}-${itemsTo} из ${itemsTotal}`}</div>
			</div>
			<div className="pagination-wrapper">
				<StyledPagination
					count={totalPages}
					page={+currentPage}
					onChange={onChangeCurrentPage}
					showFirstButton
					showLastButton
					renderItem={(item) => (
						<PaginationItem
							components={{
								first: () => <img src="/img/svg/prev-double.svg" alt="" />,
								previous: () => <img src="/img/svg/prev.svg" alt="" />,
								next: () => <img src="/img/svg/next.svg" alt="" />,
								last: () => <img src="/img/svg/next-double.svg" alt="" />,
							}}
							{...item}
						/>
					)}
				/>
			</div>
		</div>
	);
};

export default memo(Pagination);
