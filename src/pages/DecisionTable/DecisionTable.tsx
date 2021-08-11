import React, { useEffect, useState } from 'react';
import { Table, Button, Layout, Pagination } from 'antd';
import columns from './columns';
import DropDown from './DropDownDecision';
import AddDecisionModal from './AddDecisionModal';
import decisionsApi, { Decision, statusTypeGetParser } from '../../api/decisionsApi';
import ClickAwayListener from 'react-click-away-listener';
import Spinner from '../Spinner/Spinner';
import AuthStore from '../../stores/AuthStore';
import jwt_decode from "jwt-decode";
import Search from 'antd/lib/input/Search';
import { DecisionTableInfo } from './Interfaces/DecisionTableInfo';
import { Roles } from '../../models/Roles/Roles';
import classes from './Table.module.css';

const { Content } = Layout;

const DecisionTable = () => {
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recordObj, setRecordObj] = useState<any>(0);
  const [recordCreator, setRecordCreator] = useState<string>("");
  const [data, setData] = useState<DecisionTableInfo[]>(Array<DecisionTableInfo>());
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [searchedData, setSearchedData] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
  const [userRole, setUser] = useState<string[]>();
  const [canEdit, setCanEdit] = useState(false);
  const [regionAdm, setRegionAdm] = useState(false);
  const [regionAdmDeputy, setRegionAdmDeputy] = useState(false);
  const [cityAdm, setCityAdm] = useState(false);
  const [cityAdmDeputy, setCityAdmDeputy] = useState(false);
  const [clubAdm, setClubAdm] = useState(false);
  const [clubAdmDeputy, setClubAdmDeputy] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  
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
    let user: any;
    let curToken = AuthStore.getToken() as string;
    user = jwt_decode(curToken);
    await decisionsApi.getById(lastId + 1).then(res => {
      const dec: DecisionTableInfo = {
        id: res.id,
        name: res.name,
        governingBody: res.governingBody.governingBodyName,
        decisionStatusType: statusTypeGetParser(res.decisionStatusType),
        decisionTarget: res.decisionTarget.targetName,
        description: res.description,
        fileName: res.fileName,
        userId: user.nameid,
        date: res.date,
        total: total + 1,
        count: count + 1
      };
      setTotal(total + 1);
      setCount(count + 1);
      setData([...data, dec]);
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      let jwt = AuthStore.getToken() as string;
      let decodedJwt = jwt_decode(jwt) as any;
      let roles = decodedJwt['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string[];
      setLoading(true);
      const res: DecisionTableInfo[] = await decisionsApi.getAllDecisionsForTable(searchedData, page, pageSize);
      setTotal(res[0]?.total);
      setCount(res[0]?.count);
      setData(res);
      setLoading(false);
      setUser(roles);
      setCanEdit(roles.includes(Roles.Admin));
      setRegionAdm(roles.includes(Roles.OkrugaHead));
      setRegionAdmDeputy(roles.includes(Roles.OkrugaHeadDeputy));
      setCityAdm(roles.includes(Roles.CityHead));
      setCityAdmDeputy(roles.includes(Roles.CityHeadDeputy));
      setClubAdm(roles.includes(Roles.KurinHead));
      setClubAdmDeputy(roles.includes(Roles.KurinHeadDeputy));
    };
    fetchData();
  }, [searchedData, page, pageSize]);

  const handleSearch = (event: any) => {
    setPage(1);
    setSearchedData(event);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.value.toLowerCase()==='') setSearchedData('');
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

  return (
    <Layout>
      <Content
        onClick={() => {
            setShowDropdown(false);
          }}
      >
        <h1 className={classes.titleTable}>Рішення керівних органів</h1>
        <>
          <div className={classes.searchContainer}>
            {(canEdit == true || regionAdm == true || regionAdmDeputy == true || cityAdm == true || 
            cityAdmDeputy == true || clubAdm == true || clubAdmDeputy == true ) ? (
              <Button type="primary" onClick={showModal}>
                Додати рішення
              </Button>
            ) : (<> </>)
            }
            <Search
                enterButton
                placeholder="Пошук"
                allowClear
                onChange={handleSearchChange}
                onSearch={handleSearch}                
               />
          </div>
          {loading ? (<Spinner />) : (<Table
            className={classes.table}
            dataSource={data}
            scroll={{ x: 1300 }}
            columns={columns}
            bordered
            rowKey="id"


            onRow={(record : Decision) => {
              return {
                onClick: () => {
                  setShowDropdown(false);
                },
                onContextMenu: (event) => {
                  event.preventDefault();
                  setShowDropdown(true);
                  setRecordCreator(record.userId);
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
          />)}
          <ClickAwayListener onClickAway={handleClickAway}>
            <DropDown
              showDropdown={showDropdown}
              record={recordObj}
              recordCreatorId={recordCreator}
              pageX={x}
              pageY={y}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </ClickAwayListener>
          <AddDecisionModal
            setVisibleModal={setVisibleModal}
            visibleModal={visibleModal}
            onAdd={handleAdd}
          />
        </>
      </Content>
    </Layout>
  )
};

export default DecisionTable;
