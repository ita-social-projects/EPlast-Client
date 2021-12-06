import React, { useEffect, useState, PropsWithRef } from 'react';
import { Table, Spin, Input, Layout } from 'antd';
import columns from './columns';
import kadrasApi from "../../api/KadraVykhovnykivApi";
import DropDown from './KadraDropDown';
import ClickAwayListener from 'react-click-away-listener';
import moment from 'moment';
import NotificationBoxApi from '../../api/NotificationBoxApi';


const classes = require('./Table.module.css');

interface props {

  current: number;
  searchData: any;
}

export const KVTable = ({ current, searchData }: props) => {
  const [recordObj, setRecordObj] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);

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
  
  const handleDelete = (id: number) => {
    const filteredData = data.filter((d: { id: number; }) => d.id !== id);
    const DeletedKadra = data.find((d: { id: number; }) => d.id === id);
    setData([...filteredData]);
    DeletedKadra &&
    createNotifications(DeletedKadra.userId);
   
  }

  const onEdit = () => {
    fetchData()
  }

  const handleClickAway = () => {
    setShowDropdown(false);
  }



  const fetchData = async () => {
    setLoading(true);
    
    await kadrasApi.getEducatorsStaffForTable(current, searchData, page, pageSize).then(response => {
      setCount(response[0]?.subtotal);
      setData(response)
    })
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [current, searchData, page, pageSize])

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
          onRow={(record) => {
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
          onChange={(pagination) => {
            if (pagination) {
              window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth',
              });
            }
          }}
          pagination={
            {
              current: page,
                pageSize: pageSize,
                total: count,
                showLessItems: true,
                responsive: true,
                showSizeChanger: true,
                onChange: (page) => handlePageChange(page),
                onShowSizeChange: (page, size) => handleSizeChange(page, size),
            }
          }
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