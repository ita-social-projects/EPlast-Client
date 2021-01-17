import React from "react";
import moment from "moment";
import { Typography, Tooltip, List, Tag } from "antd";
import {
  WomanOutlined,
  ManOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import "./Filter.less";
const { Text } = Typography;

const setTagColor = (userRoles: string) => {
  let color = "";
  if (userRoles.includes("Admin")) {
    color = "red";
  }
  if (userRoles.includes("Пластун")) {
    color = "green";
  }
  if (userRoles.includes("Прихильник")) {
    color = "orange";
  }
  if (userRoles.includes("Зацікавлений")) {
    color = "yellow";
  }
  if (userRoles.includes("Колишній член пласту")) {
    color = "black";
  }
  return color;
};

const ColumnsForUserTable: any = [
  {
    title: "№",
    dataIndex: ["user", "userProfileId"],
    render: (id: number) => <Text>{id}</Text>,
    fixed: true,
    sorter: {
      compare: (a: any, b: any) => a.user.userProfileId - b.user.userProfileId,
    },
    sortDirections: ["descend", "ascend"],
    defaultSortOrder: "ascend",
    width: 75,
  },
  {
    title: "Ім`я",
    dataIndex: ["user", "firstName"],
    render: (text: any) => (
      <Text underline strong>
        {text}
      </Text>
    ),
    sorter: (a: any, b: any) =>
      a.user.firstName.localeCompare(b.user.firstName),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Прізвище",
    dataIndex: ["user", "lastName"],
    render: (text: any | null) => (
      <Text underline strong>
        {text}
      </Text>
    ),
    sorter: (a: any, b: any) => a.user.lastName.localeCompare(b.user.lastName),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Дата народження",
    dataIndex: ["user", "birthday"],
    width: 130,
    render: (date: Date) => {
      if (date !== null) {
        return moment(date).format("DD.MM.YYYY");
      }
    },
    sorter: (a: any, b: any) => {
      a = a.user.birthday || " ";
      b = b.user.birthday || " ";
      return a.localeCompare(b);
    },
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Стать",
    dataIndex: ["user", "gender"],
    width: 120,
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
        return <h4>Інша</h4>;
      }
    },
  },
  {
    title: "Округ",
    dataIndex: "regionName",
    render: (regionName: any) => {
      if (regionName.length > 0) {
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
    render: (cityName: any) => {
      if (cityName.length > 0) {
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
    render: (clubName: any) => {
      if (clubName.length > 0) {
        return (
          <Tag color={"pink"} key={clubName}>
            {clubName}
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
    render: (userPlastDegreeName: any, record: any) => {
      if (userPlastDegreeName !== null && userPlastDegreeName.length > 0) {
        if (
          record.user.gender?.name !== null &&
          record.user.gender?.name == "Чоловік"
        ) {
          return (
            <Tag color={"red"} key={userPlastDegreeName}>
              <Tooltip
                placement="topLeft"
                title={userPlastDegreeName.split("/")[0]}
              >
                {userPlastDegreeName.split("/")[0].slice(0, 20)}
              </Tooltip>
            </Tag>
          );
        } else if (
          record.user.gender?.name !== null &&
          record.user.gender?.name == "Жінка"
        ) {
          return (
            <Tag color={"red"} key={userPlastDegreeName}>
              <Tooltip
                placement="topLeft"
                title={userPlastDegreeName.split("/")[1]}
              >
                {userPlastDegreeName.split("/")[1].slice(0, 20)}
              </Tooltip>
            </Tag>
          );
        } else {
          return (
            <Tag color={"red"} key={userPlastDegreeName}>
              <Tooltip placement="topLeft" title={userPlastDegreeName}>
                {userPlastDegreeName.slice(0, 20)}
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
  title: "Email",
    dataIndex: "email",
    width: 220,
    render: (email: any) => {
        return (
          <Tag color={"pink"}>
            {email}
          </Tag>
        );
    },
  },
  {
  title: "Ступінь УПЮ",
  dataIndex: "upuDegree",
  width: 150,
  render: (email: any) => {
      return (
        <Tag color={"yellow"}>
          {email}
        </Tag>
      );
  },
},
  {
  title: "Коментар",
    dataIndex: "Comment",
    width: 220,
    
    render: (Comment: any) => {
        return (
          <Tag color={"green"} key={Comment}>
            {Comment}
          </Tag>
        );
    },
  },
  {
    title: "Права доступу",
    dataIndex: "userRoles",
    width: 170,
    ellipsis: false,
    filters: [
      {
        text: "Пластун",
        value: "Пластун",
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
        text: "Голова Округу",
        value: "Голова Округу",
      },
      {
        text: "Діловод Округу",
        value: "Діловод Округу",
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
    ],
    filterMultiple: false,
    onFilter: (value: any, record: any) => record.userRoles.includes(value),
    render: (userRoles: any) => {
      if (userRoles.length > 20) {
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
