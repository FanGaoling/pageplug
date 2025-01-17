import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useDispatch } from "react-redux";
import type { RouteComponentProps } from "react-router";
import { withRouter } from "react-router";
import type { AppState } from "@appsmith/reducers";
import type {
  AppViewerRouteParams,
  BuilderRouteParams,
} from "constants/routes";
import { GIT_BRANCH_QUERY_KEY } from "constants/routes";
import {
  getIsInitialized,
  getAppViewHeaderHeight,
} from "selectors/appViewSelectors";
import EditorContextProvider from "components/editorComponents/EditorContextProvider";
import AppViewerPageContainer from "./AppViewerPageContainer";
import { editorInitializer } from "utils/editor/EditorUtils";
import * as Sentry from "@sentry/react";
import {
  getCurrentPageDescription,
  getShowTabBar,
  getCurrentPage,
  getViewModePageList,
} from "selectors/editorSelectors";
import { isMobileLayout } from "selectors/applicationSelectors";
import { getThemeDetails, ThemeMode } from "selectors/themeSelectors";
import TabBar from "components/designSystems/taro/TabBar";
import PreviewQRCode from "./PreviewQRCode";
import AppViewerLayout from "./AppViewerLayout";

// import webfontloader from "webfontloader";
import { getSearchQuery } from "utils/helpers";
import { getSelectedAppTheme } from "selectors/appThemingSelectors";
import { useSelector } from "react-redux";
import BrandingBadge from "./BrandingBadge";
import { setAppViewHeaderHeight } from "actions/appViewActions";
import { showPostCompletionMessage } from "selectors/onboardingSelectors";
import { CANVAS_SELECTOR } from "constants/WidgetConstants";
import { fetchPublishedPage } from "actions/pageActions";
import usePrevious from "utils/hooks/usePrevious";
import { getIsBranchUpdated } from "../utils";
import { APP_MODE } from "entities/App";
import { initAppViewer } from "actions/initActions";
import { WidgetGlobaStyles } from "globalStyles/WidgetGlobalStyles";
import { getAppsmithConfigs } from "@appsmith/configs";
import useWidgetFocus from "utils/hooks/useWidgetFocus/useWidgetFocus";
import HtmlTitle from "./AppViewerHtmlTitle";
import BottomBar from "components/BottomBar";
import type { ApplicationPayload } from "@appsmith/constants/ReduxActionConstants";
import { getCurrentApplication } from "@appsmith/selectors/applicationSelectors";
import { widgetInitialisationSuccess } from "../../actions/widgetActions";
import { areEnvironmentsFetched } from "@appsmith/selectors/environmentSelectors";
import { datasourceEnvEnabled } from "@appsmith/selectors/featureFlagsSelectors";
import {
  ThemeProvider as WDSThemeProvider,
  useTheme,
} from "@design-system/theming";
import { useFeatureFlag } from "utils/hooks/useFeatureFlag";
import { RAMP_NAME } from "utils/ProductRamps/RampsControlList";
import { showProductRamps } from "selectors/rampSelectors";
import { isCEMode } from "@appsmith/utils";

