import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { getCurrentUser } from "selectors/usersSelectors";
import styled from "styled-components";
import StyledHeader from "components/designSystems/appsmith/StyledHeader";
import LogoImage from "assets/images/pageplug_logo_black.svg";
import { AppState } from "reducers";
import { User, ANONYMOUS_USERNAME } from "constants/userConstants";
import {
  AUTH_LOGIN_URL,
  APPLICATIONS_URL,
  matchApplicationPath,
  matchTemplatesPath,
  TEMPLATES_PATH,
  TEMPLATES_ID_PATH,
  matchTemplatesIdPath,
} from "constants/routes";
import history from "utils/history";
import Button from "components/editorComponents/Button";
import ProfileDropdown from "./ProfileDropdown";
import Bell from "notifications/Bell";
import { Colors } from "constants/Colors";
import { useIsMobileDevice } from "utils/hooks/useDeviceDetect";
import { ReactComponent as TwoLineHamburger } from "assets/icons/ads/two-line-hamburger.svg";
import MobileSideBar from "./MobileSidebar";
import { Indices } from "constants/Layers";
import Icon, { IconSize } from "components/ads/Icon";
import { TemplatesTabItem } from "pages/Templates/TemplatesTabItem";
import { getTemplateNotificationSeenAction } from "actions/templateActions";
import getFeatureFlags from "utils/featureFlags";

import { areCommentsEnabledForUserAndApp as areCommentsEnabledForUserAndAppSelector } from "selectors/commentsSelectors";

const StyledPageHeader = styled(StyledHeader)`
  background: ${Colors.MINT_GREEN};
  height: 48px;
  color: white;
  flex-direction: row;
  position: relative;
  top: 0;
  z-index: 10;
  box-shadow: ${(props) => props.theme.colors.header.boxShadow};
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;

  .t--appsmith-logo {
    svg {
      max-width: 110px;
      width: 110px;
    }
  }
`;

const StyledDropDownContainer = styled.div``;

const PagePlugLogoImg = styled.img`
  height: 32px;
`;

type PageHeaderProps = {
  user?: User;
  hideShadow?: boolean;
  showSeparator?: boolean;
};

export function PageHeader(props: PageHeaderProps) {
  const { user } = props;
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const isMobile = useIsMobileDevice();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  let loginUrl = AUTH_LOGIN_URL;
  if (queryParams.has("redirectUrl")) {
    loginUrl += `?redirectUrl
    =${queryParams.get("redirectUrl")}`;
  }

  useEffect(() => {
    dispatch(getTemplateNotificationSeenAction());
  }, []);

  const tabs = [
    {
      title: "Apps",
      path: APPLICATIONS_URL,
      matcher: matchApplicationPath,
    },
    {
      title: "Templates",
      path: TEMPLATES_PATH,
      matcher: matchTemplatesPath,
    },
    {
      title: "Templates id",
      path: TEMPLATES_ID_PATH,
      matcher: matchTemplatesIdPath,
    },
  ];

  const showTabs = useMemo(() => {
    return (
      tabs.some((tab) => tab.matcher(location.pathname)) &&
      getFeatureFlags().APP_TEMPLATE
    );
  }, [location.pathname]);

  return (
    <StyledPageHeader
      hideShadow={props.hideShadow || false}
      isMobile={isMobile}
      showSeparator={props.showSeparator || false}
      showingTabs={showTabs}
    >
      <HeaderSection>
        <Link className="t--appsmith-logo" to={APPLICATIONS_URL}>
          <PagePlugLogoImg alt="Appsmith logo" src={LogoImage} />
        </Link>
      </HeaderSection>

      <Tabs>
        {showTabs && !isMobile && (
          <>
            <TabName
              isSelected={matchApplicationPath(location.pathname)}
              onClick={() => history.push(APPLICATIONS_URL)}
            >
              <div>Apps</div>
            </TabName>
            <TemplatesTabItem>
              <TabName
                className="t--templates-tab"
                isSelected={
                  matchTemplatesPath(location.pathname) ||
                  matchTemplatesIdPath(location.pathname)
                }
                onClick={() => history.push(TEMPLATES_PATH)}
              >
                <div>Templates</div>
              </TabName>
            </TemplatesTabItem>
          </>
        )}
      </Tabs>

      {user && !isMobile && (
        <>
          {user.username !== ANONYMOUS_USERNAME && <Bell />}
          <StyledDropDownContainer>
            {user.username === ANONYMOUS_USERNAME ? (
              <Button
                filled
                intent={"primary"}
                onClick={() => history.push(loginUrl)}
                size="small"
                text="登录"
              />
            ) : (
              <ProfileDropdown
                name={user.name}
                userName={user.username}
                hideThemeSwitch
              />
            )}
          </StyledDropDownContainer>
        </>
      )}
      {isMobile && !isMobileSidebarOpen && (
        <StyledTwoLineHamburger onClick={() => setIsMobileSidebarOpen(true)} />
      )}
      {isMobile && isMobileSidebarOpen && (
        <Icon
          fillColor={Colors.CRUSTA}
          name="close-x"
          onClick={() => setIsMobileSidebarOpen(false)}
          size={IconSize.XXXXL}
        />
      )}
      {isMobile && user && (
        <MobileSideBar
          isOpen={isMobileSidebarOpen}
          name={user.name}
          userName={user.username}
        />
      )}
    </StyledPageHeader>
  );
}

const mapStateToProps = (state: AppState) => ({
  user: getCurrentUser(state),
  hideShadow: state.ui.theme.hideHeaderShadow,
  showSeparator: state.ui.theme.showHeaderSeparator,
});

export default connect(mapStateToProps)(PageHeader);
