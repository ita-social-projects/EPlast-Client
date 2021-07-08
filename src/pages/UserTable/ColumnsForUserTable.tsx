import React from "react";
import moment from "moment";
import { Typography, Tooltip, Tag } from "antd";
import {
  WomanOutlined,
  ManOutlined,
} from "@ant-design/icons";
import "./Filter.less";
import Transgender from '../../assets/images/lgbt.svg'
import { Roles } from "../../models/Roles/Roles";
const { Text } = Typography;

const setTagColor = (userRoles: string) => {
  let color = "";
  if (userRoles?.includes(Roles.Admin)) {
    color = "red";
  }

  if (userRoles?.includes(Roles.PlastMember)) {

    color = "green";
  }
  if (userRoles?.includes(Roles.Supporter)) {
    color = "orange";
  }
  if (userRoles?.includes(Roles.Interested)) {
    color = "yellow";
  }
  if (userRoles?.includes(Roles.FormerPlastMember)) {
    color = "black";
  }
  if (userRoles?.includes(Roles.RegisteredUser)) {
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
      if(!regionName){
        return (
        ""
        );
      }
      if (regionName?.length > 9) {
        return (
          <Tag color={"blue"} key={regionName}>
            <Tooltip placement="topLeft" title={regionName}>
              {regionName.slice(0, 9)}
            </Tooltip>
          </Tag>
        );
      }     
      return (
        <Tag color={"blue"} key={regionName}>
          <Tooltip placement="topLeft" title={regionName}>
            {regionName}
          </Tooltip>
        </Tag>
      );    
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
      if(!cityName){
        return (
        ""
        );
      }
      if (cityName?.length > 13) {
        return (
          <Tag color={"purple"} key={cityName}>
            <Tooltip placement="topLeft" title={cityName}>
              {cityName.slice(0, 13)}
            </Tooltip>
          </Tag>
        );
      }
      return (
        <Tag color={"purple"} key={cityName}>
          <Tooltip placement="topLeft" title={cityName}>
            {cityName}
          </Tooltip>
        </Tag>
      );
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
      if(!clubName){
        return (
        ""
        );
      }
      if (clubName?.length > 20) {
        return (
          <Tag color={"pink"} key={clubName}>
            <Tooltip placement="topLeft" title={clubName}>
              {clubName.slice(0, 20)}
            </Tooltip>
          </Tag>
        );
      }
      return (
        <Tag color={"pink"} key={clubName}>
          <Tooltip placement="topLeft" title={clubName}>
            {clubName}
          </Tooltip>
        </Tag>
      );
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
      if(!userPlastDegreeName){
        return (
        ""
        );
      }
      if (userPlastDegreeName?.length > 20 ) {
        if (record.gender?.name !== null && record.gender?.name == "Чоловік") {
          return (
            <Tag color={"blue"} key={userPlastDegreeName}>
              <Tooltip
                placement="topLeft"
                title={userPlastDegreeName?.split("/")[0]}
              >
                {userPlastDegreeName?.split("/")[0]?.slice(0, 15)}
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
                {userPlastDegreeName?.split("/")[1]?.slice(0, 17)}
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
        text: Roles.PlastMember,
        value: Roles.PlastMember,
      },
      {
        text: Roles.FormerPlastMember,
        value: Roles.FormerPlastMember,
      },
      {
        text: Roles.Supporter,
        value: Roles.Supporter,
      },
      {
        text: Roles.OkrugaHead,
        value: Roles.OkrugaHead,
      },
      {
        text: Roles.OkrugaSecretary,
        value: Roles.OkrugaSecretary,
      },
      {
        text: Roles.CityHead,
        value: Roles.CityHead,
      },
      {
        text: Roles.CitySecretary,
        value: Roles.CitySecretary,
      },
      {
        text: Roles.KurinHead,
        value: Roles.KurinHead,
      },
      {
        text: Roles.KurinSecretary,
        value: Roles.KurinSecretary,
      },
      {
        text: Roles.RegisteredUser,
        value: Roles.RegisteredUser
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
