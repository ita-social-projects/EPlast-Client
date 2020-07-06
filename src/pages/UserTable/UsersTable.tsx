import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Layout } from 'antd';
import columns from './columns';
import classes from './Table.module.css';
import http from '../../api/api';
import DropDown from './DropDownDecision';

const { Content } = Layout;

const UsersTable = () => {
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recordObj, setRecordObj] = useState<any>({});
  const [data, setData] = useState([]);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [searchedData, setSearchedData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await http.get('users');
      setData(res.data);
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
        {loading && <Table loading />}
        {!loading && (
          <>
            <div className={classes.searchContainer}>
              <Input placeholder="Пошук" onChange={handleSearch} />
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
                  window.scrollTo({
                    left: 0,
                    top: 0,
                    behavior: 'smooth',
                  });
                }
              }}
              scroll={{ x: 1000 }}
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
          </>
        )}
      </Content>
    </Layout>
  );
};

export default UsersTable;
