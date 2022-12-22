import { combineReducers } from "redux";
import { currentUserReducer } from "./currentUserReducer";
import { briefingsReducer } from "./briefingsReducer";
import { permitsReducer } from "./permitsReducer";
import { documentsReducer } from "./documentsReducer";

const rootReducer = combineReducers({
	currentUser: currentUserReducer,
	briefings: briefingsReducer,
	permits: permitsReducer,
	documents: documentsReducer,
});

export default rootReducer;
