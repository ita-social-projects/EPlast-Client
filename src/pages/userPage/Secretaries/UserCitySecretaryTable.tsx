import React, { useEffect, useState, PropsWithRef } from 'react';
import { Table, Spin, Input } from 'antd';
import columns from './columnsCIties';
import { getUsersAdministrations, getusersPreviousAdministrations } from "../../../api/citiesApi";

import ClickAwayListener from 'react-click-away-listener';



interface props {

  UserId: string;
}

export const UserCitySecretaryTable = ({  UserId }: props) => {


  const [data, setData] = useState<any>([{
    id: '',
    user: '',
    adminType: '',
    startDate: '',
    endDate: '',
    city: {
      id: '',
      name: ''
    }
  }]);


  const [prevData, setPrevData] = useState<any>([{
    id: '',
    user: '',
    adminType: '',
    startDate: '',
    endDate: '',
    city: {
      id: '',
      name: ''
    }
  }]);



  const fetchData = async () => {

    await getUsersAdministrations(UserId).then(response => {

      setData(response.data);
    })


    await getusersPreviousAdministrations(UserId).then(response => {

      setPrevData(response.data);
    })
  }

  useEffect(() => {
    fetchData();
  }, [])



  return (
    <div>
 <h1>Дійсні діловодства станиці</h1>
 <br/>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 655 }}
      />
    
    <h1>Колишні діловодства станиці</h1>
 <br/>
      <Table
        columns={columns}
        dataSource={prevData}
        scroll={{ x: 655 }}
      />
</div>
  )
}