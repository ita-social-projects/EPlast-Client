import React from "react";
import { Result, Button } from "antd";
import classes from "./Errors.module.css";

const NotAuthorizedPage = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Вибачте, у вас немає доступу до цієї сторінки."
      extra={
        <Button href="/" className={classes.button}>
          На головну
        </Button>
      }
    />
  );
};
export default NotAuthorizedPage;
