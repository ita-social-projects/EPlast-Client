import React, {useEffect, useState} from 'react';
import {Table, Empty} from 'antd';
import columns from './columnsCIties';
import {getUsersAdministrations, getusersPreviousAdministrations} from "../../../api/citiesApi";
import Modal from "antd/lib/modal";
import SecretaryModel from './SecretaryModel';

interface props {
    UserId: string;
}

export const UserCitySecretaryTable = ({UserId}: props) => {
    const [isLoadingActive, setIsLoadingActive] = useState<boolean>(true);
    const [isLoadingPrev, setIsLoadingPrev] = useState<boolean>(true);

    const [cityAdmins, setCityAdmins] = useState<SecretaryModel[]>();
    const [prevCityAdmins, setPrevCityAdmins] = useState<SecretaryModel[]>();

    const fetchData = async () => {
        setIsLoadingActive(true);
        try {
            await getUsersAdministrations(UserId).then(response => {
                setCityAdmins(response.data);
            })
        } catch (error) {
            showError(error.message);
        } finally {
            setIsLoadingActive(false);
        }

        setIsLoadingPrev(true);
        try {
            await getusersPreviousAdministrations(UserId).then(response => {
                setPrevCityAdmins(response.data);
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
                dataSource={cityAdmins}
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
                dataSource={prevCityAdmins}
                scroll={{x: 655}}
            />
        </div>
    )
}