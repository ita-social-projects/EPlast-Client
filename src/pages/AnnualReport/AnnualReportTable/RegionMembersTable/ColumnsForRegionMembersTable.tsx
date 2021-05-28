import { LineHeightOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { SortOrder } from "antd/es/table/interface";
import React from "react";

const SliceTitle=(title: string)=>{
    if(title.length >= 20)
    {
      return (
        <Tooltip title={title}>
            <span style={{ fontSize: "small" }}>{title.slice(0, 16) + "..."}</span>
        </Tooltip>
      )
    }
    return <span style={{ fontSize: "small" }}>{title}</span>
}

const columns = [
    {
        title: "№",
        dataIndex: "cityAnnualReportId",
        key: "cityAnnualReportId",
        fixed: "left",
        render: (id: any) => {
            return id ? (<p>{id}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.id - b.id },
        width: 65
    },
    {
        title: SliceTitle("Станиця"),
        dataIndex: "cityName",
        fixed: "left",
        ellipsis: true,
        sorter: (a: any, b: any) => a.cityName.localeCompare(b.cityName),
        sortDirections: ["ascend", "descend"] as SortOrder[],
        width: 100
    },
    {
        title: SliceTitle("Кількість пташат"),
        dataIndex: ["membersStatistic", "numberOfPtashata"],
        render: (numberOfPtashata: any) => {
            return numberOfPtashata ? (<p>{numberOfPtashata}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfPtashata - b.numberOfPtashata },
        width: 100
    },
    {
        title: SliceTitle("Кількість новацтва"),
        dataIndex: ["membersStatistic", "numberOfNovatstva"],
        render: (numberOfNovatstva: any) => {
            return numberOfNovatstva ? (<p>{numberOfNovatstva}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfNovatstva - b.numberOfNovatstva },
        width: 100
    },
    {
        title: SliceTitle("Кількість неіменованих"),
        dataIndex: ["membersStatistic", "numberOfUnatstvaNoname"],
        render: (numberOfUnatstvaNoname: any) => {
            return numberOfUnatstvaNoname ? (<p>{numberOfUnatstvaNoname}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfUnatstvaNoname - b.numberOfUnatstvaNoname },
        width: 100
    },
    {
        title: SliceTitle("Кількість прихильників"),
        dataIndex: ["membersStatistic", "numberOfUnatstvaSupporters"],
        render: (numberOfUnatstvaSupporters: any) => {
            return numberOfUnatstvaSupporters ? (<p>{numberOfUnatstvaSupporters}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfUnatstvaSupporters - b.numberOfUnatstvaSupporters },
        width: 100
    },
    {
        title: SliceTitle("Кількість учасників"),
        dataIndex: ["membersStatistic", "numberOfUnatstvaMembers"],
        render: (numberOfUnatstvaMembers: any) => {
            return numberOfUnatstvaMembers ? (<p>{numberOfUnatstvaMembers}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfUnatstvaMembers - b.numberOfUnatstvaMembers },
        width: 100
    },
    {
        title: SliceTitle("Кількість розвідувачів"),
        dataIndex: ["membersStatistic", "numberOfUnatstvaProspectors"],
        render: (numberOfUnatstvaProspectors: any) => {
            return numberOfUnatstvaProspectors ? (<p>{numberOfUnatstvaProspectors}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfUnatstvaProspectors - b.numberOfUnatstvaProspectors },
        width: 100
    },
    {
        title: SliceTitle("Кількість скобів/вірлиць"),
        dataIndex: ["membersStatistic", "numberOfUnatstvaSkobVirlyts"],
        render: (numberOfUnatstvaSkobVirlyts: any) => {
            return numberOfUnatstvaSkobVirlyts ? (<p>{numberOfUnatstvaSkobVirlyts}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfUnatstvaSkobVirlyts - b.numberOfUnatstvaSkobVirlyts },
        width: 100
    },
    {
        title: SliceTitle("Кількість старших пластунів прихильників"),
        dataIndex: ["membersStatistic", "numberOfSeniorPlastynSupporters"],
        render: (numberOfSeniorPlastynSupporters: any) => {
            return numberOfSeniorPlastynSupporters ? (<p>{numberOfSeniorPlastynSupporters}</p>) : "";
        },        
        sorter: { compare: (a: any, b: any) => a.numberOfSeniorPlastynSupporters - b.numberOfSeniorPlastynSupporters },
        width: 100
    },
    {
        title: SliceTitle("Кількість старших пластунів учасників"),
        dataIndex: ["membersStatistic", "numberOfSeniorPlastynMembers"],
        render: (numberOfSeniorPlastynMembers: any) => {
            return numberOfSeniorPlastynMembers ? (<p>{numberOfSeniorPlastynMembers}</p>) : "";
        }, 
        sorter: { compare: (a: any, b: any) => a.numberOfSeniorPlastynMembers - b.numberOfSeniorPlastynMembers },
        width: 100
    },
    {
        title: SliceTitle("Кількість сеньйорів пластунів прихильників"),
        dataIndex: ["membersStatistic", "numberOfSeigneurSupporters"],
        render: (numberOfSeigneurSupporters: any) => {
            return numberOfSeigneurSupporters ? (<p>{numberOfSeigneurSupporters}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfSeigneurSupporters - b.numberOfSeigneurSupporters },
        width: 100
    },
    {
        title: SliceTitle("Кількість сеньйорів пластунів учасників"),
        dataIndex: ["membersStatistic", "numberOfSeigneurMembers"],
        render: (numberOfSeigneurMembers: any) => {
            return numberOfSeigneurMembers ? (<p>{numberOfSeigneurMembers}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfSeigneurMembers - b.numberOfSeigneurMembers },
        width: 100
    },
    {
        title: SliceTitle("Кількість гніздечок пташат"),
        dataIndex: "numberOfSeatsPtashat",
        render: (numberOfSeatsPtashat: any) => {
            return numberOfSeatsPtashat ? (<p>{numberOfSeatsPtashat}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfSeatsPtashat - b.numberOfSeatsPtashat },
        width: 100
    },
    {
        title: SliceTitle("Кількість самостійних роїв"),
        dataIndex: "numberOfIndependentRiy",
        render: (numberOfIndependentRiy: any) => {
            return numberOfIndependentRiy ? (<p>{numberOfIndependentRiy}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfIndependentRiy - b.numberOfIndependentRiy },
        width: 100
    },
    {
        title: SliceTitle("Кількість куренів у станиці/паланці (окрузі/регіоні)"),
        dataIndex: "numberOfClubs",
        render: (numberOfClubs: any) => {
            return numberOfClubs ? (<p>{numberOfClubs}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfClubs - b.numberOfClubs },
        width: 100
    },
    {
        title: SliceTitle("Кількість самостійних гуртків"),
        dataIndex: "numberOfIndependentGroups",
        render: (numberOfIndependentGroups: any) => {
            return numberOfIndependentGroups ? (<p>{numberOfIndependentGroups}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfIndependentGroups - b.numberOfIndependentGroups },
        width: 100
    },
    {
        title: SliceTitle("Кількість діючих виховників (з усіх членів УСП, УПС)"),
        dataIndex: "numberOfTeachers",
        render: (numberOfTeachers: any) => {
            return numberOfTeachers ? (<p>{numberOfTeachers}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfTeachers - b.numberOfTeachers },
        width: 100
    },
    {
        title: SliceTitle("Кількість адміністраторів (в проводах будь якого рівня)"),
        dataIndex: "numberOfAdministrators",
        render: (numberOfAdministrators: any) => {
            return numberOfAdministrators ? (<p>{numberOfAdministrators}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfAdministrators - b.numberOfAdministrators },
        width: 100
    },
    {
        title: SliceTitle("Кількість тих, хто поєднує виховництво та адміністрування"),
        dataIndex: "numberOfTeacherAdministrators",
        render: (numberOfTeacherAdministrators: any) => {
            return numberOfTeacherAdministrators ? (<p>{numberOfTeacherAdministrators}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfTeacherAdministrators - b.numberOfTeacherAdministrators },
        width: 100
    },
    {
        title: SliceTitle("Кількість пільговиків"),
        dataIndex: "numberOfBeneficiaries",
        render: (numberOfBeneficiaries: any) => {
            return numberOfBeneficiaries ? (<p>{numberOfBeneficiaries}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfBeneficiaries - b.numberOfBeneficiaries },
        width: 100
    },
    {
        title: SliceTitle("Кількість членів Пластприяту"),
        dataIndex: "numberOfPlastpryiatMembers",
        render: (numberOfPlastpryiatMembers: any) => {
            return numberOfPlastpryiatMembers ? (<p>{numberOfPlastpryiatMembers}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfPlastpryiatMembers - b.numberOfPlastpryiatMembers },
        width: 100
    },
    {
        title: SliceTitle("Кількість почесних членів"),
        dataIndex: "numberOfHonoraryMembers",
        render: (numberOfHonoraryMembers: any) => {
            return numberOfHonoraryMembers ? (<p>{numberOfHonoraryMembers}</p>) : "";
        },
        sorter: { compare: (a: any, b: any) => a.numberOfHonoraryMembers - b.numberOfHonoraryMembers },
        width: 100
    },
];

export default columns;