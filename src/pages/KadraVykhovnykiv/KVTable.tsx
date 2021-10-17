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
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<any[]>([{
    id: '',
    user: '',
    dateOfGranting: '',
    numberInRegister: '',
  }]);

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
    await kadrasApi.getAllKVswithGivenTypes(current).then(response => {

      setData(response.data);
    })
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [])


  let filteredData = searchData
  ? data.filter((item) => {
      return Object.values([
        item.numberInRegister,
        moment.utc(item.dateOfGranting.toLocaleString()).local().format("DD.MM.YYYY"),
      ]).find((element) => {
        return String(element).toLowerCase().includes(searchData);
      });
    })
  : data;


  filteredData = filteredData.concat(
    data.filter(
      (item) =>
        ( item.user.firstName?.toLowerCase()?.includes(searchData.toLowerCase()) ||
          item.user.lastName?.toLowerCase()?.includes(searchData.toLowerCase())||
          (item.user.firstName + ' ' + item.user.lastName)?.toLowerCase()?.includes(searchData.toLowerCase())||
          (item.user.lastName + ' ' + item.user.firstName)?.toLowerCase()?.includes(searchData.toLowerCase())) &&
        !filteredData.includes(item)
    )
  );



  return (
    <div>
      <Layout.Content onClick={() => { setShowDropdown(false); }}>
        <Table
          className={classes.table}
          loading={loading}
          columns={columns}
          dataSource={filteredData}
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
          pagination={
            {
              showLessItems: true,
              responsive:true,
              showSizeChanger: true,
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
      </Layout.Content>
    </div>


  )
}