import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Layout, Pagination, Card } from 'antd';
import columns from './columns';
import DropDown from './DropDownDocuments';
import documentsApi, { TypeGetParser } from '../../api/documentsApi';
import { Document } from "../../models/Documents/Document";
import notificationLogic from '../../components/Notifications/Notification';
import ClickAwayListener from 'react-click-away-listener';
import moment from "moment";
import Spinner from '../Spinner/Spinner';
import AuthStore from '../../stores/AuthStore';
import jwt_decode from "jwt-decode";
import AddDocumentsModal from './AddDocumetsModal';
import { Roles } from '../../models/Roles/Roles';
import DocumentsTableInfo from '../../models/Documents/DocumentsTableInfo';
import Search from 'antd/lib/input/Search';
const classes = require('./Table.module.css');

const { Content } = Layout;

const DocumentsTable = () => {
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recordObj, setRecordObj] = useState<any>(0);
  const [data, setData] = useState<DocumentsTableInfo[]>(Array<DocumentsTableInfo>());
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [searchedData, setSearchedData] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
  const [userRole, setUser] = useState<string[]>();
  const [viewData, setViewData] = useState<DocumentsTableInfo[]>(Array<DocumentsTableInfo>());
  const [canEdit, setCanEdit] = useState(false);
  const [regionAdm, setRegionAdm] = useState(false);
  const [cityAdm, setCityAdm] = useState(false);
  const [clubAdm, setClubAdm] = useState(false);
  const [supporter, setSupporter] = useState(false);
  const [plastMember, setPlastMember] = useState(false);
  
  const [noTitleKey, setKey] = useState<string>('tab1');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [status, setStatus] = useState<string>('legislation');
  

  const handleDelete = (id: number) => {
    const filteredData = data.filter(d => d.id !== id);
    setData([...filteredData]);
    setTotal(total-1);
    setCount(count-1);
  }

  const handleEdit = (id: number, name: string, description: string) => {
    /* eslint no-param-reassign: "error" */
    const filteredData = data.filter(d => {
      if (d.id === id) {
        d.name = name;
        d.description = description;
      }
      return d;
    }
    );
    setData([...filteredData]);
  }

  const handleAdd = async () => {
    const lastId = data[data.length - 1].id;
    await documentsApi.getById(lastId + 1).then(res => {
      const dec: DocumentsTableInfo = {
        id: res.id,
        name: res.name,
        governingBody: res.governingBody.governingBodyName,
        type: TypeGetParser(res.type),
        description: res.description,
        fileName: res.fileName,
        date: res.date,
        total: total + 1,
        count: count + 1
      };
      setTotal(total + 1);
      setCount(count + 1);
      setData([...data, dec]);
    })
      .catch(() => {
        notificationLogic('error', "Документу не існує");
      });  
  }


  useEffect(() => {
    const fetchData = async () => {
      let jwt = AuthStore.getToken() as string;
      let decodedJwt = jwt_decode(jwt) as any;
      let roles = decodedJwt['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string[];
      setLoading(true);
      const res: DocumentsTableInfo[] = await documentsApi.getAllDocuments(searchedData, page, pageSize, status);
      setTotal(res[0]?.total);
      setCount(res[0]?.count);
      setData(res);
      setLoading(false);
      setUser(roles);
      setCanEdit(roles.includes(Roles.Admin));
      setRegionAdm(roles.includes(Roles.OkrugaHead));
      setCityAdm(roles.includes(Roles.CityHead));
      setClubAdm(roles.includes(Roles.KurinHead));
      setSupporter(roles.includes(Roles.Supporter));
      setPlastMember(roles.includes(Roles.PlastMember));
    };
    fetchData();
  }, [searchedData, page, pageSize, status]);


  const handleSearch = (event: any) => {
    
    setPage(1);
    setSearchedData(event);
    setData(data);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    if(event.target.value.toLowerCase()==='') setSearchedData('');
    setData(data);
  }
  
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleSizeChange = (page: number, pageSize: number = 10) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  }

  const showModal = () => setVisibleModal(true);


  const tabList = [
    {
      key: 'legislation',
      tab: 'Нормативні акти',
    },
    {
      key: 'Methodics',
      tab: 'Методичні документи',
    },
    {
      key: 'Other',
      tab: 'Різне',
    },
  ];

  const onTabChange = (key: string) => {
    setKey(key);
    setPageSize(pageSize);
    setStatus(key);
  };


  return (
    <Layout>
      <Content
        onClick={() => {
          setShowDropdown(false);
        }}
      >
        <h1 className={classes.titleTable}>Документація</h1>
        <>
          <div className={classes.searchContainer}>
            {(canEdit == true || regionAdm == true || cityAdm == true || clubAdm == true || supporter == true) ? (
              <Button type="primary" onClick={showModal}>
                Додати документ 
              </Button>
            ) : (<> </>)
            }
            {(canEdit == true || regionAdm == true || cityAdm == true || clubAdm == true || supporter == true || plastMember == true) ? (
             <Search
                enterButton
                placeholder="Пошук"
                allowClear
                onChange={handleSearchChange}
                onSearch={handleSearch}                
               />
            ) : (<> </>)
            }
            </div>

          {(canEdit == true || regionAdm == true || cityAdm == true || clubAdm == true || supporter == true || plastMember == true) ? (
          <Card
            style={{ width: '100%' }}
            tabList={tabList}
            activeTabKey={status}
            onTabChange={(key) => {
            onTabChange(key);
            }} 
          /> ) : (
          <Card
              style={{ width: '100%' }}
              activeTabKey={status}
          />)
            }
            {loading ? (<Spinner />) : (
            <Table
              className={classes.table}
              dataSource={data}
              scroll={{ x: 1300 }}
              columns={columns}
              bordered
              rowKey="id"
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
                    setY(event.pageY);
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
            />
            )}

          <ClickAwayListener onClickAway={handleClickAway}>
            <DropDown
              showDropdown={showDropdown}
              record={recordObj}
              pageX={x}
              pageY={y}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </ClickAwayListener>
          <AddDocumentsModal
            setVisibleModal={setVisibleModal}
            visibleModal={visibleModal}
            onAdd={handleAdd}
          />
        </>
      </Content>
    </Layout>  
  )};

export default DocumentsTable;
