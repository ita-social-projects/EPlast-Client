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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const history = useHistory();

    useEffect(() => {
        fetchStatisticsMembers(regionId, year)
    }, [])

    const fetchStatisticsMembers = async (regionId: number, year: number) => {
        setIsLoading(true);
        try {
            let response = await regionsApi.getRegionMembersInfo(regionId, year);
            let data = ([].concat(response.data)).map((cityReportInfo: RegionMembersInfo) => {return cityReportInfo }).flat();
            setResult(data);
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

    return <Table
        {...{ loading: isLoading }}
        locale={{
            emptyText: (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="В межах округи не знайдено станиць" />)
        }}
        bordered
        rowKey="id"
        columns={columns as []}
        rowClassName={(record: any) => {
            if (record.cityId == -1) return '';
            if (record.reportStatus == 0 && record.cityAnnualReportId != 0) return 'report-unconfirmed-row';
            if (record.cityAnnualReportId == 0) return 'report-notFound-row';
            else return 'report-confirmed-row';
        }}
        onRow={(record: any) => {
            return {
                onDoubleClick: event => { if (record.cityAnnualReportId) history.push(`/annualreport/cityAnnualReport/${record.cityAnnualReportId}`) },
            };
        }}
        dataSource={result}
        scroll={{ x: 1000 }}
        pagination={{
            showLessItems: true,
            responsive: true,
            showSizeChanger: true,
        }}
    />
}

export default RegionMembersTable;