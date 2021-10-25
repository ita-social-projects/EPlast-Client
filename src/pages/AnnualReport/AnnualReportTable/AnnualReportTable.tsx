import React, { useEffect, useState } from "react";
import {
    Button,
    Layout,
    Modal,
    Row,
    Typography,
    Tag,
    Tooltip,
    Col,
    Space,
} from "antd";
import moment from "moment";
import AnnualReportApi from "../../../api/AnnualReportApi";
import "./AnnualReportTable.less";
import CitySelectModal from "./CitySelectModal/CitySelectModal";
import { Card } from "antd";
import { CityAnnualReportTable } from "./CityAnnualReportTable";
import { ClubAnnualReportTable } from "./ClubAnnualReport";
import { RegionAnnualReportTable } from "./RegionAnnualReportTable";
import ClubSelectModal from "./ClubSelectModal/ClubSelectModal";
import Search from "antd/lib/input/Search";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import RegionSelectModal from "./RegionSelectModal/RegionSelectModal";
import { useHistory, useParams } from "react-router-dom";
import UserApi from "../../../api/UserApi";
import { Roles } from "../../../models/Roles/Roles";

const { Title } = Typography;

const setTagColor = (status: number) => {
    let color = "";
    if (status == 0) {
        color = "red";
    }
    if (status == 1) {
        color = "green";
    }
    return color;
};

const tabList = [
    {
        key: "city",
        tab: "Річні звіти станиць",
    },
    {
        key: "hovel",
        tab: "Річні звіти куренів",
    },
    {
        key: "country",
        tab: "Річні звіти округ",
    },
];

