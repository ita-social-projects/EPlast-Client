import React, { useState } from 'react';
import { Input, Button, Card, Drawer } from 'antd';
import { KVTable } from './KVTable';
import jwt from "jwt-decode";
import AddNewKadraForm from './AddNewKadraForm';
import AuthStore from '../../stores/AuthStore';
import { Roles } from '../../models/Roles/Roles';
import Search from 'antd/lib/input/Search';

const classes = require('./Table.module.css');

const tabListNoTitle = [
    {
        key: 'KV1N',
        tab: 'КВ1(УПН)',
    },
    {
        key: 'KV1U',
        tab: 'КВ1(УПЮ)',
    },
    {
        key: 'KV2N',
        tab: 'КВ2(УПН)',
    },
    {
        key: 'KV2U',
        tab: 'КВ2(УПЮ)',
    },
];

export const KadrasTable = () => {
    let user: any;
    let curToken = AuthStore.getToken() as string;
    let roles: string[] = [""];
    user = curToken !== null ? (jwt(curToken) as string) : "";
    roles =
        curToken !== null
            ? (user[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] as string[])
            : [""];

    const [searchedData, setSearchedData] = useState('');

    const contentListNoTitle: { [key: string]: any } = {
        KV1N: <div key='1'><KVTable current={5} searchData={searchedData} /></div>,
        KV1U: <div key='2'><KVTable current={6} searchData={searchedData} /></div>,
        KV2N: <div key='3'><KVTable current={7} searchData={searchedData} /></div>,
        KV2U: <div key='4'><KVTable current={8} searchData={searchedData} /></div>
    };

    const [visible, setvisible] = useState<boolean>(false);
    const [noTitleKey, setKey] = useState<string>('KV1N');
    const [canEdit] = useState(roles.includes(Roles.Admin));

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchedData(event.target.value);
    };

    const showModal = () => {
        setvisible(true);
    };

    const handleOk = () => {
        setvisible(false);
    };

    const handleCancel = () => {

        setvisible(false);
    };

    const renewPage = () => {
        const key = noTitleKey;

        setKey('KV1N');
        setKey('KV2N');
        setKey(key);
        setvisible(false);
    }

    const onTabChange = (key: string) => {
        setKey(key);
    };

    return (
        <>
        <h1 className={classes.titleTable}>Кадра виховників</h1>
            <div className={classes.searchContainer}>
                {canEdit === true ? (
                <>
                <Button type="primary" onClick={showModal}>
                    Додати кадру
                </Button>
                    </>
                ) : (
                <></>
                )}
                <Search
                enterButton
                placeholder="Пошук"
                allowClear
                onChange={handleSearch}               
               />
            </div>
            <Card
                style={{ width: '100%' }}
                tabList={tabListNoTitle}
                activeTabKey={noTitleKey}
                onTabChange={key => {
                    onTabChange(key);
                }}
            >
                {contentListNoTitle[noTitleKey]}
            </Card>
            <Drawer width="auto"
                title="Надати кадру виховників"
                visible={visible}
                onClose={handleCancel}
                footer={null}
            >
                <AddNewKadraForm onAdd={renewPage} showModal={setvisible} ></AddNewKadraForm>
            </Drawer>
        </>
    )

}
export default KadrasTable;
