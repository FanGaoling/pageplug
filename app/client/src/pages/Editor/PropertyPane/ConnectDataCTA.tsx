import React from "react";
import { Button, Category, getTypographyByKey, Size } from "design-system-old";
import type { AppState } from "@appsmith/reducers";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { INTEGRATION_EDITOR_MODES, INTEGRATION_TABS } from "constants/routes";
import history from "utils/history";
import AnalyticsUtil from "utils/AnalyticsUtil";
import type { WidgetType } from "constants/WidgetConstants";
import { integrationEditorURL } from "RouteBuilder";
import { getCurrentPageId } from "selectors/editorSelectors";
import { DocsLink, openDoc } from "../../../constants/DocumentationLinks";

const StyledDiv = styled.div`
  color: ${(props) => props.theme.colors.propertyPane.ctaTextColor};
  ${getTypographyByKey("p1")}
  background-color: ${(props) =>
    props.theme.colors.propertyPane.ctaBackgroundColor};
  padding: ${(props) => props.theme.spaces[3]}px
    ${(props) => props.theme.spaces[7]}px;
  margin: ${(props) => props.theme.spaces[2]}px 0.75rem;

  button:first-child {
    margin-top: ${(props) => props.theme.spaces[2]}px;
    width: 100%;
  }
  button:nth-child(2) {
    border: none;
    background-color: transparent;
    text-transform: none;
    justify-content: flex-start;
    padding: 0px;
    color: ${(props) => props.theme.colors.propertyPane.ctaLearnMoreTextColor};
    ${getTypographyByKey("p3")}
    margin-top: ${(props) => props.theme.spaces[2]}px;

    :hover,
    :focus {
      text-decoration: underline;
    }
  }
`;

export const actionsExist = (state: AppState): boolean =>
  !!state.entities.actions.length;

type ConnectDataCTAProps = {
  widgetTitle: string;
  widgetId?: string;
  widgetType?: WidgetType;
};

function ConnectDataCTA(props: ConnectDataCTAProps) {
  const pageId: string = useSelector(getCurrentPageId);

  const onClick = () => {
    const { widgetId, widgetTitle, widgetType } = props;
    history.push(
      integrationEditorURL({
        pageId,
        selectedTab: INTEGRATION_TABS.NEW,
        params: { mode: INTEGRATION_EDITOR_MODES.AUTO },
      }),
    );
    AnalyticsUtil.logEvent("CONNECT_DATA_CLICK", {
      widgetTitle,
      widgetId,
      widgetType,
    });
  };

  return (
    <StyledDiv className="t--propertypane-connect-cta">
      数据缺失
      <Button
        category={Category.primary}
        onClick={onClick}
        size={Size.large}
        tabIndex={0}
        tag="button"
        text="绑定数据"
      />
      {/* <Button
        category={Category.secondary}
<<<<<<< HEAD
        onClick={openHelpModal}
        text="了解更多"
=======
        onClick={() => openDoc(DocsLink.CONNECT_DATA)}
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
        tabIndex={0}
        tag="button"
      /> */}
    </StyledDiv>
  );
}

export default React.memo(ConnectDataCTA);
