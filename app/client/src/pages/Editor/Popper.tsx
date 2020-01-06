import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
import PopperJS from "popper.js";
import PaneWrapper from "pages/common/PaneWrapper";

type PopperProps = {
  isOpen: boolean;
  targetNode?: Element;
  children: JSX.Element;
};

const PopperWrapper = styled(PaneWrapper)`
  position: absolute;
  z-index: 1;
  max-height: ${props => props.theme.propertyPane.height}px;
  width: ${props => props.theme.propertyPane.width}px;
  margin: ${props => props.theme.spaces[6]}px;
  overflow-y: auto;
`;

/* eslint-disable react/display-name */
export default (props: PopperProps) => {
  const contentRef = useRef(null);
  useEffect(() => {
    //TODO(abhinav): optimize this, remove previous Popper instance.
    const parentElement = props.targetNode && props.targetNode.parentElement;
    if (
      parentElement &&
      parentElement.parentElement &&
      props.targetNode &&
      props.isOpen
    ) {
      new PopperJS(
        props.targetNode,
        (contentRef.current as unknown) as Element,
        {
          placement: "right-start",
          modifiers: {
            flip: {
              behavior: ["right", "left", "bottom", "top"],
            },
            keepTogether: {
              enabled: false,
            },
            arrow: {
              enabled: false,
            },
          },
        },
      );
    }
  }, [props.targetNode, props.isOpen]);
  return createPortal(
    <PopperWrapper ref={contentRef}>{props.children}</PopperWrapper>,
    document.body,
  );
};
