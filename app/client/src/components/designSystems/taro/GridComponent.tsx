import React, { useState } from "react";
import { Text, View, ScrollView } from "@tarojs/components";
import { Grid, Image, Button } from "@taroify/core";
import { PhotoOutlined, ShoppingCartOutlined } from "@taroify/icons";
import _ from "lodash";
import styled from "styled-components";

export interface GridComponentProps {
  list: any[];
  gridType: "I_N" | "I_N_D" | "I_N_D_B";
  urlKey: string;
  titleKey: string;
  descriptionKey?: string;
  asPrice?: boolean;
  priceUnit?: string;
  buttonText?: string;
  height?: string;
  cols?: number;
  gutter?: string;
  bordered?: boolean;
  titleColor?: string;
  descriptionColor?: string;
  buttonColor?: string;
}

const SameHeightImage = styled(Image)<{
  height?: string;
}>`
  height: ${(props) => props.height || "auto"};
`;

const Title = styled(Text)<{
  color?: string;
}>`
  color: ${(props) => props.color || "#646566"};
  font-size: 16px;
`;

const Container = styled(View)<{
  isBetween: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.isBetween ? "space-between" : "space-around"};
  margin-top: 8px;
`;

const Price = styled(Text)<{
  color?: string;
}>`
  color: ${(props) => props.color || "#DD4B34"};
  font-size: 14px;
`;

const BuyButton = styled(Button)<{
  bgColor?: string;
}>`
  background-color: ${(props) => props.bgColor || "#03b365"};
  color: #fff;
  font-size: 14px;
  padding: 0 8px;
`;

const ColorGrid = styled(Grid)<{
  textColor?: string;
}>`
  --grid-item-text-color: ${(props) => props.textColor};
`;

const GridComponent = (props: GridComponentProps) => {
  const {
    list,
    gridType,
    urlKey,
    titleKey,
    descriptionKey,
    asPrice,
    priceUnit,
    buttonText,
    height,
    cols,
    gutter,
    bordered,
    titleColor,
    descriptionColor,
    buttonColor,
  } = props;
  const items = _.isArray(list) ? list : [];
  const key = urlKey + titleKey + items.length;
  const isSimple = gridType === "I_N";

  const onClickButton = (item: any) => (e: any) => {
    e.stopPropagation();
  };

  const onClickGridItem = (item: any) => (e: any) => {
    console.log(item);
  };

  return (
    <ScrollView style={{ height: "100%" }} scrollY>
      <ColorGrid
        key={key}
        columns={cols}
        gutter={gutter}
        bordered={bordered}
        textColor={titleColor}
        clickable
      >
        {items.map((item, index) => {
          const url = item[urlKey];
          const title = item[titleKey] || "";
          const image = url ? (
            <SameHeightImage
              src={url}
              height={height}
              mode={isSimple ? undefined : "aspectFill"}
            />
          ) : (
            <PhotoOutlined size={height} />
          );
          if (isSimple) {
            return (
              <Grid.Item
                icon={image}
                text={title}
                key={index}
                onClick={onClickGridItem(item)}
              />
            );
          }
          const description = item[descriptionKey || ""] || "描述";
          const price = asPrice ? priceUnit + description : description;
          const priceView = <Price color={descriptionColor}>{price}</Price>;
          return (
            <Grid.Item key={index} onClick={onClickGridItem(item)}>
              {image}
              <View style={{ marginTop: "8px" }}>
                <Title color={titleColor}>{title}</Title>
                <Container isBetween={gridType === "I_N_D_B"}>
                  {priceView}
                  {gridType === "I_N_D_B" ? (
                    <BuyButton
                      bgColor={buttonColor}
                      size="mini"
                      shape="round"
                      onClick={onClickButton(item)}
                    >
                      {buttonText || <ShoppingCartOutlined />}
                    </BuyButton>
                  ) : null}
                </Container>
              </View>
            </Grid.Item>
          );
        })}
      </ColorGrid>
    </ScrollView>
  );
};

export default GridComponent;
