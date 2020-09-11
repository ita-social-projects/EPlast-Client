import React from "react";
import { Drawer, Button, Space, Spin } from "antd";
import Spinner from "./Spinner";
import { LoadingOutlined } from "@ant-design/icons";

const EventCreateDrawer = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />;

    return (
        <div className="spaceWrapper">
            <Space className="loader" size="large">
                <Spin indicator={antIcon} size="large" />
            </Space>
        </div>
    );
}

export default EventCreateDrawer;