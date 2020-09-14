import React from "react";
import { Space, Spin } from "antd";
import "./Spinner.less";
import { LoadingOutlined } from "@ant-design/icons";

const Spinner = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />;

    return (
        <div className="spaceWrapper">
            <Space className="loader" size="large">
                <Spin indicator={antIcon} size="large" />
            </Space>
        </div>
    );
}

export default Spinner;