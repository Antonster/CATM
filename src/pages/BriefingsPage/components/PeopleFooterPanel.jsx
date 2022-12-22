import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { briefingsActions } from "../../../store/actions";

const CreatorFooterPanel = ({ employees, briefingId, setPeopleModal }) => {
	const dispatch = useDispatch();

	const onClickSave = useCallback(() => {
		dispatch(
			briefingsActions.updateBriefingUsers(briefingId, {
				users: employees.selected.map(({ id }) => id),
			})
		);
		setPeopleModal(false);
	}, [briefingId, dispatch, employees, setPeopleModal]);

	return (
		<div className="special-menu__footer">
			<button
				className="btn btn-outline-primary"
				onClick={() => setPeopleModal(false)}
			>
				Отмена
			</button>
			<button className="btn btn-primary" onClick={onClickSave}>
				Сохранить
			</button>
		</div>
	);
};

export default memo(CreatorFooterPanel);
