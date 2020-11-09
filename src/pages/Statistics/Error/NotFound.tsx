import React from 'react';
import { Result, Button } from 'antd';
import classes from './Errors.module.css';

const NotFound = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Дані за заданий рік/роки не знайдені. Можливо річний звіт ще не подано?"
            extra={<Button href="/" className={classes.button}>На головну</Button>}
        />
    )
}
export default NotFound;