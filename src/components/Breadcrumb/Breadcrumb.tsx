import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import React from "react";
import { Link } from "react-router-dom";

interface Props {
  current?: string;
  first?: any;
  second?: any;
  second_name?: string;
  third?: any;
  third_name?: string;
}
const Crumb = ({
  current,
  first,
  second,
  second_name,
  third,
  third_name,
}: Props) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href={first}>
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item href={second}>{second_name}</Breadcrumb.Item>
      <Breadcrumb.Item>{current}</Breadcrumb.Item>
    </Breadcrumb>
  );
};
export default Crumb;
