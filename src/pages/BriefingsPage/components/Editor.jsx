import { memo, useCallback } from "react";
import ReactQuill from "react-quill";
import { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const Font = Quill.import("formats/font");
Font.whitelist = ["sans-serif", "serif", "monospace"];
Quill.register(Font, true);

const formats = [
	"header",
	"font",
	"bold",
	"italic",
	"underline",
	"align",
	"strike",
	"script",
	"blockquote",
	"background",
	"list",
	"bullet",
	"indent",
	"link",
	"image",
	"color",
	"code-block",
];

const modules = {
	toolbar: {
		container: "#toolbar",
	},
};

export const Editor = ({ setValue, getValues }) => {
	const handleChange = useCallback(
		(content, delta, source, editor) => {
			setValue("content", content);
			setValue("delta", editor.getContents());
		},
		[setValue]
	);

	return (
		<>
			<div id="toolbar">
				<span className="ql-formats">
					<select className="ql-font" defaultValue="arial">
						<option value="sans-serif">Sans-Serif</option>
						<option value="serif">Serif</option>
						<option value="monospace">monospace</option>
					</select>
					<select className="ql-header" defaultValue="0">
						<option value="1">Heading 1</option>
						<option value="2">Heading 2</option>
						<option value="3">Heading 3</option>
						<option value="0">Normal</option>
					</select>
				</span>
				<span className="ql-formats">
					<select className="ql-align" />
				</span>
				<span className="ql-formats">
					<button className="ql-bold" />
					<button className="ql-italic" />
					<button className="ql-underline" />
					<button className="ql-strike" />
				</span>
				<span className="ql-formats">
					<button className="ql-blockquote" />
					<select className="ql-color" />
					<select className="ql-background" />
				</span>
				<span className="ql-formats">
					<button className="ql-code-block" />
					<button className="ql-link" />
					<button className="ql-image" />
					<button className="ql-video" />
				</span>
				<span className="ql-formats">
					<button className="ql-clean" />
				</span>
			</div>
			<ReactQuill
				theme="snow"
				value={getValues("content")}
				onChange={handleChange}
				placeholder={"Введите"}
				modules={modules}
				formats={formats}
			/>
		</>
	);
};

export default memo(Editor);
