import { memo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { briefingsActions } from "../../store/actions";

const Quiz = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const activeQuiz = useSelector((state) => state.briefings?.activeQuiz);
	const [activeIndex, setActiveIndex] = useState(0);
	const [questions, setQuestion] = useState();

	const updateQuestions = useCallback(
		(index) => {
			const newQuestions = [...questions];
			newQuestions[activeIndex].choices[index].is_checked =
				!newQuestions[activeIndex].choices[index].is_checked;

			newQuestions.forEach((item, index) => {
				newQuestions[index].isValid = !!item.choices.find(
					({ is_checked }) => is_checked
				);
			});

			setQuestion(newQuestions);
		},
		[activeIndex, questions]
	);

	const onClickBack = useCallback(() => {
		navigate("/briefings/executor", { replace: true });
		dispatch(briefingsActions.setQuiz(null));
	}, [dispatch, navigate]);

	const onClickNext = useCallback(
		(index) => {
			if (index <= questions.length - 1) {
				setActiveIndex(index);
			} else {
				const data = {
					id: activeQuiz.id,
					questions,
				};

				navigate(-1, { replace: true });
				dispatch(briefingsActions.postQuiz(data));
			}
		},
		[activeQuiz.id, dispatch, navigate, questions]
	);

	const onClickTab = useCallback(
		(index) => {
			if (questions[index].isValid) {
				setActiveIndex(index);
			}
		},
		[questions]
	);

	useEffect(() => {
		setQuestion(
			activeQuiz?.questions?.map(({ id, choices, text }) => ({
				id,
				text,
				isValid: false,
				choices: choices.map(({ id, text }) => ({
					id,
					text,
					is_checked: false,
				})),
			}))
		);
	}, [activeQuiz]);

	useEffect(() => {
		if (!activeQuiz) {
			navigate("/briefings/executor", { replace: true });
		}
	}, [activeQuiz]);

	return (
		<div className="briefing-test">
			<div className="prev-btn" onClick={() => onClickBack()}>
				<svg className="icon icon-arrow ">
					<use href="/img/svg/sprite.svg#arrow"></use>
				</svg>
				<span>Назад</span>
			</div>
			{questions && (
				<>
					<h3>{activeQuiz.title}</h3>
					<div className="briefing-test__title">Тест</div>
					<div className="briefing-test__point-wrap">
						{activeQuiz.questions.map(({ id }, index) => {
							return (
								<div
									key={id}
									className={`briefing-test__point ${
										activeIndex === index ? "briefing-test__point--active" : ""
									} ${
										questions[index].isValid ? "briefing-test__point--done" : ""
									}`}
									onClick={() => onClickTab(index)}
								>
									{index + 1}
								</div>
							);
						})}
					</div>
					<div className="briefing-test__question">
						{questions[activeIndex]?.text}
					</div>
					<div className="briefing-test__choose">
						Выберите правильные варианты ответа
					</div>
					{questions[activeIndex]?.choices?.map(
						({ id, text, is_checked }, index) => (
							<label key={id} className="custom-input form-check">
								<input
									className="custom-input__input form-check-input"
									name="checkbox"
									type="checkbox"
									checked={is_checked}
									onChange={() => updateQuestions(index)}
								/>
								<span className="custom-input__text form-check-label">
									{text}
								</span>
							</label>
						)
					)}
					<div className="special-menu__footer">
						<button
							className="btn btn-primary"
							disabled={!questions[activeIndex]?.isValid}
							onClick={() => onClickNext(activeIndex + 1)}
						>
							{activeIndex === questions.length - 1
								? "Завершить тест"
								: "Следующий вопрос"}
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default memo(Quiz);
