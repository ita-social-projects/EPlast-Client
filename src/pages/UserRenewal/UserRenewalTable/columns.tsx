import "./Filter.less";
import { FormLabelAlign } from "antd/lib/form/interface";
import { SortOrder } from "antd/lib/table/interface";
import { Tag, Tooltip } from "antd";
import moment from "moment";
import React from "react";
import UserComment from "../../UserTable/UserComment";

const fetchYears = () => {
  const arrayOfYears = [];
  const firstYear = 2020;
  var startDate = Number(new Date().getFullYear());
  for (let i = firstYear; i <= startDate; i++) {
    arrayOfYears.push({ text: i.toString(), value: i });
  }
  return arrayOfYears;
};
const years = fetchYears();
const approval: { text: string; value: boolean }[] = [
  { text: "Погоджено", value: true },
  { text: "На розгляді", value: false },
];
const columns = [
  {
    align: "center" as FormLabelAlign,
    title: "№",
    dataIndex: "id",
    width: 75,
    fixed: true,
    sorter: (a: any, b: any) => a.id - b.id,
  },
  {
    title: "Ім'я",
    dataIndex: "userName",
    render: (userName: string) => {
      return userName;
    },
    sorter: (a: any, b: any) => a.userName.localeCompare(b.userName),
    sortDirections: ["ascend", "descend"] as SortOrder[],
  },
  {
    title: "Станиця",
    dataIndex: "cityName",
    render: (cityName: string) => {
      return (
        <Tag color={"purple"} key={cityName}>
          <Tooltip placement="topLeft" title={cityName}>
            {cityName as any}
          </Tooltip>
        </Tag>)
    },
    sorter: (a: any, b: any) => a.cityName.localeCompare(b.cityName),
    sortDirections: ["ascend", "descend"] as SortOrder[],
  },
  {
    title: "Округа",
    dataIndex: "regionName",
    render: (regionName: string) => {
      return (
      <Tag color={"blue"} key={regionName}>
        <Tooltip placement="topLeft" title={regionName}>
          {regionName as any}
        </Tooltip>
      </Tag>)
    },
    sorter: (a: any, b: any) => a.regionName.localeCompare(b.regionName),
    sortDirections: ["ascend", "descend"] as SortOrder[],
  },
  {
    title: "Дата запиту",
    dataIndex: "requestDate",
    sorter: (a: any, b: any) => {
      if (a > b) return 1;
      else if (a = b) return 0;
      else return -1;
    },
    render: (requestDate: Date) => {
      return moment
        .utc(requestDate.toLocaleString())
        .local()
        .format("DD.MM.YYYY");
    },
  },
  {
    title: "E-mail",
    dataIndex: "email",
    render: (email: string) => {
      return email;
    },
    sorter: (a: any, b: any) => a.email.localeCompare(b.email),
    sortDirections: ["ascend", "descend"] as SortOrder[],
  },
  {
    title: "Статус",
    dataIndex: "approved",
    render: (approved: boolean) => {
      return (
        <div>
          {approved === true ? (
            <Tag color="green">Погоджено</Tag>
          ) : (
            <Tag color="geekblue">На розгляді</Tag>
          )}
        </div>
      );
    },
  },
  {
    title: "Коментар",
    dataIndex: "comment",
    render: (comment: string) => {
      return (
        <UserComment userId={""} canEdit={false} text={comment}/>
      )
    }
  }
];
export default columns;
