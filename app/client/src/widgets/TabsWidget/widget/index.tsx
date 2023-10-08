import { ReduxActionTypes } from "@appsmith/constants/ReduxActionConstants";
import { LayoutDirection, Positioning } from "utils/autoLayout/constants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { WIDGET_PADDING } from "constants/WidgetConstants";
import type { ValidationResponse } from "constants/WidgetValidation";
import { ValidationTypes } from "constants/WidgetValidation";
import { find, isEmpty } from "lodash";
import React from "react";
import { AppPositioningTypes } from "reducers/entityReducers/pageListReducer";
import type { WidgetProperties } from "selectors/propertyPaneSelectors";
import { AutocompleteDataType } from "utils/autocomplete/AutocompleteDataType";
import WidgetFactory from "utils/WidgetFactory";
import type { WidgetState } from "../../BaseWidget";
import BaseWidget from "../../BaseWidget";
import TabsComponent from "../component";
import type { TabContainerWidgetProps, TabsWidgetProps } from "../constants";
import derivedProperties from "./parseDerivedProperties";
import type { SetterConfig, Stylesheet } from "entities/AppTheming";
import {
  isAutoHeightEnabledForWidget,
  isAutoHeightEnabledForWidgetWithLimits,
  DefaultAutocompleteDefinitions,
} from "widgets/WidgetUtils";
import type { AutocompletionDefinitions } from "widgets/constants";

export function selectedTabValidation(
  value: unknown,
  props: TabContainerWidgetProps,
): ValidationResponse {
  const tabs: Array<{
    label: string;
    id: string;
  }> = props.tabsObj ? Object.values(props.tabsObj) : props.tabs || [];
  const tabNames = tabs.map((i: { label: string; id: string }) => i.label);
  return {
    isValid: value === "" ? true : tabNames.includes(value as string),
    parsed: value,
    messages: [
      {
        name: "ValidationError",
        message: `标签页 ${value} 不存在`,
      },
    ],
  };
}
class TabsWidget extends BaseWidget<
  TabsWidgetProps<TabContainerWidgetProps>,
  WidgetState
