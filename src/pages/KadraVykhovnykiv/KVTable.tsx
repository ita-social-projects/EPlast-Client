import React, { useEffect, useState, PropsWithRef } from 'react';
import { Table} from 'antd';
import columns from './columns';
import kadrasApi from "../../api/KadraVykhovnykivApi";



interface props{

  current : number;
}

export const KVTable = ({current}:props)=>{
 

const [kadras, setkadras] = useState<any>([{
    id: '',
    userId: '',
    kvTypesID: '',
    dateOfGranting: '',
    numberInRegister: '',
    basisOfGranting: '',
    link: '',
  }])
  
  
  const [updatedKadra, setUpdatedKadra] = useState([{
    id: '',
    userId: '',
    kvTypesID: '',
    dateOfGranting: '',
    numberInRegister: '',
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