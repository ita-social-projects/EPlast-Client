import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Layout } from 'antd';
import columns from './columns';
import DropDown from './DropDownDecision';
import AddDecisionModal from './AddDecisionModal';
import decisionsApi, { Decision, statusTypeGetParser } from '../../api/decisionsApi';
import notificationLogic from '../../components/Notifications/Notification';
import ClickAwayListener from 'react-click-away-listener';
const classes = require('./Table.module.css');

const { Content } = Layout;

const DecisionTable = () => {
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recordObj, setRecordObj] = useState<any>(0);
  const [data, setData] = useState<Decision[]>(Array<Decision>());
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [searchedData, setSearchedData] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
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
  const handleAdd =async () => {
    const lastId = data[data.length - 1].id;
    await decisionsApi.getById(lastId+1).then(res =>{
      const dec : Decision = {
        id :res.id,
        name: res.name,
        organization : res.organization.organizationName,
        decisionStatusType:statusTypeGetParser(res.decisionStatusType),
        decisionTarget: res.decisionTarget.targetName,
        description : res.description,
        fileName: res.fileName,
        date:"Щойно" };
        setData([...data, dec]);
   })
   .catch(() =>{
    notificationLogic('error', "Рішення не існує");
   });
  

  }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res: Decision[] = await decisionsApi.getAll();
      setData(res);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedData(event.target.value);
  };


  const filteredData = searchedData
    ? data.filter((item) => {
      return Object.values(item).find((element) => {
        return String(element).includes(searchedData);
      });
    })
    : data;

    
   const  handleClickAway=()=>{
    setShowDropdown(false);
   }


  const showModal = () => setVisibleModal(true);

  const itemRender = (current: any, type: string, originalElement: any) => {
    if (type === 'prev') {
      return <Button type="primary">Попередня</Button>;
    }
    if (type === 'next') {
      return <Button type="primary">Наступна</Button>;
    }
    return originalElement;
  };

  return (
    <Layout>
      <Content>
        <h1 className={classes.titleTable}>Рішення керівних органів</h1>
        {loading && <Table loading />}
        {!loading && (
          <>
            <div className={classes.searchContainer}>
              <Input placeholder="Пошук" onChange={handleSearch} />
              <Button type="primary" onClick={showModal}>
                Додати рішення
              </Button>
            </div>
            <Table
              dataSource={filteredData}
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
              pagination={{
                itemRender,
                position: ['bottomRight'],
                showTotal: (total, range) =>
                  `Записи з ${range[0]} по ${range[1]} із ${total} записів`,
              }}
            />
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
            <AddDecisionModal
              setVisibleModal={setVisibleModal}
              visibleModal={visibleModal}
              onAdd={handleAdd}
            />
          </>
        )}
      </Content>
    </Layout>
  );
};

export default DecisionTable;
