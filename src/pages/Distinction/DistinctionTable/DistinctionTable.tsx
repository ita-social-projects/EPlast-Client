import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Layout } from 'antd';
import columns from './columns';
import notificationLogic from '../../../components/Notifications/Notification';
import UserDistinction from '../Interfaces/UserDistinction';
import DropDownDistinctionTable from './DropDownDistinctionTable';
import distinctionApi from '../../../api/distinctionApi';
import AddDistinctionModal from '../DistinctionTable/AddDistinctionModal';
import EditDistinctionTypesModal from './EditDistinctionTypesModal';
import ClickAwayListener from 'react-click-away-listener';
import User from '../../../models/UserTable/User';
import Distinction from '../Interfaces/Distinction';
import Spinner from '../../Spinner/Spinner';
import AuthStore from '../../../stores/AuthStore';
import jwt from 'jwt-decode';



const { Content } = Layout;
const DistinctionTable = () => {
  const classes = require('./Table.module.css');
  let user: any;
  let curToken = AuthStore.getToken() as string;
  user = jwt(curToken);
  let roles = user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string[];
  const [recordObj, setRecordObj] = useState<any>(0);
  const [userId, setUserId] = useState<any>(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalEditDist, setVisibleModalEditDist] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState('');
  const [canEdit, setCanEdit] = useState(roles.includes("Admin"));
  const [UserDistinctions, setData] = useState<UserDistinction[]>([{
      id: 0,
      distinction: 
      {
        id: 0,
        name: ''
      },
        distinctionId: 0,
        userId: '',
        reporter: '',
        reason: '',
        date: new Date(),
        user: new User()
    }]);

    useEffect(() => {
      const fetchData = async () => {
        const res: UserDistinction[] = await distinctionApi.getUserDistinctions();
        setData(res);
        setLoading(true);
      };
      fetchData();
    }, []);

    let filteredData = searchedData 
    ? UserDistinctions.filter((item: any) => {
      return Object.values(item).find((element) => {
        return String(element).toLowerCase().includes(searchedData)
      });
    })
    : UserDistinctions;

  filteredData = filteredData.concat(
    UserDistinctions.filter((item) => (item.user.firstName.toLowerCase()?.includes(searchedData)||
    item.user.lastName.toLowerCase()?.includes(searchedData)) && !filteredData.includes(item)
    )
  )
  filteredData = filteredData.concat(
    UserDistinctions.filter((item) => item.distinction.name.toLowerCase()?.includes(searchedData) && !filteredData.includes(item)
    )
  )
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedData(event.target.value.toLowerCase());
    setLoading(true);
  };

    const showModal = () => {
    
      setVisibleModal(true);
    };

    const handleAdd = async() => {
      setVisibleModal(false);
      setLoading(false);
      const res: UserDistinction[] = await distinctionApi.getUserDistinctions();
      setData(res);
      notificationLogic('success', "Відзначення успішно додано!");
      setLoading(true);

    };

    const showModalEditTypes = () => {
      setVisibleModalEditDist(true);
    }


    const handleClickAway=()=>{
      setShowDropdown(false);
    }

    const handleDelete = (id: number) => {
      const filteredData = UserDistinctions.filter((d: { id: number; }) => d.id !== id);
      setData([...filteredData]);
      notificationLogic('success', "Відзначення успішно видалено!");
    }
    const handleEdit = (id: number, 
      distinction: Distinction, 
      date: Date, 
      reason: string, 
      reporter: string, 
      user: any, 
      userId: string) => {
      /* eslint no-param-reassign: "error" */
      const filteredData = UserDistinctions.filter(d => {
        if (d.id === id) {
          d.distinction = distinction;
          d.distinctionId = distinction.id;
          d.date = date;
          d.reason = reason;
          d.reporter = reporter;
          d.user = user;
          d.userId = userId;
        }
        return d;
      }
      );
      setData([...filteredData]);
      notificationLogic('success', "Відзначення успішно змінено!");
    }
return loading === false ? (
    <Spinner/>
  ) : (
    <Layout>
      <Content onClick={() => { setShowDropdown(false) }} >
        <h1 className={classes.titleTable}>Відзначення</h1>
        
          <>
            <div className={classes.searchContainer}>
              {canEdit === true ? (
                <>
                  <Button type="primary" onClick = {showModal}>
                    Додати відзначення
                  </Button>
                  <Button type="primary" onClick = {showModalEditTypes}>
                    Редагування типів відзначень
                  </Button>
                  <span/>
                </>
              ): (<></> )}
              <Input placeholder="Пошук" onChange={handleSearch} />
              
            </div>
            <div>
            <Table
              className={classes.table}
              dataSource={filteredData}
              columns={columns} 
              onRow={(record) => {
                return {
                    onClick: () => {
                        setShowDropdown(false);
                    },
                    onContextMenu: (event) => {
                        event.preventDefault();
                        setShowDropdown(true);
                        setRecordObj(record.id);
                        setUserId(record.userId);
                        setX(event.pageX);
                        setY(event.pageY);
                    },
                };
            }}
              bordered
              rowKey="id"
            />
            </div>
            <ClickAwayListener onClickAway={handleClickAway}>
                  <DropDownDistinctionTable
                    showDropdown={showDropdown}
                    record={recordObj}
                    userId={userId}
                    pageX={x}
                    pageY={y}
                    canEdit={canEdit}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
                </ClickAwayListener>

                <AddDistinctionModal 
                  setVisibleModal={setVisibleModal}
                  visibleModal={visibleModal}
                  onAdd={handleAdd}
              />
              <EditDistinctionTypesModal 
              setVisibleModal = {setVisibleModalEditDist}
              visibleModal = {visibleModalEditDist}/>
          </>
      </Content>

    </Layout>
  );
}
export default DistinctionTable;
