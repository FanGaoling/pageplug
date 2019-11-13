import { combineReducers } from "redux";
import editorReducer from "./editorReducer";
import errorReducer from "./errorReducer";
import propertyPaneReducer from "./propertyPaneReducer";
import appViewReducer from "./appViewReducer";
import applicationsReducer from "./applicationsReducer";
import { widgetSidebarReducer } from "./widgetSidebarReducer";
import apiPaneReducer from "./apiPaneReducer";

const uiReducer = combineReducers({
  widgetSidebar: widgetSidebarReducer,
  editor: editorReducer,
  errors: errorReducer,
  propertyPane: propertyPaneReducer,
  appView: appViewReducer,
  applications: applicationsReducer,
  apiPane: apiPaneReducer,
});
export default uiReducer;
