import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Layout } from 'antd';
import columns from './columns';
import UserDistinction from '../Interfaces/UserDistinction';
import DropDownDistinctionTable from './DropDownDistinctionTable';
import distinctionApi from '../../../api/distinctionApi';
import userApi from '../../../api/UserApi';
import Item from 'antd/lib/list/Item';
import { User } from '../../userPage/Interface/Interface';

const classes = require('../../DecisionTable/Table.module.css');


type UserDistTable = {
  id: number,
  dist: string,
  name: string,
  date: string,
  reason: string,
  reporter: string
}

const { Content } = Layout;
const DecisionTable = () => {
  const [recordObj, setRecordObj] = useState<any>(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
    const [loading, setLoading] = useState(false);
    const [UserDistinctions, setData] = useState<UserDistinction[]>();

    useEffect(() => {
      const user = async (userId: string) => (await userApi.getById(userId)).data
      const fetchData = async () => {
        setLoading(true);
        const res: UserDistinction[] = await distinctionApi.getUserDistinctions();

        console.log(res);
        setData(res);
        setLoading(false);
      };
      fetchData();
    }, []);

return (
    <Layout>
      <Content onClick={() => { setShowDropdown(false) }} >
        <h1 className={classes.titleTable}>Відзначення</h1>
        {loading && <Table loading />}
        {!loading && (
          <>
            <div className={classes.searchContainer}>
              <Input placeholder="Пошук" />
              <Button type="primary" >
                Додати відзначення
              </Button>
            </div>
            <Table
              dataSource={UserDistinctions}
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
                        setX(event.pageX);
                        setY(event.pageY);
                    },
                };
            }}
              bordered
              rowKey="id"
            />
                  <DropDownDistinctionTable
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
        }
export default DecisionTable;
