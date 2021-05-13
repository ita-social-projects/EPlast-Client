import React, {useEffect, useState, PropsWithRef} from 'react';
import {Table, Spin, Input, Empty} from 'antd';
import columns from './columnsCIties';
import {getUsersAdministrations, getusersPreviousAdministrations} from "../../../api/citiesApi";
import {getUsersPreviousAdministrations} from "../../../api/regionsApi";
import Modal from "antd/lib/modal";


interface props {

    UserId: string;
}

export const UserCitySecretaryTable = ({UserId}: props) => {
    const [isLoadingActive, setIsLoadingActive] = useState<boolean>(true);
    const [isLoadingPrev, setIsLoadingPrev] = useState<boolean>(true);

    const [data, setData] = useState<any>([{
        id: '',
        user: '',
        adminType: '',
        startDate: '',
        endDate: '',
        city: {
            id: '',
            name: ''
        }
    }]);


    const [prevData, setPrevData] = useState<any>([{
        id: '',
        user: '',
        adminType: '',
        startDate: '',
        endDate: '',
        city: {
            id: '',
            name: ''
        }
    }]);

    const fetchData = async () => {
        setIsLoadingActive(true);
        try {
            await getUsersAdministrations(UserId).then(response => {
                setData(response.data);
            })
        } catch (error) {
            showError(error.message);
        } finally {
            setIsLoadingActive(false);
        }

        setIsLoadingPrev(true);
        try {
            await getusersPreviousAdministrations(UserId).then(response => {
                setPrevData(response.data);
            })
        } catch (error) {
            showError(error.message);
        } finally {
            setIsLoadingPrev(false);
        }
    }

    const showError = (message: string) => {
        Modal.error({
            title: "Помилка!",
            content: message,
        });
    };

    useEffect(() => {
        fetchData();
    }, [])


    return (
        <div>
            <h1>Дійсні діловодства станиці</h1>
            <br/>
            <Table
                {...{loading: isLoadingActive}}
                locale={{
                    emptyText: (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Немає дійсних діловодств"/>)
                }}
                columns={columns}
                dataSource={data}
                scroll={{x: 655}}
            />

            <h1>Колишні діловодства станиці</h1>
            <br/>
            <Table
                {...{loading: isLoadingPrev}}
                locale={{
                    emptyText: (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Немає колишніх діловодств"/>)
                }}
                columns={columns}
                dataSource={prevData}
                scroll={{x: 655}}
            />
        </div>
    )
}