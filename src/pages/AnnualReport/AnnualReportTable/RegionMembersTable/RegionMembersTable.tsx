import { InfoCircleOutlined } from "@ant-design/icons";
import { Empty, Modal, Table } from "antd";
import React, { useEffect } from "react";
import { useState } from "react"
import { useHistory } from "react-router-dom";
import regionsApi from "../../../../api/regionsApi";
import RegionMembersInfo from "../../Interfaces/RegionMembersInfo";
import columns from "./ColumnsForRegionMembersTable";

interface Props {
    regionId: number;
    year: number;
}

const RegionMembersTable = (props: Props) => {
    const { regionId, year } = props;
    const [result, setResult] = useState<RegionMembersInfo[]>(Array());
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState<number>(0);
    const [visibleInfoBlock, setVisibleInfoBlock] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const history = useHistory();

    useEffect(() => {
        fetchStatisticsMembers(regionId, year)
    }, [page, pageSize])

    const fetchStatisticsMembers = async (regionId: number, year: number) => {
        setIsLoading(true);
        try {
            let response = await regionsApi.getRegionMembersInfo(regionId, year, page, pageSize);
            let data = ([].concat(response.data)).map((cityReportInfo: RegionMembersInfo) => { return cityReportInfo }).flat();
            setResult(data);
            setTotal(data[0]?.total);
        } catch (error) {
            showError(error.message)
        } finally {
            setIsLoading(false);
        }
    }

    const showError = (message: string) => {
        Modal.error({
            title: 'Помилка!',
            content: message,
            onOk: () => { history.goBack(); }
        });
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const handleSizeChange = (page: number, pageSize: number = 10) => {
        setPage(page);
        setPageSize(pageSize);
    };

    return <>
        <Table
            {...{ loading: isLoading }}
            locale={{
                emptyText: (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="В межах округи не знайдено станиць" />)
            }}
            bordered
            rowKey="id"
            columns={columns as []}
            rowClassName={(record: any) => {
                if (record.cityName == "Загалом") return '';
                if (record.reportStatus == 0 && record.cityAnnualReportId != 0) return 'report-unconfirmed-row';
                if ([1, 2].includes(record.reportStatus)) return 'report-confirmed-row';
                else return 'report-notFound-row';
            }}
            onRow={(record: any) => {
                return {
                    onDoubleClick: event => { if (record.cityAnnualReportId) history.push(`/annualreport/cityAnnualReport/${record.cityAnnualReportId}`) },
                };
            }}
            dataSource={result}
            scroll={{ x: 1000 }}
            pagination={{
                current: page,
                pageSize: pageSize,
                total: total,
                showLessItems: true,
                responsive: true,
                showSizeChanger: true,
                onChange: (page) => handlePageChange(page),
                onShowSizeChange: (page, size) => handleSizeChange(page, size),
            }}
        />
        <span>
            <div className="region-members-table-info-icon"
                onClick={() => setVisibleInfoBlock(!visibleInfoBlock)}>
                <InfoCircleOutlined style={{cursor:"pointer"}}/>
            </div>
            <div 
            hidden={!visibleInfoBlock}
            className={"region-members-table-info"}>
                <div className="region-members-table-info-confirmed">Річний звіт станиці зі статусом "Підтверджений" або "Збережений". Дані звіту враховуються до рядка "Загалом".</div>
                <div className="region-members-table-info-unconfirmed">Річний звіт станиці зі статусом "Непідтверджений". Дані звіту не враховуються до рядка "Загалом".</div>
                <div className="region-members-table-info-notfound">Річний звіт станиці за вказаний рік не знайдено.</div>
            </div>
        </span>
    </>
}

export default RegionMembersTable;