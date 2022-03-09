import React from "react";
import { Result, Button } from "antd";
import classes from "./Errors.module.css";

const NotFoundPage = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Вибачте, ця сторінка не існує."
      extra={
        <Button href="/" className={classes.button} style={{ padding: "4px" }}>
          На головну
        </Button>
      }
    />
  );
};
export default NotFoundPage;
