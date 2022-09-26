import React, { ReactNode } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { theme } from "constants/DefaultTheme";

const Wrapper = styled.section<{ isFixed?: boolean }>`
  ${(props) =>
    props.isFixed
      ? `margin: 0;
  position: fixed;
  top: ${props.theme.homePage.header}px;
  width: 100%;`
      : `margin-top: ${props.theme.homePage.header}px;`}
  && .fade {
    position: relative;
  }
  && .fade-enter {
    opacity: 0;
    z-index: 1;
  }

  && .fade-enter.fade-enter-active {
    opacity: 1;
    transition: opacity 150ms ease-in;
  }
  .fade-exit {
    opacity: 1;
  }
  .fade-exit-active {
    display: none;
    opacity: 0;
  }
`;

const PageBody = styled.div`
  height: calc(
    100vh - ${(props) => props.theme.homePage.header}px
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  // padding-top: ${(props) => props.theme.spaces[12]}px;
  margin: 0 auto;
  & > * {
    width: 100%;
  }
`;

type PageWrapperProps = {
  children?: ReactNode;
  displayName?: string;
  isFixed?: boolean;
};

export function PageWrapper(props: PageWrapperProps) {
  const { isFixed = false } = props;
  return (
    <Wrapper isFixed={isFixed}>
      <Helmet>
        <title>{`${props.displayName ? `${props.displayName} - ` : ""}
         ${theme.inCloudOS ? "Methodot" : "PagePlug"}
         `}</title>
      </Helmet>
      <PageBody>{props.children}</PageBody>
    </Wrapper>
  );
}

export default PageWrapper;
