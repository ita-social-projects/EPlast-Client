import React, { useEffect, useState, PropsWithRef } from 'react';
import { Table, Spin} from 'antd';
import columns from './columns';
import kadrasApi from "../../api/KadraVykhovnykivApi";
import DropDown from './KadraDropDown';
import { findAllByDisplayValue } from '@testing-library/react';



interface props{

  current : number;
}

export const KVTable = ({current}:props)=>{
  const [recordObj, setRecordObj] = useState<any>(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [loading, setLoading] = useState(false);


const [kadras, setkadras] = useState<any>([{
    id: '',
    user: '',
    kvType: '',
    dateOfGranting: '',
    numberInRegister: '',
    basisOfGranting: '',
    link: '',
  }])
  
  


const handleDelete = (id: number) => {
  const filteredData = kadras.filter((d: { id: number; }) => d.id !== id);
  setkadras([...filteredData]);
}



const onEdit = () => {
 fetchData()
}


const fetchData = async () => {
  setLoading(true);
  await kadrasApi.getAllKVswithGivenTypes(current).then(response => {
      setkadras(response.data);
  })
  setLoading(false);
}

  useEffect(() => {
    fetchData();
  }, [])

    return(
      <div>

<Table
loading={loading}
columns={columns}
dataSource={kadras}
onRow={(record) => {
  return {
      onClick: () => {
          setShowDropdown(false);
      },
      onContextMenu: (event) => {
          event.preventDefault();
          setShowDropdown(true);
          setRecordObj(record.id);
          setX(event.pageX);
          setY(event.pageY-250);
      },
  };
}}
/>
<DropDown
showDropdown={showDropdown}
record={recordObj}
onDelete={handleDelete}
setShowDropdown={setShowDropdown}
pageX={x}
pageY={y}
onEdit={onEdit}
/>  
</div>


    )
    }