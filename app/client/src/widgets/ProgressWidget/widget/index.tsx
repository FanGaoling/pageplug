import React from "react";

import { DerivedPropertiesMap } from "utils/WidgetFactory";
import BaseWidget, { WidgetProps, WidgetState } from "widgets/BaseWidget";

import { Colors } from "constants/Colors";
import { ValidationTypes } from "constants/WidgetValidation";
import { Stylesheet } from "entities/AppTheming";
import { getResponsiveLayoutConfig } from "utils/layoutPropertiesUtils";
import ProgressComponent from "../component";
import { ProgressType, ProgressVariant } from "../constants";

class ProgressWidget extends BaseWidget<ProgressWidgetProps, WidgetState> {
  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            helpText: "是否显示循环加载动画",
            propertyName: "isIndeterminate",
            label: "循环加载",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "设置进度条形状",
            propertyName: "progressType",
            label: "类型",
            controlType: "ICON_TABS",
            fullWidth: true,
            options: [
              {
                label: "环形",
                value: ProgressType.CIRCULAR,
              },
              {
                label: "线形",
                value: ProgressType.LINEAR,
              },
            ],
            defaultValue: ProgressType.LINEAR,
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            helpText: "设置进度值",
            propertyName: "progress",
            label: "进度",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入进度值",
            isBindProperty: true,
            isTriggerProperty: false,
            defaultValue: 50,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 0, max: 100, default: 50 },
            },
            hidden: (props: ProgressWidgetProps) => props.isIndeterminate,
            dependencies: ["isIndeterminate"],
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            helpText: "整体进度分成若干步骤，设置步骤的数量",
            propertyName: "steps",
            label: "步数",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入步数",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: {
                min: 1,
                max: 100,
                default: 1,
                natural: true,
                passThroughOnZero: false,
              },
            },
            hidden: (props: ProgressWidgetProps) => props.isIndeterminate,
            dependencies: ["isIndeterminate"],
          },
          {
            helpText: "控制组件的显示/隐藏",
            propertyName: "isVisible",
            label: "是否显示",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "counterClockwise",
            helpText: "设置进度方向是顺时针还是逆时针",
            label: "逆时针",
            controlType: "SWITCH",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
            hidden: (props: ProgressWidgetProps) =>
              props.progressType === ProgressType.LINEAR ||
              props.isIndeterminate,
            dependencies: ["isIndeterminate", "progressType"],
          },
          {
            helpText: "同步显示进度值",
            propertyName: "showResult",
            label: "显示进度值",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
            hidden: (props: ProgressWidgetProps) => props.isIndeterminate,
            dependencies: ["isIndeterminate"],
          },
        ],
      },
      ...getResponsiveLayoutConfig(this.getWidgetType()),
    ];
  }

  static getPropertyPaneStyleConfig() {
    return [
      {
        sectionName: "颜色配置",
        children: [
          {
            helpText: "设置进度条的填充颜色",
            propertyName: "fillColor",
            label: "填充颜色",
            controlType: "COLOR_PICKER",
            defaultColor: Colors.GREEN,
            isBindProperty: true,
            isJSConvertible: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.TEXT,
              params: {
                regex: /^(?![<|{{]).+/,
              },
            },
          },
        ],
      },
    ];
  }

  static getStylesheetConfig(): Stylesheet {
    return {
      fillColor: "{{appsmith.theme.colors.primaryColor}}",
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
    };
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {};
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {};
  }

  getPageView() {
    const {
      borderRadius,
      counterClockwise,
      fillColor,
      isIndeterminate,
      progress,
      progressType,
      showResult,
      steps,
    } = this.props;
    const { componentHeight, componentWidth } = this.getComponentDimensions();
    const isScaleY = componentHeight > componentWidth;

    return (
      <ProgressComponent
        borderRadius={borderRadius}
        counterClockwise={counterClockwise}
        fillColor={fillColor}
        isScaleY={isScaleY}
        showResult={showResult}
        steps={steps}
        type={progressType}
        value={progress}
        variant={
          isIndeterminate
            ? ProgressVariant.INDETERMINATE
            : ProgressVariant.DETERMINATE
        }
      />
    );
  }

  static getWidgetType(): string {
    return "PROGRESS_WIDGET";
  }
}

export interface ProgressWidgetProps extends WidgetProps {
  isIndeterminate: boolean;
  progressType: ProgressType;
  progress: number;
  steps: number;
  showResult: boolean;
  counterClockwise: boolean;
  fillColor: string;
}

export default ProgressWidget;
