import React from "react";
import TabsComponent from "../component";
import BaseWidget, { WidgetState } from "../../BaseWidget";
import WidgetFactory from "utils/WidgetFactory";
import {
  ValidationResponse,
  ValidationTypes,
} from "constants/WidgetValidation";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { TabContainerWidgetProps, TabsWidgetProps } from "../constants";
import { AutocompleteDataType } from "utils/autocomplete/TernServer";
import { WidgetProperties } from "selectors/propertyPaneSelectors";
import { WIDGET_PADDING } from "constants/WidgetConstants";
import derivedProperties from "./parseDerivedProperties";
import { isEqual, find } from "lodash";

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
    messages: [`标签页 ${value} 不存在`],
  };
}
class TabsWidget extends BaseWidget<
  TabsWidgetProps<TabContainerWidgetProps>,
  WidgetState
> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "tabsObj",
            isJSConvertible: false,
            label: "标签页列表",
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
                  sectionName: "标签页配置",
                  children: [
                    {
                      propertyName: "isVisible",
                      label: "是否可见",
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
                  type: "Tab Name (string)",
                  example: "Tab 1",
                  autocompleteDataType: AutocompleteDataType.STRING,
                },
              },
            },
            dependencies: ["tabsObj", "tabs"],
          },
          {
            propertyName: "shouldShowTabs",
            helpText: "隐藏标签头后，标签页不可切换，只展示默认标签页",
            label: "显示标签头",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            helpText: "Enables scrolling for content inside the widget",
            propertyName: "shouldScrollContents",
            label: "滚动内容",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
          {
            propertyName: "isVisible",
            label: "是否可见",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "animateLoading",
            label: "Animate Loading",
            controlType: "SWITCH",
            helpText: "Controls the loading of the widget",
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "动作",
        children: [
          {
            helpText: "选中标签页时触发",
            propertyName: "onTabSelected",
            label: "onTabSelected",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },

      {
        sectionName: "Styles",
        children: [
          {
            propertyName: "borderRadius",
            label: "Border Radius",
            helpText:
              "Rounds the corners of the icon button's outer border edge",
            controlType: "BORDER_RADIUS_OPTIONS",

            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "boxShadow",
            label: "Box Shadow",
            helpText:
              "Enables you to cast a drop shadow from the frame of the widget",
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

  onTabChange = (tabWidgetId: string) => {
    this.props.updateWidgetMetaProperty("selectedTabWidgetId", tabWidgetId, {
      triggerPropertyName: "onTabSelected",
      dynamicString: this.props.onTabSelected,
      event: {
        type: EventType.ON_TAB_CHANGE,
      },
    });
  };

  static getDerivedPropertiesMap() {
    return {
      selectedTab: `{{(()=>{${derivedProperties.getSelectedTab}})()}}`,
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
    return (
      <TabsComponent
        {...tabsComponentProps}
        borderRadius={this.props.borderRadius}
        boxShadow={this.props.boxShadow}
        onTabChange={this.onTabChange}
        primaryColor={this.props.primaryColor}
      >
        {this.renderComponent()}
      </TabsComponent>
    );
  }

  renderComponent = () => {
    const selectedTabWidgetId = this.props.selectedTabWidgetId;
    const childWidgetData: TabContainerWidgetProps = this.props.children
      ?.filter(Boolean)
      .filter((item) => {
        return selectedTabWidgetId === item.widgetId;
      })[0];
    if (!childWidgetData) {
      return null;
    }

    childWidgetData.shouldScrollContents = false;
    childWidgetData.canExtend = this.props.shouldScrollContents;
    const { componentHeight, componentWidth } = this.getComponentDimensions();
    childWidgetData.rightColumn = componentWidth;
    childWidgetData.isVisible = this.props.isVisible;
    childWidgetData.bottomRow = this.props.shouldScrollContents
      ? childWidgetData.bottomRow
      : componentHeight - 1;
    childWidgetData.parentId = this.props.widgetId;
    childWidgetData.minHeight = componentHeight;

    return WidgetFactory.createWidget(childWidgetData, this.props.renderMode);
  };

  static getWidgetType(): string {
    return "TABS_WIDGET";
  }

  componentDidUpdate(prevProps: TabsWidgetProps<TabContainerWidgetProps>) {
    if (!isEqual(prevProps, this.props)) {
      const visibleTabs = this.getVisibleTabs();
      if (
        this.props.defaultTab &&
        this.props.defaultTab !== prevProps.defaultTab
      ) {
        const selectedTab = find(visibleTabs, {
          label: this.props.defaultTab,
        });
        const selectedTabWidgetId = selectedTab
          ? selectedTab.widgetId
          : undefined;
        this.props.updateWidgetMetaProperty(
          "selectedTabWidgetId",
          selectedTabWidgetId,
        );
      }
      // if selected tab is deleted
      if (this.props.selectedTabWidgetId) {
        if (visibleTabs.length > 0) {
          const selectedTabWithinTabs = find(visibleTabs, {
            widgetId: this.props.selectedTabWidgetId,
          });
          if (!selectedTabWithinTabs) {
            // try to select default else select first
            const defaultTab = find(visibleTabs, {
              label: this.props.defaultTab,
            });
            this.props.updateWidgetMetaProperty(
              "selectedTabWidgetId",
              (defaultTab && defaultTab.widgetId) || visibleTabs[0].widgetId,
            );
          }
        } else {
          this.props.updateWidgetMetaProperty("selectedTabWidgetId", undefined);
        }
      } else if (!this.props.selectedTabWidgetId) {
        if (visibleTabs.length > 0) {
          this.props.updateWidgetMetaProperty(
            "selectedTabWidgetId",
            visibleTabs[0].widgetId,
          );
        }
      }
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

  componentDidMount() {
    const visibleTabs = this.getVisibleTabs();
    // If we have a defaultTab
    if (this.props.defaultTab && Object.keys(this.props.tabsObj || {}).length) {
      // Find the default Tab object
      const selectedTab = find(visibleTabs, {
        label: this.props.defaultTab,
      });
      // Find the default Tab id
      const selectedTabWidgetId = selectedTab
        ? selectedTab.widgetId
        : visibleTabs.length
        ? visibleTabs[0].widgetId
        : undefined; // in case the default tab is deleted
      // If we have a legitimate default tab Id and it is not already the selected Tab
      if (
        selectedTabWidgetId &&
        selectedTabWidgetId !== this.props.selectedTabWidgetId
      ) {
        // Select the default tab
        this.props.updateWidgetMetaProperty(
          "selectedTabWidgetId",
          selectedTabWidgetId,
        );
      }
    } else if (
      !this.props.selectedTabWidgetId &&
      Object.keys(this.props.tabsObj || {}).length
    ) {
      // If no tab is selected
      // Select the first tab in the tabs list.
      this.props.updateWidgetMetaProperty(
        "selectedTabWidgetId",
        visibleTabs.length ? visibleTabs[0].widgetId : undefined,
      );
    }
  }
}

export default TabsWidget;