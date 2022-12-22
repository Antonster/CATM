import { memo } from "react";

const DocumentTypeList = ({
	documentTypes,
	searchParamsObj,
	onUpdateCurrentTab,
}) => {
	return (
		<div className="list-block">
			<ul className="list-block__list">
				{documentTypes?.map(({ id, name }) => (
					<li
						key={id}
						className={`list-block__list-item ${
							id === +searchParamsObj?.type ? "active" : ""
						}`}
						onClick={() => onUpdateCurrentTab(id)}
					>
						<span>{name}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default memo(DocumentTypeList);