const AppViewerBody = styled.section<{
  showTabBar: boolean;
  isMobile: boolean;
  hasPages: boolean;
  headerHeight: number;
  showGuidedTourMessage: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;
  height: calc(
    100vh - ${(props) => (props.isMobile ? "0px" : "0px")} -
      ${(props) => (props.showTabBar ? "60px" : "0px")} -
      ${({ headerHeight }) => headerHeight}px
  );
  --view-mode-header-height: ${({ headerHeight }) => headerHeight}px;
`;

const AppViewerBodyContainer = styled.div<{
  width?: string;
  backgroundColor: string;
}>`
  flex: 1;
  overflow: auto;
  margin: 0 auto;
  background: ${({ backgroundColor }) => backgroundColor};
`;

const StableContainer = styled.div`
  position: relative;
  overflow: hidden;
  // height: 100vh;
`;

const ContainerForBottom = styled.div<{
  isMobile: boolean;
}>`
  display: flex;
  width: 100%;
  height: 100%;
  ${({ isMobile }) => (isMobile ? "transform: translate(0, 0);" : "")}
`;

export type AppViewerProps = RouteComponentProps<BuilderRouteParams>;

type Props = AppViewerProps & RouteComponentProps<AppViewerRouteParams>;

const DEFAULT_FONT_NAME = "System Default";

function AppViewer(props: Props) {
  const dispatch = useDispatch();
  const { pathname, search } = props.location;
  const { applicationId, pageId } = props.match.params;
  const isInitialized = useSelector(getIsInitialized);
  const pages = useSelector(getViewModePageList);
  const selectedTheme = useSelector(getSelectedAppTheme);
  const lightTheme = useSelector((state: AppState) =>
    getThemeDetails(state, ThemeMode.LIGHT),
  );
  const showGuidedTourMessage = useSelector(showPostCompletionMessage);
  const headerHeight = useSelector(getAppViewHeaderHeight);
  const branch = getSearchQuery(search, GIT_BRANCH_QUERY_KEY);
  const prevValues = usePrevious({ branch, location: props.location, pageId });
  const showTabBar = useSelector(getShowTabBar);
  const isMobile = useSelector(isMobileLayout);
  const currentPage = useSelector(getCurrentPage);
  const isEmbed = !!getSearchQuery(search, "embed") || !!currentPage?.isHidden;
  const { hideWatermark } = getAppsmithConfigs();
  const pageDescription = useSelector(getCurrentPageDescription);
  const currentApplicationDetails: ApplicationPayload | undefined = useSelector(
    getCurrentApplication,
  );
  const { theme } = useTheme({
    borderRadius: selectedTheme.properties.borderRadius.appBorderRadius,
    seedColor: selectedTheme.properties.colors.primaryColor,
  });
  const focusRef = useWidgetFocus();

  const showRampSelector = showProductRamps(RAMP_NAME.MULTIPLE_ENV);
  const canShowRamp = useSelector(showRampSelector);

  const workspaceId = currentApplicationDetails?.workspaceId || "";
  const showBottomBar = useSelector((state: AppState) => {
    return (
      areEnvironmentsFetched(state, workspaceId) &&
      datasourceEnvEnabled(state) &&
      (isCEMode() ? canShowRamp : true)
    );
  });

  /**
   * initializes the widgets factory and registers all widgets
   */
  useEffect(() => {
    editorInitializer().then(() => {
      dispatch(widgetInitialisationSuccess());
    });
    // onMount initPage
    if (applicationId || pageId) {
      dispatch(
        initAppViewer({
          applicationId,
          branch,
          pageId,
          mode: APP_MODE.PUBLISHED,
        }),
      );
    }
  }, []);

  /**
   * initialize the app if branch, pageId or application is changed
   */
  useEffect(() => {
    const prevBranch = prevValues?.branch;
    const prevLocation = prevValues?.location;
    const prevPageId = prevValues?.pageId;
    let isBranchUpdated = false;
    if (prevBranch && prevLocation) {
      isBranchUpdated = getIsBranchUpdated(props.location, prevLocation);
    }

    const isPageIdUpdated = pageId !== prevPageId;

    if (prevBranch && isBranchUpdated && (applicationId || pageId)) {
      dispatch(
        initAppViewer({
          applicationId,
          branch,
          pageId,
          mode: APP_MODE.PUBLISHED,
        }),
      );
    } else {
      /**
       * First time load is handled by init sagas
       * If we don't check for `prevPageId`: fetch page is retriggered
       * when redirected to the default page
       */
      if (prevPageId && pageId && isPageIdUpdated) {
        dispatch(fetchPublishedPage(pageId, true));
      }
    }
  }, [branch, pageId, applicationId, pathname]);

  useEffect(() => {
    const header = document.querySelector(".js-appviewer-header");
    if (document) {
      document.title = currentApplicationDetails?.name || "pageplug";
    }
    dispatch(setAppViewHeaderHeight(header?.clientHeight || 0));
  }, [pages.length, isInitialized]);

  /**
   * returns the font to be used for the canvas
   */
  const appFontFamily =
    selectedTheme.properties.fontFamily.appFont === DEFAULT_FONT_NAME
      ? "inherit"
      : selectedTheme.properties.fontFamily.appFont;

  /**
   * loads font for canvas based on theme
   */
  useEffect(() => {
    document.body.style.fontFamily = `${appFontFamily}, sans-serif`;

    return function reset() {
      document.body.style.fontFamily = "inherit";
    };
  }, [selectedTheme.properties.fontFamily.appFont]);

  const isWDSV2Enabled = useFeatureFlag("ab_wds_enabled");
  const backgroundForBody = isWDSV2Enabled
    ? "var(--color-bg)"
    : selectedTheme.properties.colors.backgroundColor;

  let appViewerBodyContainerBg = backgroundForBody;
  if (isMobile) {
    appViewerBodyContainerBg = "radial-gradient(#2cbba633, #ffec8f36)";
  }
  if (selectedTheme.properties.colors.backgroundUrl) {
    appViewerBodyContainerBg = `url(${selectedTheme.properties.colors.backgroundUrl}) no-repeat fixed center ${backgroundForBody}`;
  }

  return (
    <ThemeProvider theme={lightTheme}>
      <EditorContextProvider renderMode="PAGE">
        <WidgetGlobaStyles
          fontFamily={selectedTheme.properties.fontFamily.appFont}
          primaryColor={selectedTheme.properties.colors.primaryColor}
        />
        <HtmlTitle
          description={pageDescription}
          name={currentApplicationDetails?.name}
        />
        <ContainerForBottom isMobile={isMobile}>
          <AppViewerBodyContainer backgroundColor={appViewerBodyContainerBg}>
            <AppViewerBody
              className={CANVAS_SELECTOR}
              hasPages={pages.length > 1}
              headerHeight={headerHeight}
              isMobile={isMobile || isEmbed}
              ref={focusRef}
              // showBottomBar={showBottomBar}
              showGuidedTourMessage={showGuidedTourMessage}
              showTabBar={showTabBar}
            >
              {isInitialized && <AppViewerPageContainer />}
            </AppViewerBody>
          </AppViewerBodyContainer>
        </ContainerForBottom>
        <TabBar />
        <PreviewQRCode />
      </EditorContextProvider>
    </ThemeProvider>
  );
}

export default withRouter(Sentry.withProfiler(AppViewer));
