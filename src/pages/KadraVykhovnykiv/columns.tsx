import React from 'react';
import Api from '../../api/KadraVykhovnykivApi';


const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: 'userId',
    dataIndex: 'userId',
  },
  {
    title: 'kvTypesID',
    dataIndex: 'kvTypesID',
  },
  {
    title: 'dateOfGranting',
    dataIndex: 'dateOfGranting',
  },
  {
    title: 'numberInRegister',
    dataIndex: 'numberInRegister',
  },
  {
    title: 'basisOfGranting',
    dataIndex: 'basisOfGranting',
  },
  {
    title: 'link',
    dataIndex: 'link'
},
    
];
export default columns;
