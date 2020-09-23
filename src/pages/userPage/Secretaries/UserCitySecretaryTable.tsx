import React, { useEffect, useState, PropsWithRef } from 'react';
import { Table, Spin, Input } from 'antd';
import columns from './columns';
import { getUsersAdministrations } from "../../../api/citiesApi";

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
    cityId:''
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