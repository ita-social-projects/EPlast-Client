import "./Filter.less";
import { FormLabelAlign } from "antd/lib/form/interface";
import { SortOrder } from "antd/lib/table/interface";
import { Tag } from "antd";
import moment from "moment";
import React from "react";

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
  { text: "погоджено", value: true },
  { text: "на розгляді", value: false },
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
      return cityName;
    },
    sorter: (a: any, b: any) => a.cityName.localeCompare(b.cityName),
    sortDirections: ["ascend", "descend"] as SortOrder[],
  },
  {
    title: "Округа",
    dataIndex: "regionName",
    render: (regionName: string) => {
      return regionName;
    },
    sorter: (a: any, b: any) => a.regionName.localeCompare(b.regionName),
    sortDirections: ["ascend", "descend"] as SortOrder[],
  },
  {
    title: "Дата запиту",
    dataIndex: "requestDate",
    filters: years,
    onFilter: (value: any, record: any) => record.requestDate.includes(value),
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
    filters: approval,
    onFilter: (value: any, record: any) => record.approved === value,
    render: (approved: boolean) => {
      return (
        <div>
          {approved === true ? (
            <Tag color="green">погоджено</Tag>
          ) : (
            <Tag color="geekblue">на розгляді</Tag>
          )}
        </div>
      );
    },
  },
];
export default columns;