const AnnualReportTable = () => {
    const { noTitleKey } = useParams();
    const [reportStatusNames, setReportStatusNames] = useState<any[]>(Array());
    const [showRegionAnnualReports, setShowRegionAnnualReports] = useState<boolean>(false);
    const [searchedData, setSearchedData] = useState("");
    const [showCitySelectModal, setShowCitySelectModal] = useState<boolean>(false);
    const [showClubSelectModal, setShowClubSelectModal] = useState<boolean>(false);
    const [sortKey, setSortKey] = useState<number>(1);
    const [cityManager, setCityManager] = useState<boolean>(false);
    const [clubManager, setClubManager] = useState<boolean>(false);
    const [regionManager, setRegionManager] = useState<boolean>(false);
    const history = useHistory();

    useEffect(() => {
        checkAccessToManage();
        fetchAnnualReportStatuses();
        setSearchedData(searchedData);
        renewPage();
    }, [searchedData, sortKey]);

    const fetchAnnualReportStatuses = async () => {
        try {
            let response = await AnnualReportApi.getAnnualReportStatuses();
            setReportStatusNames(response.data.statuses);
        } catch (error) {
            showError(error.message);
        }
    };

    const checkAccessToManage = () => {
        let roles = UserApi.getActiveUserRoles();
        setCityManager(
            roles.includes(Roles.Admin) ||
            roles.includes(Roles.CityHead) ||
            roles.includes(Roles.CityHeadDeputy)
        );
        setClubManager(
            roles.includes(Roles.Admin) ||
            roles.includes(Roles.KurinHead) ||
            roles.includes(Roles.KurinHeadDeputy)
        );
        setRegionManager(
            roles.includes(Roles.Admin) ||
            roles.includes(Roles.OkrugaHead) ||
            roles.includes(Roles.OkrugaHeadDeputy)
        );
    };

    const handleSearch = (event: any) => {
        setSearchedData(event);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.toLowerCase() === "") setSearchedData("");
    };

    const showError = (message: string) => {
        Modal.error({
            title: "Помилка!",
            content: message,
        });
    };

    const SortDirection = (props: { sort: number }) => {
        return (
            <>
                <div className={"tableHeaderSorting"}>
                    <button
                        onClick={() => {
                            setSortKey(props.sort);
                        }}
                        className={sortKey === props.sort ? "sortDirection" : ""}
                    >
                        <CaretUpOutlined />
                    </button>
                    <button
                        onClick={() => {
                            setSortKey(-props.sort);
                        }}
                        className={sortKey === -props.sort ? "sortDirection" : ""}
                    >
                        <CaretDownOutlined />
                    </button>
                </div>
            </>
        );
    };

    const SortColumnHighlight = (sort: number, text: any) => {
        return {
            props: {
                style: {
                    background:
                        sortKey === sort || sortKey === -sort ? "#fafafa" : "",
                },
            },
            children: <div>{text}</div>,
        };
    };

    const columns = [
        {
            title: (
                <>
                    Номер
                    <SortDirection sort={1} />
                </>
            ),
            dataIndex: ["idView"],
            width: "8%",
            render: (text: any) => {
                return SortColumnHighlight(1, text);
            },
        },
        {
            title: (
                <>
                    Станиця
                    <SortDirection sort={2} />
                </>
            ),
            dataIndex: ["cityName"],
            render: (text: any) => {
                return SortColumnHighlight(2, text);
            },
        },
        {
            title: (
                <>
                    Округа
                    <SortDirection sort={3} />
                </>
            ),
            dataIndex: ["regionName"],
            render: (text: any) => {
                return SortColumnHighlight(3, text);
            },
        },
        {
            title: (
                <>
                    Дата подання
                    <SortDirection sort={4} />
                </>
            ),
            dataIndex: "date",
            render: (date: any) => {
                return SortColumnHighlight(
                    4,
                    moment
                        .utc(date.toLocaleString())
                        .local()
                        .format("DD.MM.YYYY")
                );
            },
        },
        {
            title: "Статус",
            dataIndex: "status",
            render: (status: any) => {
                return (
                    <Tag
                        color={setTagColor(status)}
                        key={reportStatusNames[status]}
                    >
                        <Tooltip
                            placement="topLeft"
                            title={reportStatusNames[status]}
                        >
                            {reportStatusNames[status]}
                        </Tooltip>
                    </Tag>
                );
            },
        },
    ];

    const columnsRegion = [
        {
            title: (
                <>
                    Номер
                    <SortDirection sort={1} />
                </>
            ),
            dataIndex: ["idView"],
            width: "8%",
            render: (text: any) => {
                return SortColumnHighlight(1, text);
            },
        },
        {
            title: (
                <>
                    Округа
                    <SortDirection sort={2} />
                </>
            ),
            dataIndex: ["regionName"],
            render: (text: any) => {
                return SortColumnHighlight(2, text);
            },
        },
        {
            title: (
                <>
                    Дата подання
                    <SortDirection sort={3} />
                </>
            ),
            dataIndex: "date",
            render: (date: any) => {
                return SortColumnHighlight(
                    3,
                    moment
                        .utc(date.toLocaleString())
                        .local()
                        .format("DD.MM.YYYY")
                );
            },
        },
        {
            title: "Статус",
            dataIndex: "status",
            render: (status: any) => {
                return (
                    <Tag
                        color={setTagColor(status)}
                        key={reportStatusNames[status]}
                    >
                        <Tooltip
                            placement="topLeft"
                            title={reportStatusNames[status]}
                        >
                            {reportStatusNames[status]}
                        </Tooltip>
                    </Tag>
                );
            },
        },
    ];

    const columnsClub = [
        {
            title: (
                <>
                    Номер
                    <SortDirection sort={1} />
                </>
            ),
            dataIndex: ["idView"],
            width: "8%",
            render: (text: any) => {
                return SortColumnHighlight(1, text);
            },
        },
        {
            title: (
                <>
                    Курінь
                    <SortDirection sort={2} />
                </>
            ),
            dataIndex: ["clubName"],
            render: (text: any) => {
                return SortColumnHighlight(2, text);
            },
        },
        {
            title: (
                <>
                    Дата подання
                    <SortDirection sort={3} />
                </>
            ),
            dataIndex: "date",
            render: (date: any) => {
                return SortColumnHighlight(
                    3,
                    moment
                        .utc(date.toLocaleString())
                        .local()
                        .format("DD.MM.YYYY")
                );
            },
        },
        {
            title: "Статус",
            dataIndex: "status",
            render: (status: any) => {
                return (
                    <Tag
                        color={setTagColor(status)}
                        key={reportStatusNames[status]}
                    >
                        <Tooltip
                            placement="topLeft"
                            title={reportStatusNames[status]}
                        >
                            {reportStatusNames[status]}
                        </Tooltip>
                    </Tag>
                );
            },
        },
    ];

    const contentList: { [key: string]: any } = {
        city: (
            <div>
                <CityAnnualReportTable
                    columns={columns}
                    searchedData={searchedData}
                    sortKey={sortKey}
                />
            </div>
        ),
        hovel: (
            <div>
                <ClubAnnualReportTable
                    columns={columnsClub}
                    searchedData={searchedData}
                    sortKey={sortKey}
                />
            </div>
        ),
        country: (
            <div>
                <RegionAnnualReportTable
                    columns={columnsRegion}
                    searchedData={searchedData}
                    sortKey={sortKey}
                />
            </div>
        ),
    };

    const renewPage = () => {
        history.push(`/annualreport/table/${noTitleKey}`);
    };

    const onTabChange = (key: string) => {
        setSortKey(1);
        history.push(`/annualreport/table/${key}`);
    };

    return (
        <Layout.Content className="annualreport-table">
            <Title level={2}>Річні звіти</Title>
            <Row
                gutter={[12, 12]}
                className="AnnualReportTableButtonsSearchField"
            >
                <Col>
                    <Space>
                        {cityManager ? (
                            <Button
                                type="primary"
                                onClick={() => setShowCitySelectModal(true)}
                            >
                                Подати річний звіт станиці
                            </Button>
                        ) : null}
                        {clubManager ? (
                            <Button
                                type="primary"
                                onClick={() => setShowClubSelectModal(true)}
                            >
                                Подати річний звіт куреня
                            </Button>
                        ) : null}
                        {regionManager ? (
                            <Button
                                type="primary"
                                onClick={() => setShowRegionAnnualReports(true)}
                            >
                                Подати річний звіт округи
                            </Button>
                        ) : null}
                    </Space>
                </Col>
                <Col>
                    <Search
                        placeholder="Пошук"
                        enterButton
                        allowClear
                        onChange={handleSearchChange}
                        onSearch={handleSearch}
                    />
                </Col>
            </Row>
            <Row>
                <Card
                    className="AnnualReportTableTabs"
                    tabList={tabList}
                    activeTabKey={noTitleKey}
                    onTabChange={(key) => {
                        onTabChange(key);
                    }}
                >
                    {contentList[noTitleKey]}
                </Card>
            </Row>
            {regionManager ? (
                <RegionSelectModal
                    visibleModal={showRegionAnnualReports}
                    handleOk={() => setShowRegionAnnualReports(false)}
                />
            ) : null}
            {cityManager ? (
                <CitySelectModal
                    visibleModal={showCitySelectModal}
                    handleOk={() => setShowCitySelectModal(false)}
                />
            ) : null}
            {clubManager ? (
                <ClubSelectModal
                    visibleModal={showClubSelectModal}
                    handleOk={() => setShowClubSelectModal(false)}
                />
            ) : null}
        </Layout.Content>
    );
};

export default AnnualReportTable;
