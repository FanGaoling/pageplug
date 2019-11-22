import { WidgetProps, WidgetCardProps } from "../widgets/BaseWidget";
import { RefObject } from "react";

export const ReduxActionTypes: { [key: string]: string } = {
  INITIALIZE_EDITOR: "INITIALIZE_EDITOR",
  INITIALIZE_EDITOR_SUCCESS: "INITIALIZE_EDITOR_SUCCESS",
  REPORT_ERROR: "REPORT_ERROR",
  FLUSH_ERRORS: "FLUSH_ERRORS",
  UPDATE_CANVAS: "UPDATE_CANVAS",
  FETCH_CANVAS: "FETCH_CANVAS",
  CLEAR_CANVAS: "CLEAR_CANVAS",
  FETCH_PAGE_INIT: "FETCH_PAGE_INIT",
  FETCH_PAGE_SUCCESS: "FETCH_PAGE_SUCCESS",
  DROP_WIDGET_CANVAS: "DROP_WIDGET_CANVAS",
  REMOVE_WIDGET_CANVAS: "REMOVE_WIDGET_CANVAS",
  LOAD_WIDGET_PANE: "LOAD_WIDGET_PANE",
  ZOOM_IN_CANVAS: "ZOOM_IN_CANVAS",
  ZOOM_OUT_CANVAS: "ZOOM_OUT_CANVAS",
  UNDO_CANVAS_ACTION: "UNDO_CANVAS_ACTION",
  REDO_CANVAS_ACTION: "REDO_CANVAS_ACTION",
  LOAD_WIDGET_CONFIG: "LOAD_WIDGET_CONFIG",
  LOAD_PROPERTY_CONFIG: "LOAD_PROPERTY_CONFIG",
  PUBLISH: "PUBLISH",
  FETCH_WIDGET_CARDS: "FETCH_WIDGET_CARDS",
  FETCH_WIDGET_CARDS_SUCCESS: "FETCH_WIDGET_CARDS_SUCCESS",
  ADD_PAGE_WIDGET: "ADD_PAGE_WIDGET",
  REMOVE_PAGE_WIDGET: "REMOVE_PAGE_WIDGET",
  LOAD_API_RESPONSE: "LOAD_API_RESPONSE",
  LOAD_QUERY_RESPONSE: "LOAD_QUERY_RESPONSE",
  RUN_API_REQUEST: "RUN_API_REQUEST",
  RUN_API_SUCCESS: "RUN_API_SUCCESS",
  EXECUTE_ACTION: "EXECUTE_ACTION",
  EXECUTE_ACTION_SUCCESS: "EXECUTE_ACTION_SUCCESS",
  EXECUTE_ACTION_ERROR: "EXECUTE_ACTION_ERROR",
  LOAD_CANVAS_ACTIONS: "LOAD_CANVAS_ACTIONS",
  SAVE_PAGE_INIT: "SAVE_PAGE_INIT",
  SAVE_PAGE_SUCCESS: "SAVE_PAGE_SUCCESS",
  UPDATE_LAYOUT: "UPDATE_LAYOUT",
  WIDGET_ADD_CHILD: "WIDGET_ADD_CHILD",
  WIDGET_REMOVE_CHILD: "WIDGET_REMOVE_CHILD",
  WIDGET_MOVE: "WIDGET_MOVE",
  WIDGET_RESIZE: "WIDGET_RESIZE",
  WIDGET_DELETE: "WIDGET_DELETE",
  WIDGETS_LOADING: "WIDGETS_LOADING",
  SHOW_PROPERTY_PANE: "SHOW_PROPERTY_PANE",
  UPDATE_WIDGET_PROPERTY_REQUEST: "UPDATE_WIDGET_PROPERTY_REQUEST",
  UPDATE_WIDGET_PROPERTY: "UPDATE_WIDGET_PROPERTY",
  UPDATE_WIDGET_DYNAMIC_PROPERTY: "UPDATE_WIDGET_DYNAMIC_PROPERTY",
  FETCH_PROPERTY_PANE_CONFIGS_INIT: "FETCH_PROPERTY_PANE_CONFIGS_INIT",
  FETCH_PROPERTY_PANE_CONFIGS_SUCCESS: "FETCH_PROPERTY_PANE_CONFIGS_SUCCESS",
  FETCH_CONFIGS_INIT: "FETCH_CONFIGS_INIT",
  ADD_WIDGET_REF: "ADD_WIDGET_REF",
  CREATE_ACTION_INIT: "CREATE_ACTION_INIT",
  CREATE_ACTION_SUCCESS: "CREATE_ACTION_SUCCESS",
  FETCH_ACTIONS_INIT: "FETCH_ACTIONS_INIT",
  FETCH_ACTIONS_SUCCESS: "FETCH_ACTIONS_SUCCESS",
  UPDATE_ACTION_INIT: "UPDATE_ACTION_INIT",
  UPDATE_ACTION_SUCCESS: "UPDATE_ACTION_SUCCESS",
  DELETE_ACTION_INIT: "DELETE_ACTION_INIT",
  DELETE_ACTION_SUCCESS: "DELETE_ACTION_SUCCESS",
  FETCH_DATASOURCES_INIT: "FETCH_DATASOURCES_INIT",
  FETCH_DATASOURCES_SUCCESS: "FETCH_DATASOURCES_SUCCESS",
  CREATE_DATASOURCE_INIT: "CREATE_DATASOURCE_INIT",
  CREATE_DATASOURCE_SUCCESS: "CREATE_DATASOURCE_SUCCESS",
  FETCH_PUBLISHED_PAGE_INIT: "FETCH_PUBLISHED_PAGE_INIT",
  FETCH_PUBLISHED_PAGE_SUCCESS: "FETCH_PUBLISHED_PAGE_SUCCESS",
  PUBLISH_APPLICATION_INIT: "PUBLISH_APPLICATION_INIT",
  PUBLISH_APPLICATION_SUCCESS: "PUBLISH_APPLICATION_SUCCESS",
  CREATE_PAGE_INIT: "CREATE_PAGE_INIT",
  CREATE_PAGE_SUCCESS: "CREATE_PAGE_SUCCESS",
  FETCH_PAGE_LIST_INIT: "FETCH_PAGE_LIST_INIT",
  FETCH_PAGE_LIST_SUCCESS: "FETCH_PAGE_LIST_SUCCESS",
  INITIALIZE_PAGE_VIEWER: "INITIALIZE_PAGE_VIEWER",
  FETCH_APPLICATION_LIST_INIT: "FETCH_APPLICATION_LIST_INIT",
  FETCH_APPLICATION_LIST_SUCCESS: "FETCH_APPLICATION_LIST_SUCCESS",
  CREATE_APPLICATION_INIT: "CREATE_APPLICATION_INIT",
  CREATE_APPLICATION_SUCCESS: "CREATE_APPLICATION_SUCCESS",
  CREATE_UPDATE_BINDINGS_MAP_LISTENER_INIT:
    "CREATE_UPDATE_BINDINGS_MAP_LISTENER_INIT",
  CREATE_UPDATE_BINDINGS_MAP_SUCCESS: "CREATE_UPDATE_BINDINGS_MAP_SUCCESS",
  CREATE_UPDATE_ACTION_WIDGETIDS_MAP_SUCCESS:
    "CREATE_UPDATE_ACTION_WIDGETIDS_MAP_SUCCESS",
  UPDATE_WIDGET_PROPERTY_VALIDATION: "UPDATE_WIDGET_PROPERTY_VALIDATION",
  HIDE_PROPERTY_PANE: "HIDE_PROPERTY_PANE",
};

