import React from "react";
import BaseWidget, { IWidgetProps, IWidgetState } from "./BaseWidget";
import { WidgetType } from "../constants/WidgetConstants";

class InputWidget extends BaseWidget<
  InputWidgetProps,
  IWidgetState
> {

  getPageView() {
    return (
      <div/>
    );
  }

  getWidgetType(): WidgetType {
    return "INPUT_WIDGET";
  }
}

export type InputType = "TEXT" | "NUMBER" | "INTEGER" | "PHONE_NUMBER" | "EMAIL" | "PASSWORD" | "CURRENCY" | "SEARCH"

export interface InputWidgetProps extends IWidgetProps {
  errorMessage?: string
  inputType: InputType;
  defaultText?: string;
  placeholder?: string;
  label: string;
  focusIndex?: number
}

export default InputWidget;
