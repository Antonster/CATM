import { memo, useState, useMemo } from "react";
import { Badge, Collapse, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import PeopleCard from "./PeopleCard";
import DocumentsCard from "./DocumentsCard";
import DailyPermitCard from "./DailyPermitsCard";
import AnalyzesCard from "./AnalyzesCard";

const StyledBadge = styled(Badge)(() => ({
	"& .MuiBadge-badge": {
		backgroundColor: "#FFD664",
		color: "white",
		fontFamily: "Museo Sans Cyrl",
		fontWeight: "600",
		right: "10px",
		top: "5px",
	},
}));

const CardWrapper = ({
	workPermitInfo,
	removeDailyPermit,
	closeDailyPermit,
	removeAnalyze,
	daily_permits,
	analyzes,
	signDailyPermit,
	menuName,
	title,
	count,
	countFunc,
	warningCheck,
	warningText,
	buttonCheck,
	buttonFunc,
	buttonText,
	people,
	documents,
	openDocumentInModal,
}) => {
	const userId = useSelector((state) => state.currentUser?.user?.id);
	const [open, setOpen] = useState(false);

	const isSignDailyPermit = useMemo(() => {
		return !!workPermitInfo?.daily_permits?.find((item) => {
			const permitter = item?.signers?.find(({ role }) => role === "permitter");
			const responsible_manager = item?.signers?.find(
				({ role }) => role === "responsible_manager"
			);

			return (
				!item?.date_end &&
				!permitter?.signed &&
				!responsible_manager?.signed &&
				permitter?.user?.id === userId
			);
		});
	}, [userId, workPermitInfo]);

	const isCloseDailyPermit = useMemo(
		() =>
			!!workPermitInfo?.daily_permits?.find((item) => {
				const permitter = item?.signers?.find(
					({ role }) => role === "permitter"
				);
				const responsible_manager = item?.signers?.find(
					({ role }) => role === "responsible_manager"
				);

				return (
					!item?.date_end &&
					permitter?.signed &&
					!responsible_manager?.signed &&
					responsible_manager?.user?.id === userId
				);
			}),
		[userId, workPermitInfo]
	);

	return (
		<div className="card-toggle">
			<div className="card-toggle__head">
				<div className={`card-toggle__title ${open ? "active" : ""}`}>
					<div
						className="card-toggle__title-inner"
						onClick={() => setOpen((prev) => !prev)}
					>
						<img
							className="icon icon-chevron-right"
							src="/img/svg/chevron-right.svg"
							alt=""
						/>
						<StyledBadge
							invisible={
								!(
									menuName === "dailyPermitsMenu" &&
									(isSignDailyPermit || isCloseDailyPermit)
								)
							}
							variant="dot"
						>
							<div className="card-toggle__title-name">{title}</div>
						</StyledBadge>
					</div>
					{!!countFunc ? (
						<div
							className="card-toggle__title-caption caption-button"
							onClick={countFunc}
						>
							{count}
						</div>
					) : (
						<div className="card-toggle__title-caption caption-text">
							{count}
						</div>
					)}
					{warningCheck && (
						<Tooltip
							arrow
							placement="top-start"
							title={
								<div className="employee-permit__health-tooltip">
									{warningText}
								</div>
							}
						>
							<div className="card-toggle__warning">
								<img src="/img/svg/warning.svg" alt="" />
							</div>
						</Tooltip>
					)}
				</div>
				{buttonText && buttonCheck && (
					<button className="card-toggle__btn" onClick={buttonFunc}>
						<img src="/img/svg/plus-big.svg" alt="" />
						<span>{buttonText}</span>
					</button>
				)}
			</div>
			<Collapse in={open}>
				<div className="card-toggle__content">
					<PeopleCard
						{...{
							menuName,
							people,
						}}
					/>
					<DailyPermitCard
						{...{
							workPermitInfo,
							removeDailyPermit,
							closeDailyPermit,
							daily_permits,
							signDailyPermit,
						}}
					/>
					<AnalyzesCard
						{...{
							analyzes,
							removeAnalyze,
						}}
					/>
					<DocumentsCard
						{...{
							documents,
							openDocumentInModal,
						}}
					/>
				</div>
			</Collapse>
		</div>
	);
};

export default memo(CardWrapper);
