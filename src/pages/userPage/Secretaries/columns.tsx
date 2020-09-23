import React from 'react';

import CityUser from '../../../models/City/CityUser';




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
    title: 'Тип адміністрування',
    dataIndex: 'adminType',
    render:(adminType:any)=>{
        return adminType.adminTypeName
    }
  },
  {
    title: 'Початок каденції',
    dataIndex: 'startDate',
  },
  {
    title: 'Кінець каденції',
    dataIndex: 'endDate',
  } ,
  {
    title: 'Станиця',
    dataIndex: 'cityId',
  } 
];
export default columns;
