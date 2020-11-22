import React, { useEffect, useState, PropsWithRef } from 'react';
import { Table, Spin, Input } from 'antd';
import columns from './columnsClubs';
import { getUsersAdministrations, getUsersPreviousAdministrations } from "../../../api/clubsApi";


interface props {

  UserId: string;
}

export const UserClubSecretaryTable = ({  UserId }: props) => {


  const [data, setData] = useState<any>([{
    id: '',
    user: '',
    adminType: '',
    startDate: '',
    endDate: '',
    club: {
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
    club: {
      id: '',
      name: ''
    }
  }]);



  const fetchData = async () => {

    await getUsersAdministrations(UserId).then(response => {

      setData(response.data);
    })


    await getUsersPreviousAdministrations(UserId).then(response => {

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