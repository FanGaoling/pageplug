import React from "react";
import ReactDOM from "react-dom";
import PageHeader from "pages/common/PageHeader";
import LoginHeader from "pages/common/LoginHeader";
import { Route, Switch } from "react-router";
import {
  APP_VIEW_URL,
  BASE_URL,
  BUILDER_URL,
  USER_AUTH_URL,
} from "constants/routes";
import { withRouter, RouteComponentProps } from "react-router";
import AppViewerHeader from "pages/AppViewer/viewer/AppViewerHeader";
import AppEditorHeader from "pages/Editor/EditorHeader";
import { getAppsmithConfigs } from "configs";
const { inCloudOS } = getAppsmithConfigs();

type Props = RouteComponentProps;

const headerRoot = document.getElementById("header-root");

class AppHeader extends React.Component<Props, any> {
  private container = document.createElement("div");

  componentDidMount() {
    headerRoot?.appendChild(this.container);
  }
  componentWillUnmount() {
    headerRoot?.removeChild(this.container);
  }
  get header() {
    if (inCloudOS) {
      return (
        <Switch>
          <Route component={AppEditorHeader} path={BUILDER_URL} />
          <Route component={AppViewerHeader} path={APP_VIEW_URL} />
        </Switch>
      );
    }
    return (
      <Switch>
        <Route component={AppEditorHeader} path={BUILDER_URL} />
        <Route component={AppViewerHeader} path={APP_VIEW_URL} />
        <Route component={LoginHeader} path={USER_AUTH_URL} />
        <Route component={PageHeader} path={BASE_URL} />
      </Switch>
    );
  }
  render() {
    return ReactDOM.createPortal(this.header, this.container);
  }
}

export default withRouter(AppHeader);
