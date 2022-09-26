import { ColumnTypes, TableWidgetProps } from "widgets/TableWidgetV2/constants";
import { get } from "lodash";
import { getBasePropertyPath, hideByColumnType } from "../../propertyUtils";

export default {
  sectionName: "事件",
  hidden: (props: TableWidgetProps, propertyPath: string) => {
    if (
      !hideByColumnType(
        props,
        propertyPath,
        [
          ColumnTypes.BUTTON,
          ColumnTypes.ICON_BUTTON,
          ColumnTypes.IMAGE,
          ColumnTypes.EDIT_ACTIONS,
        ],
        true,
      )
    ) {
      return false;
    } else {
      const columnType = get(props, `${propertyPath}.columnType`, "");
      const isEditable = get(props, `${propertyPath}.isEditable`, "");
      return (
        !(
          columnType === ColumnTypes.TEXT ||
          columnType === ColumnTypes.NUMBER ||
          columnType === ColumnTypes.CHECKBOX ||
          columnType === ColumnTypes.SWITCH
        ) || !isEditable
      );
    }
  },
  children: [
    // Button, iconButton onClick
    {
      helpText: "点击按钮时触发",
      propertyName: "onClick",
      label: "onClick",
      controlType: "ACTION_SELECTOR",
      additionalAutoComplete: (props: TableWidgetProps) => ({
        currentRow: Object.assign(
          {},
          ...Object.keys(props.primaryColumns).map((key) => ({
            [key]: "",
          })),
        ),
      }),
      isJSConvertible: true,
      dependencies: ["primaryColumns", "columnOrder"],
      isBindProperty: true,
      isTriggerProperty: true,
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [
          ColumnTypes.BUTTON,
          ColumnTypes.ICON_BUTTON,
        ]);
      },
    },
    // Image onClick
    {
      propertyName: "onClick",
      label: "onClick",
      controlType: "ACTION_SELECTOR",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const baseProperty = getBasePropertyPath(propertyPath);
        const columnType = get(props, `${baseProperty}.columnType`, "");
        return columnType !== ColumnTypes.IMAGE;
      },
      dependencies: ["primaryColumns", "columnOrder"],
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: true,
    },
    {
      propertyName: "onSubmit",
      label: "onSubmit",
      controlType: "ACTION_SELECTOR",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const baseProperty = getBasePropertyPath(propertyPath);
        const columnType = get(props, `${baseProperty}.columnType`, "");
        const isEditable = get(props, `${baseProperty}.isEditable`, "");
        return (
          !(
            columnType === ColumnTypes.TEXT || columnType === ColumnTypes.NUMBER
          ) || !isEditable
        );
      },
      dependencies: ["primaryColumns", "inlineEditingSaveOption"],
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: true,
    },
    {
      propertyName: "onOptionChange",
      label: "onOptionChange",
      controlType: "ACTION_SELECTOR",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const baseProperty = getBasePropertyPath(propertyPath);
        const columnType = get(props, `${baseProperty}.columnType`, "");
        const isEditable = get(props, `${baseProperty}.isEditable`, "");
        return columnType !== ColumnTypes.SELECT || !isEditable;
      },
      dependencies: ["primaryColumns"],
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: true,
    },
    {
      propertyName: "onCheckChange",
      label: (props: TableWidgetProps, propertyPath: string) => {
        const basePropertyPath = getBasePropertyPath(propertyPath);
        const columnType = get(props, `${basePropertyPath}.columnType`);
        return columnType === ColumnTypes.SWITCH ? "onChange" : "onCheckChange";
      },
      controlType: "ACTION_SELECTOR",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        return hideByColumnType(props, propertyPath, [
          ColumnTypes.CHECKBOX,
          ColumnTypes.SWITCH,
        ]);
      },
      dependencies: ["primaryColumns"],
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: true,
    },
    {
      propertyName: "onSave",
      label: "onSave",
      controlType: "ACTION_SELECTOR",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const baseProperty = getBasePropertyPath(propertyPath);
        const columnType = get(props, `${baseProperty}.columnType`, "");
        return columnType !== ColumnTypes.EDIT_ACTIONS;
      },
      dependencies: ["primaryColumns"],
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: true,
    },
    {
      propertyName: "onDiscard",
      label: "onDiscard",
      controlType: "ACTION_SELECTOR",
      hidden: (props: TableWidgetProps, propertyPath: string) => {
        const baseProperty = getBasePropertyPath(propertyPath);
        const columnType = get(props, `${baseProperty}.columnType`, "");
        return columnType !== ColumnTypes.EDIT_ACTIONS;
      },
      dependencies: ["primaryColumns"],
      isJSConvertible: true,
      isBindProperty: true,
      isTriggerProperty: true,
    },
  ],
};
