import { memo } from "react";
import parse from "html-react-parser";
import { useOutletContext, useNavigate } from "react-router-dom";
import { prettifySize } from "../../../assets/helper.funcs";

const Content = () => {
	const navigate = useNavigate();
	const { setDocumentModalVisible, activeTypeItem } = useOutletContext();

	return (
		<div className="briefing-signing">
			<div className="prev-btn" onClick={() => navigate("/briefings/executor")}>
				<svg className="icon icon-arrow ">
					<use href="/img/svg/sprite.svg#arrow"></use>
				</svg>
			</div>
			<h2>{activeTypeItem?.title}</h2>
			{activeTypeItem?.file && (
				<div className="file" onClick={() => setDocumentModalVisible(true)}>
					<div className="file__img">
						<img src="/img/svg/pdf.svg" alt="" />
					</div>
					<div className="file__info">
						<div className="file__name">{activeTypeItem.file_name}</div>
						<div className="file__type">
							pdf {prettifySize(activeTypeItem.file_size)}
						</div>
					</div>
				</div>
			)}
			{activeTypeItem && (
				<div className="briefing-content">{parse(activeTypeItem.content)}</div>
			)}
		</div>
	);
};

export default memo(Content);
