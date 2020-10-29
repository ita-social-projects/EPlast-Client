import React from 'react';
import Api from '../../api/KadraVykhovnykivApi';
import CityUser from '../../models/City/CityUser';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import { FormLabelAlign } from 'antd/lib/form/interface';

const classes = require('./Table.module.css');

const columns = [
  { 
    align: 'right' as FormLabelAlign,
    width: 75,
    fixed: true,
    title: 'ID',
    dataIndex: 'id',
    render: (id: number) => {
      return <div className={classes.IDcolumn}>{id}</div>
  }
  },
  {
    title: 'Користувач',
    dataIndex: 'user',
    render: (user: CityUser) => {
      return <div className={classes.Namecolumn}>{user.firstName + " " + user.lastName}</div>
  }
  },
  {
    title: 'Дата надання',
    dataIndex: 'dateOfGranting',
    render:(dateOfGranting:Date)=>{
        return moment(dateOfGranting).format("DD-MM-YYYY")
    }
  },
  {
    title: 'Номер в реєстрі',
    dataIndex: 'numberInRegister',
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
