import React, { useEffect, useState, PropsWithRef } from 'react';
import { Table, Spin, Input } from 'antd';
import columns from './columnsregions';
import { getUsersAdministrations, getUsersPreviousAdministrations } from "../../../api/regionsApi";


interface props {

  UserId: string;
}

export const UserRegionSecretaryTable = ({ UserId }: props) => {


  const [data, setData] = useState<any>([{
    id: '',
    user: {
      firstName: '',
      lastName: ''
    },
    adminType: {
      adminTypeName: ''
    },
    startDate: '',
    endDate: '',
    region: {
      regionName: ''
    }
  }]);



  const [prevdata, setPrevData] = useState<any>([{
    id: '',
    user: {
      firstName: '',
      lastName: ''
    },
    adminType: {
      adminTypeName: ''
    },
    startDate: '',
    endDate: '',
    region: {
      regionName: ''
    }
  }]);



  const fetchData = async () => {

    await getUsersAdministrations(UserId).then(response => {

      setData(response.data);
    })

    await getUsersPreviousAdministrations(UserId).then(resp => {
      setPrevData(resp.data)
    })

  }

  useEffect(() => {
    fetchData();
  }, [])



  return (
    <div>
      <h1>Дійсні діловодства округу</h1>
      <br/>
      <Table
      
        columns={columns}
        dataSource={data}
      />
      <h1>Колишні діловодства округу</h1>
      <br/>
      <Table
        columns={columns}
        dataSource={prevdata}
      />
    </div>

  )
}