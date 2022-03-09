import React from "react";
import { Button } from "antd";
import classes from "./ButtonCollapse.module.css";
import { MinusOutlined } from "@ant-design/icons";
type props = {
  handleClose: () => void;
};
const ButtonCollapse = ({ handleClose }: props) => {
  return (
    <Button onClick={handleClose} className={classes.ButtonCollapse}>
      <MinusOutlined></MinusOutlined>
    </Button>
  );
};
export default ButtonCollapse;
