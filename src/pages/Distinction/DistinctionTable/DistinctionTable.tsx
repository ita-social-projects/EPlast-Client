import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Layout } from 'antd';
import columns from './columns';
import UserDistinction from '../Interfaces/UserDistinction';
import distinctionApi from '../../../api/distinctionApi';
const classes = require('../../DecisionTable/Table.module.css');

const { Content } = Layout;
const DecisionTable = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<UserDistinction[]>(Array<UserDistinction>());
return (
    <Layout>
      <Content>
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
              dataSource={data}
              columns={columns}
              bordered
              rowKey="id"
            />
          </>
        )}
      </Content>
    </Layout>
  );
            };
export default DecisionTable;