export type ReduxActionType = typeof ReduxActionTypes[keyof typeof ReduxActionTypes];

export const ReduxActionErrorTypes: { [key: string]: string } = {
  INITIALIZE_EDITOR_ERROR: "INITIALIZE_EDITOR_ERROR",
  API_ERROR: "API_ERROR",
  WIDGET_DELETE_ERROR: "WIDGET_DELETE_ERROR",
  WIDGET_MOVE_ERROR: "WIDGET_MOVE_ERROR",
  WIDGET_RESIZE_ERROR: "WIDGET_RESIZE_ERROR",
  WIDGET_REMOVE_CHILD_ERROR: "WIDGET_REMOVE_CHILD_ERROR",
  WIDGET_ADD_CHILD_ERROR: "WIDGET_ADD_CHILD_ERROR",
  FETCH_PAGE_ERROR: "FETCH_PAGE_ERROR",
  SAVE_PAGE_ERROR: "SAVE_PAGE_ERROR",
  FETCH_WIDGET_CARDS_ERROR: "FETCH_WIDGET_CARDS_ERROR",
  WIDGET_OPERATION_ERROR: "WIDGET_OPERATION_ERROR",
  FETCH_PROPERTY_PANE_CONFIGS_ERROR: "FETCH_PROPERTY_PANE_CONFIGS_ERROR",
  FETCH_CONFIGS_ERROR: "FETCH_CONFIGS_ERROR",
  PROPERTY_PANE_ERROR: "PROPERTY_PANE_ERROR",
  FETCH_ACTIONS_ERROR: "FETCH_ACTIONS_ERROR",
  UPDATE_WIDGET_PROPERTY_ERROR: "UPDATE_WIDGET_PROPERTY_ERROR",
  CREATE_ACTION_ERROR: "CREATE_ACTION_ERROR",
  UPDATE_ACTION_ERROR: "UPDATE_ACTION_ERROR",
  DELETE_ACTION_ERROR: "DELETE_ACTION_ERROR",
  RUN_API_ERROR: "RUN_API_ERROR",
  EXECUTE_ACTION_ERROR: "EXECUTE_ACTION_ERROR",
  FETCH_DATASOURCES_ERROR: "FETCH_DATASOURCES_ERROR",
  CREATE_DATASOURCE_ERROR: "CREATE_DATASOURCE_ERROR",
  FETCH_PUBLISHED_PAGE_ERROR: "FETCH_PUBLISHED_PAGE_ERROR",
  PUBLISH_APPLICATION_ERROR: "PUBLISH_APPLICATION_ERROR",
  CREATE_PAGE_ERROR: "CREATE_PAGE_ERROR",
  FETCH_PAGE_LIST_ERROR: "FETCH_PAGE_LIST_ERROR",
  FETCH_APPLICATION_LIST_ERROR: "FETCH_APPLICATION_LIST_ERROR",
  CREATE_APPLICATION_ERROR: "CREATE_APPLICATION_ERROR",
};

