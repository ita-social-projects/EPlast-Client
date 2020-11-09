import { Tooltip } from 'antd';
import moment from 'moment';
import React from 'react';
import decisionsApi from '../../api/decisionsApi';

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
    title: 'Статус',
    dataIndex: 'decisionStatusType',
  },
  {
    title: 'Рішення для',
    dataIndex: 'decisionTarget',
  },
  {
    title: 'Рішення',
    dataIndex: 'description',
    ellipsis: {
      showTitle: false,
    },
    render: (description: any) => (
      <Tooltip placement="topLeft" title={description}>
        {description}
      </Tooltip>
    ),
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
    render : (fileName : string |null) =>{ 
      if( fileName != null){
        return <button type = "button" onClick = {
          async () =>  {
             await decisionsApi.getFileAsBase64(fileName);}}
             >Скачати додаток</button>;
      }
      return ""; 
  },}
];
export default columns;
