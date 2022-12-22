import { memo, useCallback } from "react";

const tableCategories = [
	{
		id: "1",
		text: "ФИО",
		param: "last_name",
		filter: true,
	},
	{
		id: "2",
		text: "Подразделение",
		filter: true,
		param: "unit__title",
	},
	{
		id: "3",
		text: "Должность",
		filter: true,
		param: "position",
	},
	{
		id: "4",
		text: "Медосмотр",
		filter: false,
	},
	{
		id: "5",
		text: "Инструктаж",
		filter: false,
	},
];

const EmployeePageListMenu = ({ setSearchParams, searchParamsObj }) => {
	const changeFilter = useCallback(
		(param) => {
			if (!param) {
				return;
			}

			let newParam;

			if (param === searchParamsObj?.ordering?.slice(1)) {
				newParam = param;
			} else if (param === searchParamsObj?.ordering) {
				newParam = `-${param}`;
			} else {
				newParam = param;
			}

			setSearchParams({
				...searchParamsObj,
				ordering: newParam,
			});
		},
		[searchParamsObj, setSearchParams]
	);

	return (
		<>
			{tableCategories.map(({ id, text, filter, param }) => (
				<div
					key={id}
					className={`employee-list-head__title ${filter ? "pointer" : ""}`}
					onClick={() => changeFilter(param)}
				>
					{filter && (
						<svg
							className={`icon icon-select-bg ${
								param === searchParamsObj?.ordering?.slice(1) ? "top" : ""
							}`}
						>
							<use href="/img/svg/sprite.svg#select-bg"></use>
						</svg>
					)}
					<span className="employee-list-head__text">{text}</span>
				</div>
			))}
		</>
	);
};

export default memo(EmployeePageListMenu);
