import React, { useEffect, useState, PropsWithRef, useRef } from 'react';
import { Table, Spin, Input, Layout } from 'antd';
import columns from './columns';
import kadrasApi from "../../api/KadraVykhovnykivApi";
import DropDown from './KadraDropDown';
import ClickAwayListener from 'react-click-away-listener';
import { KadraTableInfo } from './Interfaces/KadraTableInfo';
import { KadraTableSettings } from './Interfaces/KadraTableSettings';
import NotificationBoxApi from '../../api/NotificationBoxApi';
import { UnderlineOutlined } from '@ant-design/icons';


const classes = require('./Table.module.css');

interface props {

  current: number;
  searchData: any;
}

export const KVTable = ({ current, searchData }: props) => {
  const [recordObj, setRecordObj] = useState<KadraTableInfo>();
  const [showDropdown, setShowDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [data, setData] = useState<KadraTableInfo[]>(Array<KadraTableInfo>());
  const [firstPage, setFirstPage] = useState(1);
  const [sorting] = useState(2);
  const [lastElement, setLastElement] = useState(1);
  //const [sortByOrder, setSortByOrder] = useState<any[]>(["",""]);
  //const [sortColumn, setSortByColumn] = useState<string>("id");
  //const [sortByOrder, setSortByOrder] = useState<string>("descend");
  const [sortByOrder, setSortByOrder] = useState<any[]>(["id","ascend"]);


  const createNotifications = async (userId : string) => {
    await NotificationBoxApi.createNotifications(
        [userId],
        `Ваc було видалено з кадри виховників. `,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/kadra`,
        `Переглянути`
        );

    await NotificationBoxApi.getCitiesForUserAdmins(userId)
        .then(res => {
            res.cityRegionAdmins.length !== 0 &&
            res.cityRegionAdmins.forEach(async (cra) => {
                await NotificationBoxApi.createNotifications(
                    [cra.cityAdminId, cra.regionAdminId],
                    `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' був видалений з кадри виховників. `,
                    NotificationBoxApi.NotificationTypes.UserNotifications,
                    `/kadra`,
                    `Переглянути`
                    );
            })                
        });
 } 
  
 const handleDelete = () => {
  if(page != firstPage && data.length == lastElement)
    setPage(page-1);
  else
    fetchData();
}

  const onEdit = () => {
    fetchData()
  }

  const handleClickAway = () => {
    setShowDropdown(false);
  }

  const tableSettings = (res: any) => {
    console.log(res);
    setPage(res[0].current);
    setPageSize(res[0].pageSize);
    if(res[sorting].order !== undefined){
      setSortByOrder([res[sorting].field, res[sorting].order]);
     // fetchData([res[sorting].field, null])
     // setSortByColumn(res[sorting].field)
     // setSortByOrder([res[sorting].field, null]);
     // console.log(res);
    } 
    console.log(1);
  }
  const fetchData = async () => {
    console.log('fetch');
    setLoading(true);
   console.log(sortByOrder);
    const newTableSettings : KadraTableSettings ={
      SearchedData: searchData,
      Page: page,
      PageSize: pageSize,
      KadraTypeId:current,
      SortByOrder:sortByOrder,
    }
    console.log(newTableSettings);
    await kadrasApi.getEducatorsStaffForTable(newTableSettings).then(response => {
      setCount(response[0]?.total);
      setData(response)
    })
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    if(current){
      fetchData();
    }
  }, [current, searchData, page, pageSize, sortByOrder])

 const handlePageChange = (page: number) => {
  setPage(page);
};

const handleSizeChange = (page: number, pageSize: number = 10) => {
  setPage(page);
  setPageSize(pageSize);
};


  return (
    <div className={classes.textCenter}>
      {!isLoading ?
      <Layout.Content onClick={() => { setShowDropdown(false); }}>
        <Table
          className={classes.table}
          columns={columns}
          dataSource={data}
          scroll={{ x: 1300 }}
          onRow={(record : KadraTableInfo) => {
            return {
              onClick: () => {
                setShowDropdown(false);
              },
              onContextMenu: (event) => {
                event.preventDefault();
                setShowDropdown(true);
                setRecordObj(record);
                setX(event.pageX);
                setY(event.pageY-200);
              },
            };
          }}
          // onChange={(pagination) => {
          //   if (pagination) {
          //     window.scrollTo({
          //       left: 0,
          //       top: 0,
          //       behavior: 'smooth',
          //     });
          //   }
          // }}
          
          
          pagination={
            {
              current: page,
                pageSize: pageSize,
                total: count,
                showLessItems: true,
                responsive: true,
                showSizeChanger: true,
                // onChange: (page) => handlePageChange(page),
                // onShowSizeChange: (page, size) => handleSizeChange(page, size),
            }
          }
          onChange={ (...args)=>tableSettings(args)}
          bordered
          rowKey="id"
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
      </Layout.Content> :  <Spin/>
}
    </div> 
  )
}