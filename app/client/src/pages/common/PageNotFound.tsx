import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { APPLICATIONS_URL } from "constants/routes";
import Button from "components/editorComponents/Button";
import { flushErrorsAndRedirect } from "actions/errorActions";
import PageUnavailableImage from "assets/images/404-image.png";
import {
  BACK_TO_HOMEPAGE,
  createMessage,
  PAGE_NOT_FOUND,
} from "constants/messages";
import { getAppsmithConfigs } from "configs";
const { inCloudOS } = getAppsmithConfigs();

const Wrapper = styled.div`
  text-align: center;
  margin-top: 5%;
  .bold-text {
    font-weight: ${(props) => props.theme.fontWeights[3]};
    font-size: 24px;
  }
  .page-unavailable-img {
    width: 35%;
  }
  .button-position {
    margin: auto;
  }
`;

const Text404 = styled.div`
  text-align: center;
  line-height: 200px;
  font-size: 100px;
  font-family: fantasy;
  filter: drop-shadow(2px 4px #ff0000) drop-shadow(2px 4px #00ff00)
    drop-shadow(-2px -4px #0000ff);
`;

interface Props {
  flushErrorsAndRedirect?: any;
}

function PageNotFound(props: Props) {
  const { flushErrorsAndRedirect } = props;

  if (inCloudOS) {
    return <Text404>404</Text404>;
  }

  return (
    <Wrapper className="space-y-6">
      <img
        alt="Page Unavailable"
        className="mx-auto page-unavailable-img"
        src={PageUnavailableImage}
      />
      <div className="space-y-2">
        <p className="bold-text">{createMessage(PAGE_NOT_FOUND)}</p>
        <p>
          Either this page doesn&apos;t exist, or you don&apos;t have access to{" "}
          <br />
          this page.
        </p>
        <Button
          className="button-position"
          filled
          icon="arrow-right"
          iconAlignment="right"
          intent="primary"
          onClick={() => flushErrorsAndRedirect(APPLICATIONS_URL)}
          size="small"
          text={createMessage(BACK_TO_HOMEPAGE)}
        />
      </div>
    </Wrapper>
  );
}

export default connect(null, {
  flushErrorsAndRedirect,
})(PageNotFound);
