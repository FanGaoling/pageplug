import React from "react";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { getCurrentUser } from "selectors/usersSelectors";
import styled from "styled-components";
import StyledHeader from "components/designSystems/appsmith/StyledHeader";
import PagePlugLogo from "assets/images/pageplug_logo_black.svg";
import { AppState } from "@appsmith/reducers";
import { User, ANONYMOUS_USERNAME } from "constants/userConstants";
import { AUTH_LOGIN_URL, APPLICATIONS_URL } from "constants/routes";
import Button from "components/editorComponents/Button";
import { Colors } from "constants/Colors";
import ProfileDropdown from "./ProfileDropdown";
import { flushErrorsAndRedirect, flushErrors } from "actions/errorActions";
import { getSafeCrash } from "selectors/errorSelectors";

const StyledPageHeader = styled(StyledHeader)`
  background: ${Colors.MINT_GREEN};
  height: 48px;
  color: white;
  flex-direction: row;
  position: fixed;
  top: 0;
  z-index: 10;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
`;

const HeaderSection = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

const StyledDropDownContainer = styled.div``;

const PagePlugLogoImg = styled.img`
  height: 32px;
`;

type ErrorPageHeaderProps = {
  user?: User;
  flushErrors?: any;
  flushErrorsAndRedirect?: any;
  safeCrash: boolean;
};

export function ErrorPageHeader(props: ErrorPageHeaderProps) {
  const { flushErrors, flushErrorsAndRedirect, safeCrash, user } = props;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let loginUrl = AUTH_LOGIN_URL;
  const redirectUrl = queryParams.get("redirectUrl");
  if (redirectUrl != null) {
    loginUrl += `?redirectUrl=${encodeURIComponent(redirectUrl)}`;
  }

  return (
    <StyledPageHeader>
      <HeaderSection>
        <Link
          className="t--appsmith-logo"
          onClick={() => {
            if (safeCrash) flushErrors();
          }}
          to={APPLICATIONS_URL}
        >
          <PagePlugLogoImg alt="logo" src={PagePlugLogo} />
        </Link>
      </HeaderSection>
      {user && (
        <StyledDropDownContainer>
          {user.username === ANONYMOUS_USERNAME ? (
            <Button
              filled
              intent={"primary"}
              onClick={() => {
                flushErrorsAndRedirect(loginUrl);
              }}
              size="small"
              text="登录"
            />
          ) : (
            <ProfileDropdown
              name={user.name}
              photoId={user?.photoId}
              userName={user.username}
            />
          )}
        </StyledDropDownContainer>
      )}
    </StyledPageHeader>
  );
}

const mapStateToProps = (state: AppState) => ({
  user: getCurrentUser(state),
  safeCrash: getSafeCrash(state),
});

export default connect(mapStateToProps, {
  flushErrors,
  flushErrorsAndRedirect,
})(ErrorPageHeader);