export type ReduxActionErrorType = typeof ReduxActionErrorTypes[keyof typeof ReduxActionErrorTypes];

export interface ReduxAction<T> {
  type: ReduxActionType | ReduxActionErrorType;
  payload: T;
}

export type ReduxActionWithoutPayload = Pick<ReduxAction<undefined>, "type">;

export interface ReduxActionErrorPayload {
  message: string;
  source?: string;
}

export interface UpdateCanvasPayload {
  pageWidgetId: string;
  widgets: { [widgetId: string]: WidgetProps };
  currentLayoutId: string;
  currentPageId: string;
  currentPageName: string;
  currentApplicationId: string;
}

export interface ShowPropertyPanePayload {
  widgetId: string;
  node: RefObject<HTMLDivElement>;
  toggle: boolean;
}

export type PageListPayload = Array<{
  pageName: string;
  pageId: string;
}>;

export type ApplicationPayload = {
  id: string;
  name: string;
  organizationId: string;
  pageCount: number;
  defaultPageId?: string;
};

// export interface LoadAPIResponsePayload extends ExecuteActionResponse {}

// export interface LoadQueryResponsePayload extends ExecuteActionResponse {}

export interface LoadWidgetEditorPayload {
  widgets: WidgetProps[];
}

export interface LoadWidgetSidebarPayload {
  cards: { [id: string]: WidgetCardProps[] };
}

export type SavePagePayload = {};
export type SavePageErrorPayload = {};
export type SavePageSuccessPayload = {};

export type InitializeEditorPayload = {
  applicationId: string;
};

export type FetchPageListPayload = InitializeEditorPayload;
