import classes from '*.module.css';
import { Tooltip } from 'antd';
import moment from 'moment';
import React from 'react';
import documentsApi from '../../api/documentsApi';
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    fixed: true,
    width: 60
  },
  {
    title: 'Назва',
    dataIndex: 'name',
  },
  {
    title: 'Керівний орган',
    dataIndex: 'organization',
  },
  {
    title: 'Короткий зміст',
    dataIndex: 'description',
  },
  {
    title: 'Дата',
    dataIndex: 'date',
    render: (date: Date) => {
      return moment(date.toLocaleString()).format('DD.MM.YYYY');
    },
  },
  {
    title: 'Додатки',
    dataIndex: 'fileName',
    render: (fileName: string | null) => {
      if (fileName != null) {
        return <button type="button" onClick={
          async () => {
            await documentsApi.getFileAsBase64(fileName);
          }}
        >Завантажити додаток</button>;
      }
      return "";
    },
  }
];
export default columns;
