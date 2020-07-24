import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ConfigProvider } from "antd";
import UkLocale from 'antd/es/locale/uk_UA';

ReactDOM.render(
    <ConfigProvider locale ={UkLocale}>
        <App />
    </ConfigProvider>
    , document.getElementById("root"));


