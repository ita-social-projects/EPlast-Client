import React from 'react';
import Api from '../../api/KadraVykhovnykivApi';
import CityUser from '../../models/City/CityUser';
import moment from 'moment';
import { Link } from 'react-router-dom';


const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Користувач',
    dataIndex: 'user',
    render: (user: CityUser) => {
      return user.firstName + " " + user.lastName
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
  },
  {
    title: 'Лінк',
    dataIndex: 'link',
    render:(link:string)=>{
      return <a href={link} target='_blank' >{link}</a>
  }
},
    
];
export default columns;
