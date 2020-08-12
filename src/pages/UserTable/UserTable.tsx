import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Input, Layout, Row, Col, Space, Spin, Typography, Button } from 'antd';
import adminApi from '../../api/adminApi';
import DropDownUserTable from './DropDownUserTable';
import Title from 'antd/lib/typography/Title';
import ColumnsForUserTable from './ColumnsForUserTable';
import Search from 'antd/lib/input/Search';
const classes = require('./UserTable.module.css');

const UserTable = () => {
    const history = useHistory();
    const [recordObj, setRecordObj] = useState<any>(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchedData, setSearchedData] = useState('');
    const [users, setUsers] = useState<any>([{
        user: {
            id: '',
            firstName: '',
            lastName: '',
            birthday: '',
        },
        regionName: '',
        cityName: '',
        clubName: '',
        userPlastDegreeName: '',
        userRoles: ''
    }])

    useEffect(() => {
        const fetchData = async () => {
            await adminApi.getUsersForTable().then(response => {
                setUsers(response.data);
            })
            setLoading(true);
        }
        fetchData();
    }, [])

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchedData(event.target.value);
    };

    const itemRender = (current: any, type: string, originalElement: any) => {
        if (type === 'prev') {
            return <Button type="primary">Попередня</Button>;
        }
        if (type === 'next') {
            return <Button type="primary">Наступна</Button>;
        }
        return originalElement;
    }

    const filteredData = searchedData
        ? users.filter((item: any) => {
            return Object.values(item).find((element) => {
                return String(element).includes(searchedData);
            });
        })
        : users;


    const handleDelete = (id: string) => {
        const filteredData = users.filter((d: any) => d.id !== id);
        setUsers([...filteredData]);
        setShowDropdown(false);
    }

    const handleChange = (id: string, userRoles: string[]) => {
        const filteredData = users.filter((d: any) => {
            if (d.id === id) {
                d.userRoles = userRoles;
            }
            return d;
        }
        );
    }

    return loading === false ? (
        <div className={classes.spaceWrapper}>
            <Space className={classes.loader} size="large">
                <Spin size="large" />
            </Space>
        </div>
    ) : (
            <Layout.Content>
                <Title level={2}>Таблиця користувачів</Title>
                <Row
                    gutter={16}>
                    <Col span={4}>
                        <Search placeholder='Пошук' onChange={handleSearch} enterButton="Пошук" />
                    </Col>
                </Row>
                <Table
                    className={classes.table}
                    bordered
                    rowKey="id"
                    columns={ColumnsForUserTable}
                    dataSource={filteredData}
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                setShowDropdown(false);
                            },
                            onContextMenu: (event) => {
                                event.preventDefault();
                                setShowDropdown(true);
                                setRecordObj(record.user.id);
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
                <DropDownUserTable
                    showDropdown={showDropdown}
                    record={recordObj}
                    pageX={x}
                    pageY={y}
                    onDelete={handleDelete}
                    onChange={handleChange}
                />
            </Layout.Content >
        );

}
export default UserTable;