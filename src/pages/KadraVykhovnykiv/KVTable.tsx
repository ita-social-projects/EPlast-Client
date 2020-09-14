import React, { useEffect, useState, PropsWithRef } from 'react';
import { Table, Spin, Input } from 'antd';
import columns from './columns';
import kadrasApi from "../../api/KadraVykhovnykivApi";
import DropDown from './KadraDropDown';
import ClickAwayListener from 'react-click-away-listener';


const classes = require('./Table.module.css');

interface props {

  current: number;
  searchData: any;
}

export const KVTable = ({ current, searchData }: props) => {
  const [recordObj, setRecordObj] = useState<any>(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<any[]>([{
    id: '',
    user: '',
    kvType: '',
    dateOfGranting: '',
    numberInRegister: '',
    basisOfGranting: '',
    link: '',
  }]);


  const handleDelete = (id: number) => {
    const filteredData = data.filter((d: { id: number; }) => d.id !== id);
    setData([...filteredData]);
  }



  const onEdit = () => {
    fetchData()
  }

  const handleClickAway = () => {
    setShowDropdown(false);
  }



  const fetchData = async () => {
    setLoading(true);
    await kadrasApi.getAllKVswithGivenTypes(current).then(response => {

      setData(response.data);
    })
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [])



  let filteredData = searchData
    ? data.filter((item: any) => {
      return Object.values(item).find((element) => {
        return String(element).includes(searchData)
      });
    })
    : data;

debugger
  filteredData = filteredData.concat(
    data.filter((item) => (item.user.firstName?.includes(searchData)||
    item.user.lastName?.includes(searchData)) && !filteredData.includes(item)
    )
  )


  return (
    <div>

      <Table
        className={classes.table}
        loading={loading}
        columns={columns}
        dataSource={filteredData}
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
              setY(event.pageY - 250);
            },
          };
        }}
      />
      <ClickAwayListener onClickAway={handleClickAway}>
        <DropDown
          showDropdown={showDropdown}
          record={recordObj}
          onDelete={handleDelete}
          setShowDropdown={setShowDropdown}
          pageX={x}
          pageY={y}
          onEdit={onEdit}
        />
      </ClickAwayListener>
    </div>


  )
}