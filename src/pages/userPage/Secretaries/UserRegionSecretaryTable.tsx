import React, { useEffect, useState, PropsWithRef } from 'react';
import { Table, Spin, Input } from 'antd';
import columns from './columnsregions';
import { getUsersAdministrations } from "../../../api/regionsApi";


interface props {

  UserId: string;
}

export const UserRegionSecretaryTable = ({  UserId }: props) => {


  const [data, setData] = useState<any>([{
    id: '',
    user: {
        firstName:'',
        lastName:''
    },
    adminType: {
        adminTypeName:''
    },
    startDate: '',
    endDate: '',
    region:{
        regionName:''
    }
  }]);




  const fetchData = async () => {

    await getUsersAdministrations(UserId).then(response => {

      setData(response.data);
    })
  }

  useEffect(() => {
    fetchData();
  }, [])



  return (
    <div>

      <Table
        columns={columns}
        dataSource={data}
      />
    </div>


  )
}