import React from "react";
import moment from "moment";
import { Tooltip, Tag, Row, Col } from "antd";
import {
  WomanOutlined,
  ManOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import "./Filter.less";
import Transgender from '../../assets/images/lgbt.svg'
import { Roles } from "../../models/Roles/Roles";
import "../AnnualReport/AnnualReportTable/AnnualReportTable.less";

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

interface Props {
  sortKey: number;
  setSortKey: any;
  setFilter: any;
  filterRole: string;
}

const ColumnsForUserTable=(props: Props):any[] => {
  const { sortKey, setSortKey, setFilter, filterRole } = props;
  
  const SortDirection=(props:{sort: number})=>{
    return<>
      <div className={"tableHeaderSorting"}>
        <button onClick={()=>{setSortKey(props.sort)}} className={sortKey===props.sort? "sortDirection":""}><CaretUpOutlined /></button>
        <button onClick={()=>{setSortKey(-props.sort)}} className={sortKey===-props.sort? "sortDirection":""}><CaretDownOutlined /></button>
      </div>
    </>
  }

  const SortColumnHighlight =(sort: number, text: any)=>{
    return {
      props: {
        style: { backgroundColor: (sortKey===sort || sortKey===-sort)? "#fafafa" : "", }
      },
      children: <div>{text}</div>
    };
  }
  return [
  {
    title: <Row className="tableHeader"><Col>№</Col><Col><SortDirection sort={1} /></Col></Row>,
      render: (text: any)=>{return SortColumnHighlight(1, text)},

    dataIndex: "userSystemId",
    fixed: true,
    width: 75,
  },
  {
    title: <Row className="tableHeader"><Col>Ім'я</Col><Col><SortDirection sort={2} /></Col></Row>,
    dataIndex: "firstName",
    width: 150,
    render: (text: any)=>{return SortColumnHighlight(2, text)},

  },
  {
    title: <Row className="tableHeader"><Col>Прізвище</Col><Col><SortDirection sort={3} /></Col></Row>,
    dataIndex: "lastName",
    width: 150,
    render: (text: any)=>{return SortColumnHighlight(3, text)},
  },
  {
    title: <Row className="tableHeader"><Col>Дата народження</Col><Col><SortDirection sort={4} /></Col></Row>,
    dataIndex: "birthday",
    width: 130,
    render: (date: Date)=>{
      return SortColumnHighlight(4, <>{date !== null? moment(date.toLocaleString()).format("DD.MM.YYYY") : ""}</>)},
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
    title: <Row className="tableHeader"><Col>Округа</Col><Col><SortDirection sort={5} /></Col></Row>,
    dataIndex: "regionName",
    width: 110,
    render: (regionName: any)=>{return SortColumnHighlight(5, regionName==null? "":<Tag color={"blue"} key={regionName}>
      {(regionName?.length > 13)? <Tooltip title={regionName}>
        <span>{regionName.slice(0,12)+"..."}</span>
        </Tooltip> : regionName}
    </Tag>)},
  },
  {
    title: <Row className="tableHeader"><Col>Станиця</Col><Col><SortDirection sort={6} /></Col></Row>,
    dataIndex: "cityName",
    width: 120,
    render: (cityName: any)=>{return SortColumnHighlight(6, cityName==null? "": <Tag color={"purple"} key={cityName}>
      {(cityName?.length > 13)? <Tooltip title={cityName}>
        <span>{cityName.slice(0,12)+"..."}</span>
        </Tooltip> : cityName}
    </Tag>)},
  },
  {
    title: <Row className="tableHeader"><Col>Курінь</Col><Col><SortDirection sort={7} /></Col></Row>,
    dataIndex: "clubName",
    width: 150,
    render: (clubName: any)=>{return SortColumnHighlight(7, clubName==null? "": <Tag color={"pink"} key={clubName}>
      {(clubName?.length > 17)? <Tooltip title={clubName}>
        <span>{clubName.slice(0,16)+"..."}</span>
        </Tooltip> : clubName}
  </Tag>)},
  },
  {
    title: <Row className="tableHeader"><Col>Ступінь</Col><Col><SortDirection sort={8} /></Col></Row>,
    dataIndex: "userPlastDegreeName",
    width: 150,
    render: (userPlastDegreeName: any, record: any)=>{
      if (userPlastDegreeName !== null && userPlastDegreeName.length > 0)
      {
        if (record.gender?.name !== null && record.gender?.name == "Чоловік")
        {
          return SortColumnHighlight(8, <Tag color={"blue"} key={userPlastDegreeName}>
      <Tooltip
        placement="topLeft"
        title={userPlastDegreeName?.includes("/")? userPlastDegreeName?.split("/")[0]: userPlastDegreeName}
      >
        {userPlastDegreeName?.includes("/")? userPlastDegreeName?.split("/")[0]?.slice(0, 20): userPlastDegreeName}
      </Tooltip>
    </Tag>)
        } else if (
          record.gender?.name !== null &&
          record.gender?.name == "Жінка"
        )
        {
          return SortColumnHighlight(8, <Tag color={"red"} key={userPlastDegreeName}>
          <Tooltip
            placement="topLeft"
            title={userPlastDegreeName?.includes("/")? userPlastDegreeName?.split("/")[1]: userPlastDegreeName}
          >
            {userPlastDegreeName?.includes("/")? userPlastDegreeName?.split("/")[1].slice(0, 20): userPlastDegreeName}
          </Tooltip>
        </Tag>)
        } else{
          return SortColumnHighlight(8, <Tag color={"yellow"} key={userPlastDegreeName}>
          <Tooltip placement="topLeft" title={userPlastDegreeName}>
            {userPlastDegreeName?.slice(0, 20)}
          </Tooltip>
        </Tag>)
        }
      } else{
        return SortColumnHighlight(8, "")
      }},
  },
  {
    title: <Row className="tableHeader"><Col>Ступінь в УПЮ</Col><Col><SortDirection sort={9} /></Col></Row>,
    dataIndex: "upuDegree",
    width: 210,
    render: (upuDegree: any)=>{
      return SortColumnHighlight(9, <Tag color={"blue"}>{upuDegree}</Tag>)},
  },
  {
    title: "Права доступу",
    dataIndex: "userRoles",
    width: 170,
    ellipsis: false,
    filteredValue: [filterRole],
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
    onFilter: (value: any, record: any) => {if(value!=filterRole) setFilter(value) 
      else {return true}},
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
]};

export default ColumnsForUserTable;
