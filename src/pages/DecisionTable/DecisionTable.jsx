import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Layout } from 'antd';
import columns from './columns';

import DropDown from './DropDownDecision';
import AddDecisionModal from './AddDecisionModal';
// import DropDown from './DropDownDecision';
// import Foo from './ShowLess';
import http from '../../api/api';
import classes from './Table.module.css';
import { ApiFilled } from '@ant-design/icons';
import decisionsApi from '../../api/decisionsApi'

const { Content } = Layout;

const DecisionTable = () => {
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recordObj, setRecordObj] = useState({});
  const [data, setData] = useState([]);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [searchedData, setSearchedData] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const r = await decisionsApi.getAll();
     // const res = await http.get("posts");
      const decisions = r.data.item2.map(d => d.decisionWrapper.decision);
      console.log("-----decision table--");
      console.log(decisions);
      setData(decisions);
      setLoading(false);
    };
    fetchData();
  },[]);

  const handleSearch = (event) => {
    setSearchedData(event.target.value);
  };

  const filteredData = searchedData
    ? data.filter((item) => {
        return Object.values(item).find((element) => {
          return String(element).includes(searchedData);
        });
      })
    : data;

  const showModal = () => setVisibleModal(true);

  const itemRender = (current, type, originalElement) => {
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
      <Content className={classes.tableDecision}>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
          Рішення керівних органів
        </h1>
        {loading && <Table loading />}
        {!loading && (
          <>
            <div className={classes.searchContainer}>
              <Input
                className={classes.searchInput}
                placeholder="Пошук"
                onChange={handleSearch}
              />
              <Button
                className={classes.addDecision}
                type="primary"
                onClick={showModal}
              >
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
                    setRecordObj(record);
                    setX(event.pageX);
                    setY(event.pageY);
                  },
                };
              }}
              onChange={(pagination) => {
                if (pagination) {
                  // eslint-disable-next-line no-undef
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
            <DropDown
              showDropdown={showDropdown}
              record={recordObj}
              pageX={x}
              pageY={y}
            />
            <AddDecisionModal
              setVisibleModal={setVisibleModal}
              visibleModal={visibleModal}
            />
          </>
        )}
      </Content>
    </Layout>
  );
};

export default DecisionTable;
