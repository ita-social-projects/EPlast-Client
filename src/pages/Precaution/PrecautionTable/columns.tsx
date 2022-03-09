import React, { useState } from "react";
import moment from "moment";
import CityUser from "../../../models/City/CityUser";
import Precaution from "../Interfaces/Precaution";
import { DatePicker, Tooltip } from "antd";
import { SortOrder } from "antd/lib/table/interface";
import { FormLabelAlign } from "antd/lib/form/interface";
import "./Filter.less";

const fetchYears = () => {
  const arrayOfYears = [];
  var startDate = Number(new Date().getFullYear());
  for (let i = 2010; i <= startDate; i++) {
    arrayOfYears.push({ text: i.toString(), value: i });
  }
  return arrayOfYears;
};
const years = fetchYears();
const columns = [
  {
    align: "right" as FormLabelAlign,
    title: "№",
    dataIndex: "number",
    width: 75,
    fixed: true,
    defaultSortOrder: "ascend" as SortOrder,
    sorter: true,
  },
  {
    title: "Перестороги",
    dataIndex: "precautionName",
    filters: [
      {
        text: "Догана",
        value: "Догана",
      },
      {
        text: "Сувора догана",
        value: "Сувора догана",
      },
      {
        text: "Догана із загрозою виключення з Пласту",
        value: "Догана із загрозою виключення з Пласту",
      },
    ],
    render: (precautionName: Precaution) => {
      return precautionName;
    },
  },
  {
    title: "Ім'я",
    dataIndex: "userName",
    render: (userName: string) => {
      return userName;
    },
    sorter: true,
    sortDirections: ["ascend", "descend"] as SortOrder[],
  },
  {
    title: "Дата затвердження",
    dataIndex: "date",
    filters: years,
    render: (date: Date) => {
      return moment.utc(date.toLocaleString()).local().format("DD.MM.YYYY");
    },
  },
  {
    title: "Дата завершення",
    dataIndex: "endDate",
    render: (endDate: Date, record: any) => {
      return record.isActive === true
        ? moment.utc(endDate.toLocaleString()).local().format("DD.MM.YYYY")
        : "не активна";
    },
    sorter: true,
    sortDirections: ["ascend", "descend"] as SortOrder[],
  },
  {
    title: "Подання від",
    dataIndex: "reporter",
    ellipsis: {
      showTitle: false,
    },
    render: (reporter: any) => (
      <Tooltip placement="topLeft" title={reporter}>
        {reporter}
      </Tooltip>
    ),
  },
  {
    title: "Обгрунтування",
    dataIndex: "reason",
    ellipsis: {
      showTitle: false,
    },
    render: (reason: any) => (
      <Tooltip placement="topRight" title={reason}>
        {reason}
      </Tooltip>
    ),
  },
  {
    title: "Статус",
    dataIndex: "status",
    ellipsis: {
      showTitle: false,
    },
    filters: [
      {
        text: "Прийнято",
        value: "Прийнято",
      },
      {
        text: "Потверджено",
        value: "Потверджено",
      },
      {
        text: "Скасовано",
        value: "Скасовано",
      },
    ],
    render: (status: any) => (
      <Tooltip placement="topRight" title={status}>
        {status}
      </Tooltip>
    ),
  },
];
export default columns;
