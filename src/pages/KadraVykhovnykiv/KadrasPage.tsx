import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Drawer, Col, Row } from 'antd';
import { KVTable } from './KVTable';
import jwt from "jwt-decode";
import AddNewKadraForm from './AddNewKadraForm';
import AuthStore from '../../stores/AuthStore';
import { Roles } from '../../models/Roles/Roles';
import Search from 'antd/lib/input/Search';
import kadrasApi from "../../api/KadraVykhovnykivApi";

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
    const [idType1, setidType1] = useState<number>();
    const [idType2, setidType2] = useState<number>();
    const [idType3, setidType3] = useState<number>();
    const [idType4, setidType4] = useState<number>();

    const typesId = async()=>{
        await kadrasApi.getAllKVTypes().then(response => {
          setidType1(response.data[0].id);
          setidType2(response.data[1].id);
          setidType3(response.data[2].id);
          setidType4(response.data[3].id);
          console.log(response.data[0].id);
        })
    }

    useEffect(() => {
       typesId();
      },[])

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
        KV1N: <div key='1'><KVTable current={idType1!} searchData={searchedData} /></div>,
        KV1U: <div key='2'><KVTable current={idType2!} searchData={searchedData} /></div>,
        KV2N: <div key='3'><KVTable current={idType3!} searchData={searchedData} /></div>,
        KV2U: <div key='4'><KVTable current={idType4!} searchData={searchedData} /></div>
    };

    const [visible, setvisible] = useState<boolean>(false);
    const [noTitleKey, setKey] = useState<string>('KV1N');
    const [canEdit] = useState(roles.includes(Roles.Admin));

    const handleSearch = (event: any) => {
        setSearchedData(event);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.toLowerCase() === '') setSearchedData('');
    }

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
            <Row gutter={[6, 12]} className={classes.buttonSearchField}>
                <Col>
                    {canEdit === true ? (
                        <Button
                            type="primary"
                            onClick={showModal}
                        >
                            Додати кадру
                        </Button>
                    ) : (null)}
                </Col>
                <Col>
                    <Search
                        enterButton
                        placeholder="Пошук"
                        allowClear
                        onChange={handleSearchChange}
                        onSearch={handleSearch}
                    />
                </Col>
            </Row>
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
            <Drawer
                closable = {false}
                width="auto"
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
