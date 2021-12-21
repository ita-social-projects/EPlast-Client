import React, { useEffect, useState } from 'react';
import { Table, Empty } from 'antd';
import columns from './columnsGoverningBodies';
import { getGoverningBodyAdminsForTable } from "../../../api/governingBodiesApi";
import Modal from "antd/lib/modal";
import SecretaryModelForTable from './SecretaryModelForTable';

interface props {
    UserId: string;
}

export const UserGoverningBodySecretaryTable = ({ UserId }: props) => {
    const [isLoadingActive, setIsLoadingActive] = useState<boolean>(true);
    const [isLoadingPrev, setIsLoadingPrev] = useState<boolean>(true);
    const [secretaries, setSecretaries] = useState<SecretaryModelForTable[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(1);

    /*  setPageSize like the whole functionality of the UseState here is redundant.
        Nevertheless, you should probably leave it like this in case if somebody 
        would want to change paginagion options in future.  */
    const [pageSize, setPageSize] = useState<number>(3);
    const [rowCount, setRowCount] = useState<number>(0);
    const [prevSecretaries, setPrevSecretaries] = useState<SecretaryModelForTable[]>([]);
    const [pageNumberPrev, setPageNumberPrev] = useState<number>(1);

    /*  setPageSizePrev like the whole functionality of the UseState here is redundant.
    Nevertheless, you should probably leave it like this in case if somebody 
    would want to change paginagion options in future.  */
    const [pageSizePrev, setPageSizePrev] = useState<number>(3);
    const [rowCountPrev, setRowCountPrev] = useState<number>(0);

    const getSecretaries = async () => {
        setIsLoadingActive(true);
        try {
            const data =
                await getGoverningBodyAdminsForTable(UserId, true, pageNumber, pageSize);
            setSecretaries(data.admins);
            setRowCount(data.rowCount);
        }
        catch {
            showError("Помилка при отриманні даних діловодств");
        }
        finally {
            setIsLoadingActive(false);
        }
    };

    const getPrevSecretaries = async () => {
        setIsLoadingPrev(true);
        try {
            const data =
                await getGoverningBodyAdminsForTable(UserId, false, pageNumberPrev, pageSizePrev);
            setPrevSecretaries(data.admins);
            setRowCountPrev(data.rowCount);
        }
        catch {
            showError("Помилка при отриманні даних колишніх діловодств");
        }
        finally {
            setIsLoadingPrev(false);
        }
    };

    const showError = (message: string) => {
        Modal.error({
            title: "Помилка!",
            content: message,
        });
    };

    useEffect(() => {
        getSecretaries();
    }, [pageNumber, pageSize])

    useEffect(() => {
        getPrevSecretaries();
    }, [pageNumberPrev, pageSizePrev])

    const handlePageChange = (page: number) => {
        setPageNumber(page);
    };

    const handlePageChangePrev = (page: number) => {
        setPageNumberPrev(page);
    };

    return (
        <div>
            <h1>Дійсні діловодства краю</h1>
            <br />
            <Table
                loading={isLoadingActive}
                locale={{
                    emptyText: (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Немає дійсних діловодств" />)
                }}
                columns={columns}
                dataSource={secretaries}
                scroll={{ x: 655 }}
                pagination={
                    {
                        current: pageNumber,
                        pageSize: pageSize,
                        total: rowCount,
                        showLessItems: true,
                        responsive: true,
                        onChange: (page) => handlePageChange(page),
                    }
                }
            />
            <h1>Колишні діловодства краю</h1>
            <br />
            <Table
                loading={isLoadingPrev}
                locale={{
                    emptyText: (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Немає колишніх діловодств" />)
                }}
                columns={columns}
                dataSource={prevSecretaries}
                scroll={{ x: 655 }}
                pagination={
                    {
                        current: pageNumberPrev,
                        pageSize: pageSizePrev,
                        total: rowCountPrev,
                        showLessItems: true,
                        responsive: true,
                        onChange: (page) => handlePageChangePrev(page),
                    }
                }
            />
        </div>
    )
}