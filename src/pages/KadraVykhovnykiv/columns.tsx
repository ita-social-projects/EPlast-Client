import React from 'react';
import Api from '../../api/KadraVykhovnykivApi';


const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'ID користувача',
    dataIndex: 'userId',
  },
  {
    title: 'Тип кадри',
    dataIndex: 'kvTypesID',
  },
  {
    title: 'Дата надання',
    dataIndex: 'dateOfGranting',
  },
  {
    title: 'Номер в реєстрі',
    dataIndex: 'numberInRegister',
  },
  {
    title: 'Причина вручення',
    dataIndex: 'basisOfGranting',
  },
  {
    title: 'Лінк',
    dataIndex: 'link'
},
    
];
export default columns;
