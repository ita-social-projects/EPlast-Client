import React, { useState } from 'react';
import moment from 'moment';
import CityUser from '../../../models/City/CityUser';
import Precaution from "../Interfaces/Precaution";
import { DatePicker, Tooltip } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { FormLabelAlign } from 'antd/lib/form/interface';


const fetchYears = () => {
  const arrayOfYears = [];
  var startDate = Number(new Date().getFullYear());
  for (let i = 2010; i <= startDate; i++) {
    arrayOfYears.push({ text: i.toString(), value: i });
  }
  return arrayOfYears;
}
const years = fetchYears();
const columns = [
  {
    align: 'right' as FormLabelAlign,
    title: '№',
    dataIndex: 'number',
    width: 75,
    fixed: true,
    defaultSortOrder: 'ascend' as SortOrder,
    sorter: (a: any, b: any) => a.number - b.number,
  },
  {
    title: 'Перестороги',
    dataIndex: 'precaution',
    filters: [{
      text: "Догана",
      value: "Догана",
    },
    {
      text: "Сувора догана",
      value: "Сувора догана",
    },
    {
      text: "догана із загрозою виключення з Пласту",
      value: "догана із загрозою виключення з Пласту",
    }],
    onFilter: (value: any, record: any) => record.precaution.name.includes(value),
    render: (precaution: Precaution) => {
      return precaution.name
    },
  },
  {
    title: 'Ім\'я',
    dataIndex: 'user',
    render: (user: CityUser) => {
      return user.firstName + " " + user.lastName
    },
    sorter: (a: any, b: any) => a.user.firstName.localeCompare(b.user.firstName),
    sortDirections: ['ascend', 'descend'] as SortOrder[],
  },
  {
    title: 'Дата затвердження',
    dataIndex: 'date',
    filters: years,
    onFilter: (value: any, record: any) => record.date.includes(value),
    render: (date: Date) => {
      return moment(date.toLocaleString()).format('DD.MM.YYYY');
    },
  },
  {
    title: 'Дата завершення',
    dataIndex: 'endDate',
    render: (endDate: Date, record: any) => {
      return record.isActive === true ? moment(endDate.toLocaleString()).format('DD.MM.YYYY') : "не активна";
    },
    sorter: (a: any, b: any) => a.endDate.localeCompare(b.endDate),
    sortDirections: ['ascend', 'descend'] as SortOrder[],
  },
  {
    title: 'Подання від',
    dataIndex: 'reporter',
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
    title: 'Обгрунтування',
    dataIndex: 'reason',
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
    title: 'Статус',
    dataIndex: 'status',
    ellipsis: {
      showTitle: false,
    },
    filters: [{
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
    }],
    onFilter: (value: any, record: any) => record.status.includes(value),
    render: (status: any) => (
      <Tooltip placement="topRight" title={status}>
        {status}
      </Tooltip>
    ),
  },

];
export default columns;
