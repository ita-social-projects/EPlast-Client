import React, { useEffect, useState, PropsWithRef } from 'react';
import { Table} from 'antd';
import columns from './columns';
import kadrasApi from "../../api/KadraVykhovnykivApi";



interface props{

  current : number;
}

export const KVTable = ({current}:props)=>{
 

const [kadras, setkadras] = useState<any>([{
    id: 0,
    userId: '',
    kvTypesID: 0,
    dateOfGranting: '',
    numberInRegister: 0,
    basisOfGranting: '',
    link: '',
  }])
  
  
  const [updatedKadra, setUpdatedKadra] = useState([{
    id: 0,
    userId: '',
    kvTypesID: 0,
    dateOfGranting: '',
    numberInRegister: 0,
    basisOfGranting: '',
    link: '',
}]);


  useEffect(() => {
    const fetchData = async () => {
        await kadrasApi.getAllKVswithGivenTypes(current).then(response => {
            setkadras(response.data);
        })
        
    }
    fetchData();
  }, [])

    return(

<Table
columns={columns}
dataSource={kadras}
/>


    )
    }