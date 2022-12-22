import { memo, useRef, useEffect, useCallback } from "react";

const SearchBlock = ({ placeholder, defaultValue, cb, isClear }) => {
	const inputRef = useRef(null);

	const enterPressHandler = useCallback(
		(e) => {
			if (e.key === "Enter") {
				cb(inputRef.current.value);
			}
		},
		[cb]
	);

	const clearInput = useCallback(() => {
		inputRef.current.value = "";
		cb("");
	}, [cb]);

	useEffect(() => {
		if (isClear) {
			clearInput();
		}
	}, [isClear]);

	useEffect(() => {
		document.addEventListener("keypress", enterPressHandler);
		return () => {
			document.removeEventListener("keypress", enterPressHandler);
		};
	}, [cb]);

	return (
		<div className="search-block">
			<input
				className="search-block__search"
				placeholder={placeholder}
				defaultValue={defaultValue}
				type="text"
				ref={inputRef}
			/>
			<button
				onClick={() => cb(inputRef.current.value)}
				className="search-block__search-btn"
			/>
		</div>
	);
};

export default memo(SearchBlock);
