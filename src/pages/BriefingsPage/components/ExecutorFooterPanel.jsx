import { memo } from "react";

const ExecutorFooterPanel = ({ activeTypeItem, signBriefing, getQuiz }) => {
	return (
		<>
			{activeTypeItem && (
				<div className="special-menu__footer small">
					{activeTypeItem.userbriefing_signed_at &&
						activeTypeItem.quiz &&
						activeTypeItem.is_quiz_passed && (
							<div className="sBriefing__status">
								<img src="/img/svg/ok.svg" alt="" />
								<span>Тест пройден, инструктаж подписан</span>
							</div>
						)}
					{activeTypeItem.userbriefing_signed_at && !activeTypeItem.quiz && (
						<div className="sBriefing__status">
							<img src="/img/svg/ok.svg" alt="" />
							<span>Инструктаж подписан</span>
						</div>
					)}
					{!activeTypeItem.userbriefing_signed_at && !activeTypeItem.quiz && (
						<button
							className="btn btn-primary"
							onClick={() => signBriefing(activeTypeItem.id)}
						>
							Подписать
						</button>
					)}
					{!activeTypeItem.userbriefing_signed_at &&
						activeTypeItem.is_quiz_passed && (
							<>
								<div className="sBriefing__status">
									<img src="/img/svg/ok.svg" alt="" />
									<span>Тест пройден</span>
								</div>
								<button
									className="btn btn-primary"
									onClick={() => signBriefing(activeTypeItem.id)}
								>
									Подписать
								</button>
							</>
						)}
					{!activeTypeItem.userbriefing_signed_at &&
						!activeTypeItem.is_quiz_passed &&
						activeTypeItem.quiz && (
							<button
								className="btn btn-primary"
								onClick={() => getQuiz(activeTypeItem.quiz)}
							>
								Пройти тест
							</button>
						)}
				</div>
			)}
		</>
	);
};

export default memo(ExecutorFooterPanel);
