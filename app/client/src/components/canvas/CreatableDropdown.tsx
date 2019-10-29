import React from "react";
import Creatable from "react-select/creatable";
import { WrappedFieldInputProps, WrappedFieldMetaProps } from "redux-form";
import { theme } from "../../constants/DefaultTheme";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Error = styled.span`
  color: ${props => props.theme.colors.error};
  fontsize: ${props => props.theme.fontSizes[1]};
`;

type DropdownProps = {
  options: Array<{
    value: string;
    label: string;
  }>;
  placeholder: string;
  isLoading?: boolean;
  input: WrappedFieldInputProps;
  meta: WrappedFieldMetaProps;
  onCreateOption: (inputValue: string) => void;
  formatCreateLabel?: (value: string) => React.ReactNode;
};

const selectStyles = {
  singleValue: (provided: any) => ({
    ...provided,
    backgroundColor: "rgba(104,113,239,0.1)",
    border: "1px solid rgba(104, 113, 239, 0.5)",
    borderRadius: `${theme.radii[3]}px`,
    padding: `${theme.spaces[1]}px`,
  }),
  container: (styles: any) => ({
    ...styles,
    flex: 1,
  }),
};

class CreatableDropdown extends React.Component<DropdownProps> {
  render() {
    const {
      placeholder,
      options,
      isLoading,
      onCreateOption,
      input,
      meta,
      formatCreateLabel,
    } = this.props;
    const optionalProps: Partial<DropdownProps> = {};
    if (formatCreateLabel) optionalProps.formatCreateLabel = formatCreateLabel;
    return (
      <Wrapper>
        <Creatable
          placeholder={placeholder}
          options={options}
          styles={selectStyles}
          isLoading={isLoading}
          onCreateOption={onCreateOption}
          {...input}
          onChange={value => input.onChange(value)}
          onBlur={() => input.value}
          isClearable
          {...optionalProps}
        />
        {meta && meta.touched && meta.error && <Error>{meta.error}</Error>}
      </Wrapper>
    );
  }
}

export default CreatableDropdown;
