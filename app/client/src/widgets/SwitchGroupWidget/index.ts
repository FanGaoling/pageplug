import { Alignment } from "@blueprintjs/core";
import { LabelPosition } from "components/constants";
import IconSVG from "./icon.svg";
import Widget from "./widget";
import { WIDGET_TAGS } from "constants/WidgetConstants";

export const CONFIG = {
  features: {
    dynamicHeight: {
      sectionIndex: 3,
      active: true,
    },
  },
  type: Widget.getWidgetType(),
  name: "开关组", // The display name which will be made in uppercase and show in the widgets panel ( can have spaces )
  searchTags: ["switch group"],
  iconSVG: IconSVG,
  tags: [WIDGET_TAGS.TOGGLES],
  needsMeta: true, // Defines if this widget adds any meta properties
  isCanvas: false, // Defines if this widget has a canvas within in which we can drop other widgets
  defaults: {
    widgetName: "SwitchGroup",
    rows: 6,
    columns: 26,
    options: [
      { label: "蓝", value: "BLUE" },
      { label: "绿", value: "GREEN" },
      { label: "红", value: "RED" },
    ],
    defaultSelectedValues: ["BLUE"],
    isDisabled: false,
    isRequired: false,
    isInline: true,
    isVisible: true,
    animateLoading: true,
    alignment: Alignment.LEFT,
    labelText: "标签",
    labelPosition: LabelPosition.Top,
    labelAlignment: Alignment.LEFT,
    labelWidth: 5,
    version: 1,
    labelTextSize: "0.875rem",
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
    contentConfig: Widget.getPropertyPaneContentConfig(),
    styleConfig: Widget.getPropertyPaneStyleConfig(),
    stylesheetConfig: Widget.getStylesheetConfig(),
    setterConfig: Widget.getSetterConfig(),
    autocompleteDefinitions: Widget.getAutocompleteDefinitions(),
  },
  autoLayout: {
    disabledPropsDefaults: {
      labelPosition: LabelPosition.Top,
    },
    defaults: {
      columns: 14,
      rows: 7,
    },
    autoDimension: {
      height: true,
    },
    widgetSize: [
      {
        viewportMinWidth: 0,
        configuration: () => {
          return {
            minWidth: "240px",
            minHeight: "70px",
          };
        },
      },
    ],
    disableResizeHandles: {
      vertical: true,
    },
  },
};

export default Widget;