> {
  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "数据",
        children: [
          {
            propertyName: "tabsObj",
            isJSConvertible: false,
            label: "标签页列表",
            helpText: "Tabs",
            controlType: "TABS_INPUT",
            isBindProperty: false,
            isTriggerProperty: false,
            updateRelatedWidgetProperties: (
              propertyPath: string,
              propertyValue: string,
              props: WidgetProperties,
            ) => {
              const propertyPathSplit = propertyPath.split(".");
              const property = propertyPathSplit.pop();
              if (property === "label") {
                const itemId = propertyPathSplit.pop() || "";
                const item = props.tabsObj[itemId];
                if (item) {
                  return [
                    {
                      widgetId: item.widgetId,
                      updates: {
                        modify: {
                          tabName: propertyValue,
                        },
                      },
                    },
                  ];
                }
              }
              return [];
            },
            panelConfig: {
              editableTitle: true,
              titlePropertyName: "label",
              panelIdPropertyName: "id",
              updateHook: (
                props: any,
                propertyPath: string,
                propertyValue: string,
              ) => {
                return [
                  {
                    propertyPath,
                    propertyValue,
                  },
                ];
              },
              children: [
                {
                  sectionName: "属性",
                  children: [
                    {
                      propertyName: "isVisible",
                      label: "是否显示",
                      helpText: "标签页是否可见",
                      controlType: "SWITCH",
                      useValidationMessage: true,
                      isJSConvertible: true,
                      isBindProperty: true,
                      isTriggerProperty: false,
                      validation: { type: ValidationTypes.BOOLEAN },
                    },
                  ],
                },
              ],
            },
          },
          {
            propertyName: "defaultTab",
            placeholderText: "输入标签页名称",
            label: "默认标签页",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.FUNCTION,
              params: {
                fn: selectedTabValidation,
                expected: {
                  type: "标签页名称 (string)",
                  example: "Tab 1",
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
              dependentPaths: ["tabsObj", "tabs"],
            },
            dependencies: ["tabsObj", "tabs"],
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "isVisible",
            label: "是否显示",
            helpText: "控制组件的显示/隐藏",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            helpText: "允许组件内部内容滚动",
            propertyName: "shouldScrollContents",
            label: "允许内容滚动",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "animateLoading",
            label: "加载时显示动画",
            controlType: "SWITCH",
            helpText: "组件依赖的数据加载时显示加载动画",
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "shouldShowTabs",
            helpText: "隐藏标签头后，标签页不可切换，只展示默认标签页",
            label: "显示标签头",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
            postUpdateAction: ReduxActionTypes.CHECK_CONTAINERS_FOR_AUTO_HEIGHT,
          },
        ],
      },
      {
        sectionName: "事件",
        children: [
          {
            helpText: "标签页切换时触发",
            propertyName: "onTabSelected",
            label: "onTabSelected",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getPropertyPaneStyleConfig() {
    return [
      {
        sectionName: "轮廓样式",
        children: [
          {
            propertyName: "accentColor",
            helpText: "设置当前标签页下标颜色",
            label: "下标颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "使用 html 颜色名, HEX, RGB 或者 RGBA 颜色格式",
            placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
            propertyName: "backgroundColor",
            label: "背景颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "使用 html 颜色名, HEX, RGB 或者 RGBA 颜色格式",
            placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
            propertyName: "borderColor",
            label: "边框颜色",
            controlType: "COLOR_PICKER",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "设置边框宽度（px 单位）",
            propertyName: "borderWidth",
            label: "边框宽度",
            placeholderText: "单位是 px",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.NUMBER },
            postUpdateAction: ReduxActionTypes.CHECK_CONTAINERS_FOR_AUTO_HEIGHT,
          },
          {
            propertyName: "borderRadius",
            label: "边框圆角",
            helpText: "边框圆角样式",
            controlType: "BORDER_RADIUS_OPTIONS",

            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "boxShadow",
            label: "阴影",
            helpText: "组件轮廓投影",
            controlType: "BOX_SHADOW_OPTIONS",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  static getSetterConfig(): SetterConfig {
    return {
      __setters: {
        setVisibility: {
          path: "isVisible",
          type: "boolean",
        },
      },
    };
  }

  callDynamicHeightUpdates = () => {
    const { checkContainersForAutoHeight } = this.context;
    checkContainersForAutoHeight && checkContainersForAutoHeight();
  };

  callPositionUpdates = (tabWidgetId: string) => {
    const { updatePositionsOnTabChange } = this.context;
    updatePositionsOnTabChange &&
      updatePositionsOnTabChange(this.props.widgetId, tabWidgetId);
  };

  onTabChange = (tabWidgetId: string) => {
    this.props.updateWidgetMetaProperty("selectedTabWidgetId", tabWidgetId, {
      triggerPropertyName: "onTabSelected",
      dynamicString: this.props.onTabSelected,
      event: {
        type: EventType.ON_TAB_CHANGE,
      },
    });
    setTimeout(this.callDynamicHeightUpdates, 0);
    setTimeout(() => this.callPositionUpdates(tabWidgetId), 0);
  };

  static getStylesheetConfig(): Stylesheet {
    return {
      accentColor: "{{appsmith.theme.colors.primaryColor}}",
      borderRadius: "{{appsmith.theme.borderRadius.appBorderRadius}}",
      boxShadow: "{{appsmith.theme.boxShadow.appBoxShadow}}",
    };
  }

  static getDerivedPropertiesMap() {
    return {
      selectedTab: `{{(()=>{${derivedProperties.getSelectedTab}})()}}`,
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      isVisible: DefaultAutocompleteDefinitions.isVisible,
      selectedTab: "string",
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      selectedTabWidgetId: undefined,
    };
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {};
  }

  getPageView() {
    const { leftColumn, parentColumnSpace, rightColumn } = this.props;

    const tabsComponentProps = {
      ...this.props,
      tabs: this.getVisibleTabs(),
      width:
        (rightColumn - leftColumn) * parentColumnSpace - WIDGET_PADDING * 2,
    };
    const isAutoHeightEnabled: boolean =
      isAutoHeightEnabledForWidget(this.props) &&
      !isAutoHeightEnabledForWidgetWithLimits(this.props);
    return (
      <TabsComponent
        {...tabsComponentProps}
        $noScroll={isAutoHeightEnabled}
        backgroundColor={this.props.backgroundColor}
        borderColor={this.props.borderColor}
        borderRadius={this.props.borderRadius}
        borderWidth={this.props.borderWidth}
        boxShadow={this.props.boxShadow}
        onTabChange={this.onTabChange}
        primaryColor={this.props.primaryColor}
        selectedTabWidgetId={this.getSelectedTabWidgetId()}
        shouldScrollContents={
          this.props.shouldScrollContents &&
          this.props.appPositioningType !== AppPositioningTypes.AUTO
        }
      >
        {this.renderComponent()}
      </TabsComponent>
    );
  }

  renderComponent = () => {
    const selectedTabWidgetId = this.getSelectedTabWidgetId();
    const childWidgetData = {
      ...this.props.children?.filter(Boolean).filter((item) => {
        return selectedTabWidgetId === item.widgetId;
      })[0],
    };
    if (isEmpty(childWidgetData)) {
      return null;
    }

    childWidgetData.canExtend = this.props.shouldScrollContents;
    const { componentHeight, componentWidth } = this.getComponentDimensions();
    childWidgetData.rightColumn = componentWidth;
    childWidgetData.isVisible = this.props.isVisible;
    childWidgetData.bottomRow = this.props.shouldScrollContents
      ? childWidgetData.bottomRow
      : componentHeight - 1;
    childWidgetData.parentId = this.props.widgetId;
    childWidgetData.minHeight = componentHeight;
    const selectedTabProps = Object.values(this.props.tabsObj)?.filter(
      (item) => item.widgetId === selectedTabWidgetId,
    )[0];
    const positioning: Positioning =
      this.props.appPositioningType == AppPositioningTypes.AUTO
        ? Positioning.Vertical
        : Positioning.Fixed;
    childWidgetData.positioning = positioning;
    childWidgetData.useAutoLayout = positioning !== Positioning.Fixed;
    childWidgetData.direction =
      positioning === Positioning.Vertical
        ? LayoutDirection.Vertical
        : LayoutDirection.Horizontal;
    childWidgetData.alignment = selectedTabProps?.alignment;
    childWidgetData.spacing = selectedTabProps?.spacing;

    return WidgetFactory.createWidget(childWidgetData, this.props.renderMode);
  };

  private getSelectedTabWidgetId() {
    let selectedTabWidgetId = this.props.selectedTabWidgetId;
    if (this.props.children) {
      selectedTabWidgetId =
        this.props.children.find((tab) =>
          this.props.selectedWidgetAncestry?.includes(tab.widgetId),
        )?.widgetId ?? this.props.selectedTabWidgetId;
    }
    return selectedTabWidgetId;
  }

  static getWidgetType(): string {
    return "TABS_WIDGET";
  }

  componentDidUpdate(prevProps: TabsWidgetProps<TabContainerWidgetProps>) {
    const visibleTabs = this.getVisibleTabs();
    const selectedTab = find(visibleTabs, {
      widgetId: this.props.selectedTabWidgetId,
    });

    if (this.props.defaultTab !== prevProps.defaultTab || !selectedTab) {
      this.setDefaultSelectedTabWidgetId();
    }
  }

  getVisibleTabs = () => {
    const tabs = Object.values(this.props.tabsObj || {});
    if (tabs.length) {
      return tabs
        .filter(
          (tab) => tab.isVisible === undefined || !!tab.isVisible === true,
        )
        .sort((tab1, tab2) => tab1.index - tab2.index);
    }
    return [];
  };

  setDefaultSelectedTabWidgetId = () => {
    const visibleTabs = this.getVisibleTabs();
    // Find the default Tab object
    const defaultTab = find(visibleTabs, {
      label: this.props.defaultTab,
    });
    // Find the default Tab id
    const defaultTabWidgetId =
      defaultTab?.widgetId ?? visibleTabs?.[0]?.widgetId; // in case the default tab is deleted

    // If we have a legitimate default tab Id and it is not already the selected Tab
    if (
      defaultTabWidgetId &&
      defaultTabWidgetId !== this.props.selectedTabWidgetId
    ) {
      // Select the default tab
      this.props.updateWidgetMetaProperty(
        "selectedTabWidgetId",
        defaultTabWidgetId,
      );
      setTimeout(this.callDynamicHeightUpdates, 0);
    }
  };

  componentDidMount() {
    Object.keys(this.props.tabsObj || {}).length &&
      this.setDefaultSelectedTabWidgetId();
  }
}

export default TabsWidget;
