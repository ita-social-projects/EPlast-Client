import { Tooltip } from "antd";
import { SortOrder } from "antd/es/table/interface";
import React from "react";

const SliceTitle = (title: string) => {
    if (title.length >= 20) {
        return (
            <Tooltip title={title}>
                <span style={{ fontSize: "small" }}>
                    {title.slice(0, 16) + "..."}
                </span>
            </Tooltip>
        );
    }
    return <span style={{ fontSize: "small" }}>{title}</span>;
};

const columns = [
    {
        title: "№",
        dataIndex: "cityAnnualReportId",
        key: "cityAnnualReportId",
        fixed: "left",
        render: (id: any) => {
            return id ? <p>{id}</p> : "";
        },
        width: 65,
    },
    {
        title: SliceTitle("Станиця"),
        dataIndex: "cityName",
        fixed: "left",
        ellipsis: true,
        width: 100,
    },
    {
        title: SliceTitle("Кількість пташат"),
        dataIndex: "numberOfPtashata",
        render: (numberOfPtashata: any) => {
            return numberOfPtashata ? <p>{numberOfPtashata}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість новацтва"),
        dataIndex: "numberOfNovatstva",
        render: (numberOfNovatstva: any) => {
            return numberOfNovatstva ? <p>{numberOfNovatstva}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість неіменованих"),
        dataIndex: "numberOfUnatstvaNoname",
        render: (numberOfUnatstvaNoname: any) => {
            return numberOfUnatstvaNoname ? <p>{numberOfUnatstvaNoname}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість прихильників"),
        dataIndex: "numberOfUnatstvaSupporters",
        render: (numberOfUnatstvaSupporters: any) => {
            return numberOfUnatstvaSupporters ? <p>{numberOfUnatstvaSupporters}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість учасників"),
        dataIndex: "numberOfUnatstvaMembers",
        render: (numberOfUnatstvaMembers: any) => {
            return numberOfUnatstvaMembers ? <p>{numberOfUnatstvaMembers}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість розвідувачів"),
        dataIndex: "numberOfUnatstvaProspectors",
        render: (numberOfUnatstvaProspectors: any) => {
            return numberOfUnatstvaProspectors ? <p>{numberOfUnatstvaProspectors}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість скобів/вірлиць"),
        dataIndex: "numberOfUnatstvaSkobVirlyts",
        render: (numberOfUnatstvaSkobVirlyts: any) => {
            return numberOfUnatstvaSkobVirlyts ? <p>{numberOfUnatstvaSkobVirlyts}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість старших пластунів прихильників"),
        dataIndex: "numberOfSeniorPlastynSupporters",
        render: (numberOfSeniorPlastynSupporters: any) => {
            return numberOfSeniorPlastynSupporters ? <p>{numberOfSeniorPlastynSupporters}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість старших пластунів учасників"),
        dataIndex: "numberOfSeniorPlastynMembers",
        render: (numberOfSeniorPlastynMembers: any) => {
            return numberOfSeniorPlastynMembers ? <p>{numberOfSeniorPlastynMembers}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість сеньйорів пластунів прихильників"),
        dataIndex: "numberOfSeigneurSupporters",
        render: (numberOfSeigneurSupporters: any) => {
            return numberOfSeigneurSupporters ? <p>{numberOfSeigneurSupporters}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість сеньйорів пластунів учасників"),
        dataIndex: "numberOfSeigneurMembers",
        render: (numberOfSeigneurMembers: any) => {
            return numberOfSeigneurMembers ? <p>{numberOfSeigneurMembers}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість гніздечок пташат"),
        dataIndex: "numberOfSeatsPtashat",
        render: (numberOfSeatsPtashat: any) => {
            return numberOfSeatsPtashat ? <p>{numberOfSeatsPtashat}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість самостійних роїв"),
        dataIndex: "numberOfIndependentRiy",
        render: (numberOfIndependentRiy: any) => {
            return numberOfIndependentRiy ? <p>{numberOfIndependentRiy}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle(
            "Кількість куренів у станиці/паланці (окрузі/регіоні)"
        ),
        dataIndex: "numberOfClubs",
        render: (numberOfClubs: any) => {
            return numberOfClubs ? <p>{numberOfClubs}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість самостійних гуртків"),
        dataIndex: "numberOfIndependentGroups",
        render: (numberOfIndependentGroups: any) => {
            return numberOfIndependentGroups ? <p>{numberOfIndependentGroups}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle(
            "Кількість діючих виховників (з усіх членів УСП, УПС)"
        ),
        dataIndex: "numberOfTeachers",
        render: (numberOfTeachers: any) => {
            return numberOfTeachers ? <p>{numberOfTeachers}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle(
            "Кількість адміністраторів (в проводах будь якого рівня)"
        ),
        dataIndex: "numberOfAdministrators",
        render: (numberOfAdministrators: any) => {
            return numberOfAdministrators ? <p>{numberOfAdministrators}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle(
            "Кількість тих, хто поєднує виховництво та адміністрування"
        ),
        dataIndex: "numberOfTeacherAdministrators",
        render: (numberOfTeacherAdministrators: any) => {
            return numberOfTeacherAdministrators ? <p>{numberOfTeacherAdministrators}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість пільговиків"),
        dataIndex: "numberOfBeneficiaries",
        render: (numberOfBeneficiaries: any) => {
            return numberOfBeneficiaries ? <p>{numberOfBeneficiaries}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість членів Пластприяту"),
        dataIndex: "numberOfPlastpryiatMembers",
        render: (numberOfPlastpryiatMembers: any) => {
            return numberOfPlastpryiatMembers ? <p>{numberOfPlastpryiatMembers}</p> : "";
        },
        width: 100,
    },
    {
        title: SliceTitle("Кількість почесних членів"),
        dataIndex: "numberOfHonoraryMembers",
        render: (numberOfHonoraryMembers: any) => {
            return numberOfHonoraryMembers ? <p>{numberOfHonoraryMembers}</p> : "";
        },
        width: 100,
    },
];

export default columns;
