import { memo, createContext, useEffect, useCallback, useRef } from "react";
import "./modal-width.css";

export const ScrollContext = createContext();

const ModalWide = ({ header, children, setIsVisible, paddings }) => {
	const menuRef = useRef(null);

	const closeHandle = useCallback(
		(e) => {
			e.stopPropagation();
			setIsVisible(false);
		},
		[setIsVisible]
	);

	const handleScrollTop = useCallback(() => {
		menuRef.current.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		document.body.classList.add("fixed");
		return () => {
			document.body.classList.remove("fixed");
		};
	}, []);

	return (
		<div className={"modal-wide__wrapper"} onMouseDown={closeHandle}>
			<div
				className="special-menu"
				ref={menuRef}
				onClick={(e) => e.stopPropagation()}
				onMouseDown={(e) => e.stopPropagation()}
			>
				<div className="special-menu__topline">{header}</div>
				<div
					className="special-menu__body"
					style={paddings ? { padding: paddings } : {}}
				>
					<ScrollContext.Provider value={handleScrollTop}>
						{children}
					</ScrollContext.Provider>
				</div>
			</div>
		</div>
	);
};

export default memo(ModalWide);
