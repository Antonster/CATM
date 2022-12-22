import { memo, useState, useCallback } from "react";
import ButtonDockFile from "../../../ui/Button/ButtonDockFile";
import ModalWide from "../../../ui/ModalWide/ModalWide";
import {
	isDatePassed,
	relativeUrlResolver,
} from "../../../assets/helper.funcs";
import usersService from "../../../services/users.service";

const ProfileDataTable = ({ myUserInfo }) => {
	const [pdfUrl, setPdfUrl] = useState("");
	const [documentTitle, setDocumentTitle] = useState("");
	const [isDocModalVisible, setIsDocumentModalVisible] = useState(false);
	const [isButtonBlock, setButtonBlock] = useState(false);

	const openDocumentInModal = useCallback((title, url) => {
		setPdfUrl(url);
		setDocumentTitle(title);
		setIsDocumentModalVisible(true);
	}, []);

	const onGenerateCommonDocument = useCallback(async () => {
		try {
			await usersService.generateCommonDocument(myUserInfo.id);
		} catch (e) {
			console.log(e);
		} finally {
			setButtonBlock(true);
		}
	}, [myUserInfo]);

	return (
		<>
			{isDocModalVisible && (
				<ModalWide
					header={documentTitle}
					setIsVisible={setIsDocumentModalVisible}
					paddings={"0"}
				>
					<iframe
						title={pdfUrl}
						src={pdfUrl}
						className={"iframe_document__wrapper"}
					/>
				</ModalWide>
			)}

			<div className="generate-common-document">
				<div>
					<button
						className="generate-button btn btn-primary"
						onClick={onGenerateCommonDocument}
						disabled={isButtonBlock}
					>
						<img
							className="generate-button-icon"
							src="/img/svg/paper.svg"
							alt=""
						/>
						<div className="generate-button-text">Сгенерировать PDF</div>
					</button>
					{isButtonBlock && (
						<div className="generate-text">
							Файл генерируется, необходимо обновить страницу
						</div>
					)}
				</div>
				{myUserInfo?.common_document && (
					<div className="common-document">
						<button
							onClick={() =>
								openDocumentInModal(
									`${myUserInfo.last_name} ${myUserInfo.first_name}`,
									relativeUrlResolver(myUserInfo.common_document.document)
								)
							}
							className="btn btn-outline-primary common-button"
						>
							<div className="common-main">
								<svg className="icon icon-file">
									<use href="/img/svg/sprite.svg#file" />
								</svg>
								<span>Просмотреть документ</span>
							</div>
							<div className="common-date">
								От {myUserInfo.common_document.date}{" "}
								{myUserInfo.common_document.time}
							</div>
						</button>
					</div>
				)}
			</div>

			<div className="person-documents-item">
				<div className="person-documents-item__title">Медицинский осмотр</div>
				{myUserInfo?.medical_exam && (
					<>
						<div className="person-documents-item__list">
							<div
								className={`person-documents-item__list-item person-documents-item__list-item--${
									isDatePassed(myUserInfo.medical_exam.expiration_date)
										? "negative"
										: "positive"
								}`}
							>
								{myUserInfo?.medical_exam.number} до:{" "}
								{myUserInfo.medical_exam.expiration_date}
							</div>
						</div>
						<div className="person-documents-item__button-wrap">
							<ButtonDockFile
								title={"Просмотреть документ"}
								cb={openDocumentInModal}
								dockUrl={myUserInfo?.medical_exam?.file}
								dockTitle={"Медицинский осмотр"}
							/>
						</div>
					</>
				)}
			</div>
			<div className="person-documents-item">
				<div className="person-documents-item__title">Обучение</div>
				<div className="person-documents-item__list">
					{myUserInfo &&
						myUserInfo.trainings &&
						myUserInfo.trainings.map((training) => {
							return (
								<div
									key={training.id}
									className={`person-documents-item__list-string person-documents-item__list-item person-documents-item__list-item--${
										isDatePassed(training.expiration_date)
											? "negative"
											: "positive"
									}`}
								>
									<div className="person-documents-item__list-caption">
										<div className="title">
											{training.category?.title} {training.number}
										</div>
										<div className="caption">
											Действителен до {training.expiration_date}
										</div>
									</div>
									<div className="person-documents-item__button-wrap">
										<ButtonDockFile
											title={"Просмотреть документ"}
											cb={openDocumentInModal}
											dockUrl={training.file}
											dockTitle={"Обучение"}
										/>
									</div>
								</div>
							);
						})}
				</div>
			</div>
			<div className="person-documents-item">
				<div className="person-documents-item__title">Инструктаж</div>
				<div className="person-documents-item__list">
					{myUserInfo &&
						myUserInfo.briefings &&
						myUserInfo.briefings.map((briefing, i) => {
							return (
								<div
									key={i}
									className={`person-documents-item__list-item person-documents-item__list-item--${
										briefing?.signed ? "positive" : "negative"
									}`}
								>
									{briefing?.category}
								</div>
							);
						})}
				</div>
				<div className="person-documents-item__button-wrap"></div>
			</div>
			<div className="person-documents-item">
				<div className="person-documents-item__title">
					Личная карточка учета выдачи СИЗ
				</div>
				{myUserInfo?.protective_equipment_card && (
					<>
						<div className="person-documents-item__list">
							<div
								className={`person-documents-item__list-caption person-documents-item__list-item person-documents-item__list-item--${
									isDatePassed(
										myUserInfo?.protective_equipment_card?.expiration_date
									)
										? "negative"
										: "positive"
								}`}
							>
								<div className="title">
									{myUserInfo?.protective_equipment_card?.number}
								</div>
								<div className="caption">
									Действителен до{" "}
									{myUserInfo?.protective_equipment_card?.expiration_date}
								</div>
							</div>
						</div>
						<div className="person-documents-item__button-wrap">
							<ButtonDockFile
								title={"Просмотреть документ"}
								cb={openDocumentInModal}
								dockUrl={myUserInfo?.protective_equipment_card?.file}
								dockTitle={"Личная карточка учета выдачи СИЗ"}
							/>
						</div>
					</>
				)}
			</div>
			<div className="person-documents-item">
				<div className="person-documents-item__title">Инструмент</div>
				<div className="person-documents-item__list">
					{myUserInfo &&
						myUserInfo.tools &&
						myUserInfo.tools.map((tool, i) => {
							return (
								<div key={i} className="person-documents-item__list-caption">
									<div className="title">{tool.title}</div>
								</div>
							);
						})}
				</div>
				<div className="person-documents-item__button-wrap"></div>
			</div>
		</>
	);
};

export default memo(ProfileDataTable);
