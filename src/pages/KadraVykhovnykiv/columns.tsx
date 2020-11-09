import React from 'react';
import Api from '../../api/KadraVykhovnykivApi';
import CityUser from '../../models/City/CityUser';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import { FormLabelAlign } from 'antd/lib/form/interface';
import { SortOrder } from 'antd/lib/table/interface';

const classes = require('./Table.module.css');

const columns = [
  { 
    align: 'right' as FormLabelAlign,
    width: 75,
    fixed: true,
    title: 'ID',
    dataIndex: 'id',
    defaultSortOrder: 'ascend' as SortOrder,
      sorter: (a: any, b: any) => a.id - b.id,

  },
  {
    title: 'Користувач',
    dataIndex: 'user',
    render: (user: CityUser) => {
      return user.firstName + " " + user.lastName
    },
    sorter: (a: any, b: any) => a.user.firstName.localeCompare(b.user.firstName),
    sortDirections: ['ascend', 'descend'] as SortOrder[],
  },
  {
    title: 'Дата надання',
    dataIndex: 'dateOfGranting',
    render:(dateOfGranting:Date)=>{
        return moment(dateOfGranting).format("DD.MM.YYYY")
    },
    sorter: (a: any, b: any) => a.dateOfGranting.localeCompare(b.dateOfGranting),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
  },
  {
    title: 'Номер в реєстрі',
    dataIndex: 'numberInRegister',
    sorter: (a: any, b: any) => a.numberInRegister - b.numberInRegister,
    sortDirections: ['ascend', 'descend'] as SortOrder[],
  },
  {
    title: 'Причина вручення',
    dataIndex: 'basisOfGranting',
    render:(basisOfGranting:string)=>{
      return <Tooltip placement="topRight" title={basisOfGranting}>
          <div>{basisOfGranting}</div>
    </Tooltip>
  }
    
  },
  {
    title: 'Лінк',
    dataIndex: 'link',
    ellipsis: {
      showTitle: false,
    },
    render:(link:string)=>{
      return <Tooltip placement="topRight" title={link}>
              <a className={classes.link} href={link} target='_blank'>{link}</a>
        </Tooltip>
      
  }
},
    
];
export default columns;
