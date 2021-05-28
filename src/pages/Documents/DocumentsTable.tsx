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
const classes = require('./Table.module.css');

const { Content } = Layout;

const DocumentsTable = () => {
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recordObj, setRecordObj] = useState<any>(0);
  const [data, setData] = useState<Document[]>(Array<Document>());
  const [viewedData, setViewedData] = useState<Document[]>(Array<Document>());
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [searchedData, setSearchedData] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
  const [userRole, setUser] = useState<string[]>();
  const [canEdit, setCanEdit] = useState(false);
  const [regionAdm, setRegionAdm] = useState(false);
  const [cityAdm, setCityAdm] = useState(false);
  const [clubAdm, setClubAdm] = useState(false);
  const [noTitleKey, setKey] = useState<string>('tab1');

  const handleDelete = (id: number) => {
    const filteredData = data.filter(d => d.id !== id);
    setData([...filteredData]);
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
      const dec: Document = {
        id: res.id,
        name: res.name,
        governingBody: res.governingBody.governingBodyName,
        type: TypeGetParser(res.type),
        description: res.description,
        fileName: res.fileName,
        date: res.date
      };
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
      const res: Document[] = await documentsApi.getAll();
      setData(res);
      setLoading(false);
      setUser(roles);
      setCanEdit(roles.includes("Admin"));
      setRegionAdm(roles.includes("Голова Округи"));
      setCityAdm(roles.includes("Голова Станиці"));
      setClubAdm(roles.includes("Голова Куреня"));
    };
    fetchData();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedData(event.target.value.toLowerCase());
    setViewedData(searchedData
      ? viewedData.filter((item) => {
        return Object.values([
          item.name,
          item.governingBody,
          item.id,
          item.description,
          moment(item.date.toLocaleString()).format("DD.MM.YYYY"),
        ]).find((element) => {
          return String(element).toLowerCase().includes(searchedData);
        });
      })
      : viewedData)
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  }

  const showModal = () => setVisibleModal(true);


  const tabList = [
    {
      key: 'tab1',
      tab: 'Нормативні акти',
    },
    {
      key: 'tab2',
      tab: 'Методичні документи',
    },
    {
      key: 'tab3',
      tab: 'Різне',
    },
  ];

  const onTabChange = (key: string) => {
    setKey(key);
    setViewedData(key == 'tab1' ? data.filter(x => x.type == "Нормативний акт") : key == 'tab2' ? data.filter(x => x.type == "Методичний документ") : data.filter(x => x.type == "Інше"));
  };

  useEffect(() => { onTabChange('tab1') }, [data])


  return !loading ? (
    <Layout>
      <Content
        onClick={() => {
          setShowDropdown(false);
        }}
      >
        <h1 className={classes.titleTable}>Документація</h1>
        <>
          <div className={classes.searchContainer}>
            {(canEdit == true || regionAdm == true || cityAdm == true || clubAdm == true) ? (
              <Button type="primary" onClick={showModal}>
                Додати документ
              </Button>
            ) : (<> </>)
            }
            <Input placeholder="Пошук" onChange={handleSearch} allowClear />
          </div>

          <Card
            style={{ width: '100%' }}
            tabList={tabList}
            activeTabKey={noTitleKey}
            onTabChange={(key) => {
              onTabChange(key);
            }}
          >
            <Table
              className={classes.table}
              dataSource={viewedData}
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
                  showLessItems: true,
                  responsive: true,
                  showSizeChanger: true,
                }
              }
            />
          </Card>
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
  ) : (
      <Spinner />
    );
};

export default DocumentsTable;


