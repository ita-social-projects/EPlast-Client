import React from "react";
import moment from "moment";
import { Typography, Tooltip, Tag } from "antd";
import {
  WomanOutlined,
  ManOutlined,
} from "@ant-design/icons";
import "./Filter.less";
import Transgender from '../../assets/images/lgbt.svg'
const { Text } = Typography;

const setTagColor = (userRoles: string) => {
  let color = "";
  if (userRoles?.includes("Admin")) {
    color = "red";
  }

  if (userRoles?.includes("Дійсний член організації")) {

    color = "green";
  }
  if (userRoles?.includes("Прихильник")) {
    color = "orange";
  }
  if (userRoles?.includes("Зацікавлений")) {
    color = "yellow";
  }
  if (userRoles?.includes("Колишній член пласту")) {
    color = "black";
  }
  if (userRoles?.includes("Зареєстрований користувач")) {
    color = "blue"
  }
  return color;
};

const ColumnsForUserTable: any = [
  {
    title: "№",
    dataIndex: "userSystemId",
    render: (id: number) => <Text>{id}</Text>,
    fixed: true,
    sorter: {
      compare: (a: any, b: any) => a.userProfileId - b.userProfileId,
    },
    sortDirections: ["descend", "ascend"],
    defaultSortOrder: "ascend",
    width: 65,
  },
  {
    title: "Ім`я",
    dataIndex: "firstName",
    width: 150,
    render: (text: any) => (
      <Text underline strong>
        {text}
      </Text>
    ),
    sorter: (a: any, b: any) => a.firstName.localeCompare(b.firstName),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Прізвище",
    dataIndex: "lastName",
    width: 150,
    render: (text: any | null) => (
      <Text underline strong>
        {text}
      </Text>
    ),
    sorter: (a: any, b: any) => a.lastName.localeCompare(b.lastName),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Дата народження",
    dataIndex: "birthday",
    width: 130,
    render: (date: Date) => {
      if (date !== null) {
        return moment(date).format("DD.MM.YYYY");
      }
    },
    sorter: (a: any, b: any) => {
      a = a.birthday || " ";
      b = b.birthday || " ";
      return a.localeCompare(b);
    },
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Стать",
    dataIndex: "gender",
    width: 80,
    render: (gender: any) => {
      if (gender === null) {
        return <h4>Не вказано</h4>;
      } else if (gender.name === "Жінка") {
        return (
          <Tooltip title="Жінка">
            <WomanOutlined />
          </Tooltip>
        );
      } else if (gender.name === "Чоловік") {
        return (
          <Tooltip title="Чоловік">
            <ManOutlined />
          </Tooltip>
        );
      } else {
        return (
          <Tooltip title="Не маю бажання вказувати">
              <img src={Transgender} alt="Transgender"/>
          </Tooltip>
        )
      }
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 160,
    render: (email: string) => {
      if(email.length >= 17)
      {
        return (
          <Tooltip title={email}>
              <span>{email.slice(0, 13) + "..."}</span>
          </Tooltip>
        )
      }
      return <span>{email}</span>
    },
  },
  {
    title: "Округа",
    dataIndex: "regionName",
    width: 100,
    render: (regionName: any) => {
      if (regionName?.length > 0) {
        return (
          <Tag color={"blue"} key={regionName}>
            {regionName}
          </Tag>
        );
      }
    },
    sorter: (a: any, b: any) => {
      a = a.regionName || " ";
      b = b.regionName || " ";
      return a.localeCompare(b);
    },
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Станиця",
    dataIndex: "cityName",
    width: 120,
    render: (cityName: any) => {
      if (cityName?.length > 0) {
        return (
          <Tag color={"purple"} key={cityName}>
            {cityName}
          </Tag>
        );
      }
    },
    sorter: (a: any, b: any) => {
      a = a.cityName || " ";
      b = b.cityName || " ";
      return a.localeCompare(b);
    },
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Курінь",
    dataIndex: "clubName",
    width: 150,
    render: (clubName: any) => {
      if (clubName?.length > 0) {
        return (
          <Tag color={"pink"} key={clubName}>
              <Tooltip
                placement="topLeft"
                title={clubName?.split("/")[0]}
              >
                {clubName?.split("/")[0]?.slice(0, 20)}
              </Tooltip>
          </Tag>
        );
      }
    },
    sorter: (a: any, b: any) => {
      a = a.clubName || " ";
      b = b.clubName || " ";
      return a.localeCompare(b);
    },
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Ступінь",
    dataIndex: "userPlastDegreeName",
    width: 150,
    render: (userPlastDegreeName: any, record: any) => {
      if (userPlastDegreeName !== null && userPlastDegreeName.length > 0) {
        if (record.gender?.name !== null && record.gender?.name == "Чоловік") {
          return (
            <Tag color={"blue"} key={userPlastDegreeName}>
              <Tooltip
                placement="topLeft"
                title={userPlastDegreeName?.split("/")[0]}
              >
                {userPlastDegreeName?.split("/")[0]?.slice(0, 20)}
              </Tooltip>
            </Tag>
          );
        } else if (
          record.gender?.name !== null &&
          record.gender?.name == "Жінка"
        ) {
          return (
            <Tag color={"red"} key={userPlastDegreeName}>
              <Tooltip
                placement="topLeft"
                title={userPlastDegreeName?.split("/")[1]}
              >
                {userPlastDegreeName?.split("/")[1]?.slice(0, 20)}
              </Tooltip>
            </Tag>
          );
        } else {
          return (
            <Tag color={"yellow"} key={userPlastDegreeName}>
              <Tooltip placement="topLeft" title={userPlastDegreeName}>
                {userPlastDegreeName?.slice(0, 20)}
              </Tooltip>
            </Tag>
          );
        }
      }
    },
    sorter: (a: any, b: any) => {
      a = a.userPlastDegreeName || " ";
      b = b.userPlastDegreeName || " ";
      return a.localeCompare(b);
    },
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Ступінь в УПЮ",
    dataIndex: "upuDegree",
    width: 210,
    render: (upuDegree: any) => {
      return <Tag color={"blue"}>{upuDegree}</Tag>;
    },
    sorter: (a: any, b: any) => a.upuDegree.localeCompare(b.upuDegree),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Права доступу",
    dataIndex: "userRoles",
    width: 170,
    ellipsis: false,
    filters: [
      {
        text: "Дійсний член організації",
        value: "Дійсний член організації",
      },
      {
        text: "Колишній член пласту",
        value: "Колишній член пласту",
      },
      {
        text: "Зацікавлений",
        value: "Зацікавлений",
      },
      {
        text: "Прихильник",
        value: "Прихильник",
      },
      {
        text: "Голова Округи",
        value: "Голова Округи",
      },
      {
        text: "Діловод Округи",
        value: "Діловод Округи",
      },
      {
        text: "Голова Станиці",
        value: "Голова Станиці",
      },
      {
        text: "Діловод Станиці",
        value: "Діловод Станиці",
      },
      {
        text: "Голова Куреня",
        value: "Голова Куреня",
      },
      {
        text: "Діловод Куреня",
        value: "Діловод Куреня",
      },
      {
        text: "Зареєстрований користувач",
        value: "Зареєстрований користувач"
      }
    ],
    filterMultiple: false,
    onFilter: (value: any, record: any) => record.userRoles?.includes(value),
    render: (userRoles: any) => {
      if (userRoles?.length > 20) {
        return (
          <Tag color={setTagColor(userRoles)} key={userRoles}>
            <Tooltip placement="topLeft" title={userRoles}>
              {userRoles.slice(0, 20)}
            </Tooltip>
          </Tag>
        );
      }
      return (
        <Tag color={setTagColor(userRoles)} key={userRoles}>
          <Tooltip placement="topLeft" title={userRoles}>
            {userRoles}
          </Tooltip>
        </Tag>
      );
    },
  },
];

export default ColumnsForUserTable;
