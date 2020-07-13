import React from "react";
import { Row, Col, Table, Tooltip } from "antd";
import {
  UserDeleteOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  CameraOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

const classes = require("./EventInfo.module.css");

interface Props {
  userId?: string;
}

const SortedEventInfo = ({ userId = "" }: Props) => {
  const columns = [
    {
      title: "Назва",
      dataIndex: "name",
      key: "name",
    },
    {
      title: `Крайовий пластовий з'їзд молоді`,
      dataIndex: "desc",
      key: "desc",
    },
  ];

  const data = [
    {
      key: "1",
      name: "Тип:",
      desc: "акція",
    },
    {
      key: "2",
      name: "Категорія:",
      desc: "КПЗ",
    },
    {
      key: "3",
      name: "Дата початку:",
      desc: "15-05-2020",
    },
    {
      key: "4",
      name: "Дата завершення:",
      desc: "16-08-2020",
    },
    {
      key: "5",
      name: "Локація:",
      desc: "Одеса",
    },
    {
      key: "6",
      name: "Призначений для:",
      desc: "для молодих та активних людей",
    },
    {
      key: "7",
      name: "Форма проведення:",
      desc: "на вулиці",
    },
    {
      key: "8",
      name: "Статус:",
      desc: "не затверджені",
    },
    {
      key: "9",
      name: "Опис:",
      desc:
        "дана подія присвячена екологічним проблемам України. Метою даного заходу є пробудити почуття відповідальності у молодого покоління перед природою.",
    },
  ];

  return (
    <div className={classes.background}>
      <h1 className={classes.mainTitle}>{userId}</h1>
      <div className={classes.actionsWrapper}>
        <Row>
          <Col span={10} push={14}>
            <img
              className={classes.imgEvent}
              alt="example"
              src="https://www.kindpng.com/picc/m/150-1504140_shaking-hands-png-download-transparent-background-hand-shake.png"
            />
            <div className={classes.iconsFlex}>
              <Tooltip
                placement="bottom"
                title="Ваша кандидатура розглядається"
              >
                <UserSwitchOutlined className={classes.icon} />
              </Tooltip>
              <Tooltip
                placement="bottom"
                title="Натисніть, щоб відписатись від події"
              >
                <UserDeleteOutlined className={classes.icon} />
              </Tooltip>
              <Tooltip placement="bottom" title="Учасники">
                <TeamOutlined className={classes.icon} />
              </Tooltip>
              <Tooltip placement="bottom" title="Галерея">
                <CameraOutlined className={classes.icon} />
              </Tooltip>
              <Tooltip placement="bottom" title="Адміністратор(-и) події">
                <IdcardOutlined className={classes.icon} />
              </Tooltip>
            </div>
          </Col>
          <Col span={14} pull={10}>
            <Table columns={columns} dataSource={data} pagination={false} />
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default SortedEventInfo;
