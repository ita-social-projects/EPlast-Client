import React, {useEffect, useState} from 'react';
import {Table, Empty} from 'antd';
import columns from './columnsSectors';
import {
    getUsersAdministrations,
    getUsersPreviousAdministrations
} from "../../../api/governingBodySectorsApi";

import Modal from "antd/lib/modal";
import SecretaryModel from './SecretaryModel';

interface props {
    UserId: string;
}

export const UserSectorSecretaryTable = ({UserId}: props) => {
    const [isLoadingActive, setIsLoadingActive] = useState<boolean>(true);
    const [isLoadingPrev, setIsLoadingPrev] = useState<boolean>(true);

    const [sectorAdmins, setSectorAdmins] = useState<SecretaryModel[]>();
    const [prevSectorAdmins, setPrevSectorAdmins] = useState<SecretaryModel[]>();

    const fetchData = async () => {
        setIsLoadingActive(true);
        try {
            await getUsersAdministrations(UserId).then(response => {
                console.log(response)
                setSectorAdmins(response.data);
            })
        } catch (error) {
            showError(error.message);
        } finally {
            setIsLoadingActive(false);
        }

        setIsLoadingPrev(true);
        try {
            await getUsersPreviousAdministrations(UserId).then(response => {
                setPrevSectorAdmins(response.data)
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
            <h1>Дійсні діловодства напряму</h1>
            <br/>
            <Table 
                {...{loading:isLoadingActive}}
                locale={{
                    emptyText: (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Немає дійсних діловодств"/>)
                }}
                columns={columns}
                dataSource={sectorAdmins}
                scroll={{x: 655}}
                pagination={
                    {
                      showLessItems: true,
                      responsive:true,
                      pageSize: 3
                    }
                  }
            />

             <h1>Колишні діловодства напряму</h1>
            <br/>
            <Table
                {...{loading:isLoadingPrev}}
                locale={{
                    emptyText: (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Немає колишніх діловодств"/>)
                }}
                columns={columns}
                dataSource={prevSectorAdmins}
                scroll={{x: 655}}
                pagination={
                    {
                      showLessItems: true,
                      responsive:true,
                      pageSize: 3
                    }
                  }
            /> 

        </div>

    )
}