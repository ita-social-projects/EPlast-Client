import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Empty, Table, Tooltip } from "antd";
import ClickAwayListener from "react-click-away-listener";
import UnconfirmedDropdown from "./Dropdowns/UnconfirmedDropdown/UnconfirmedDropdown";
import ConfirmedDropdown from "./Dropdowns/ConfirmedDropdown/ConfirmedDropdown";
import SavedDropdown from "./Dropdowns/SavedDropdown/SavedDropdown";
import AnnualReportApi from "../../../api/AnnualReportApi";
import Modal from "antd/lib/modal";
import {
    ExclamationCircleOutlined,
    StarFilled,
    StarOutlined,
} from "@ant-design/icons";
import notificationLogic from "../../../components/Notifications/Notification";
import {
    successfulDeleteAction,
    successfulEditAction,
    tryAgain,
} from "../../../components/Notifications/Messages";
import UserApi from "../../../api/UserApi";
import { Roles } from "../../../models/Roles/Roles";

interface props {
    columns: any;
    searchedData: any;
    sortKey: any;
}

export const CityAnnualReportTable = ({
    columns,
    searchedData,
    sortKey,
}: props) => {
    const history = useHistory();
    const [annualReport, setAnnualReport] = useState(Object);
    const [annualReports, setAnnualReports] = useState(Array());
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [isAdmin, setIsAdmin] = useState<boolean>();
    const [isCityAdmin, setIsCityAdmin] = useState<boolean>();
    const [canView, setCanView] = useState<boolean>();
    const [currentSearchedData, setCurrentSearchedData] = useState<string>();
    const [showUnconfirmedDropdown, setShowUnconfirmedDropdown] = useState<boolean>(false);
    const [showConfirmedDropdown, setShowConfirmedDropdown] = useState<boolean>(false);
    const [showSavedDropdown, setShowSavedDropdown] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authReport, setAuthReport] = useState(false);

    useEffect(() => {
        if (currentSearchedData !== searchedData) {
            setCurrentSearchedData(searchedData);
            setPage(1);
        }
        checkAccessToManage();
        fetchAnnualReports();
    }, [searchedData, page, pageSize, sortKey, authReport]);

    const fetchAnnualReports = async () => {
        setIsLoading(true);
        try {
            let response = await AnnualReportApi.getAll(
                searchedData,
                page,
                pageSize,
                sortKey,
                authReport
            );
            setAnnualReports(response.data.annualReports);
            setTotal(response.data.annualReports[0]?.total);
            setCount(response.data.annualReports[0]?.count);
        } catch (error) {
            showError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const showError = (message: string) => {
        Modal.error({
            title: "Помилка!",
            content: message,
        });
    };

    const hideDropdowns = () => {
        setShowUnconfirmedDropdown(false);
        setShowConfirmedDropdown(false);
        setShowSavedDropdown(false);
    };

    const checkAccessToManage = () => {
        let roles = UserApi.getActiveUserRoles();
        setIsAdmin(roles.includes(Roles.Admin));
        setIsCityAdmin(roles.includes(Roles.CityHead));
        setCanView(
            roles.includes(Roles.CityHead) ||
            roles.includes(Roles.CityHeadDeputy) ||
            roles.includes(Roles.OkrugaHead) ||
            roles.includes(Roles.OkrugaHeadDeputy) ||
            roles.includes(Roles.Admin)
        );
    };

    const showDropdown = (annualReportStatus: number) => {
        switch (annualReportStatus) {
            case 0:
                hideDropdowns();
                setShowUnconfirmedDropdown(true);
                break;
            case 1:
                hideDropdowns();
                setShowConfirmedDropdown(true);
                break;
            case 2:
                hideDropdowns();
                setShowSavedDropdown(true);
                break;
        }
    };

    const handleView = async (id: number) => {
        hideDropdowns();
        history.push(`/annualreport/cityAnnualReport/${id}`);
    };

    const handleEdit = (id: number) => {
        hideDropdowns();
        history.push(`/annualreport/edit/${id}`);
    };

    const handleConfirm = async (id: number) => {
        hideDropdowns();
        try {
            let response = await AnnualReportApi.confirm(id);
            let cityId = annualReports.find((item) => item.id === id)?.cityId;
            setAnnualReports(
                annualReports.map((item) => {
                    if (
                        item.id === id ||
                        (item.id !== id && item.cityId === cityId && item.status === 1)
                    ) {
                        item.status++;
                    }
                    return item;
                })
            );
            notificationLogic(
                "success",
                successfulEditAction("Річний звіт", response.data.name)
            );
        } catch (error) {
            notificationLogic("error", tryAgain);
        }
    };

    const handleRemove = async (id: number) => {
        hideDropdowns();
        try {
            Modal.confirm({
                title: "Ви дійсно хочете видалити річний звіт?",
                icon: <ExclamationCircleOutlined />,
                okText: "Так, видалити",
                okType: "danger",
                cancelText: "Скасувати",
                maskClosable: true,
                async onOk() {
                    let response = await AnnualReportApi.remove(id);
                    setAnnualReports(
                        annualReports?.filter((item) => item.id !== id)
                    );
                    notificationLogic(
                        "success",
                        successfulDeleteAction("Річний звіт", response.data.name)
                    );
                    setTotal(total - 1);
                    setCount(count - 1);
                },
            });
        } catch (error) {
            notificationLogic("error", tryAgain);
        }
    };

    const handleCancel = async (id: number) => {
        hideDropdowns();
        try {
            let response = await AnnualReportApi.cancel(id);
            setAnnualReports(
                annualReports.map((item) => {
                    if (item.id === id) {
                        item.status--;
                    }
                    return item;
                })
            );
            notificationLogic(
                "success",
                successfulEditAction("Річний звіт", response.data.name)
            );
        } catch (error) {
            notificationLogic("error", tryAgain);
        }
    };

    const handleViewPDF = async (id: number) => {
        hideDropdowns();
        try {
            const pdf = await AnnualReportApi.getPdf(id);
            window.open(pdf);
        } catch (error) {
            notificationLogic("error", tryAgain);
        }
    };

    const handlePageChange = (page: number) => {
        hideDropdowns();
        setPage(page);
    };

    const handleSizeChange = (page: number, pageSize: number = 10) => {
        hideDropdowns();
        setPage(page);
        setPageSize(pageSize);
    };

    return (
        <div>
            <div hidden={isLoading} className={"TableGeneralInfo"}>
                <p>
                    {count ? "Знайдено " + count + "/" + total + " результатів" : ""}
                </p>
                {isCityAdmin && !isAdmin ? (
                    <div className={"AuthReport"}>
                        <Tooltip
                            placement="topLeft"
                            title="Звіти в моєму розпорядженні"
                        >
                            <button
                                onClick={() => {
                                    setPage(1);
                                    setAuthReport(!authReport);
                                }}
                            >
                                {authReport ? <StarFilled /> : <StarOutlined />}
                            </button>
                        </Tooltip>
                    </div>
                ) : null}
            </div>
            <Table
                {...{ loading: isLoading }}
                locale={{
                    emptyText: (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="За вашим запитом нічого не знайдено"
                        />
                    ),
                }}
                bordered
                rowKey="id"
                columns={columns}
                scroll={{ x: 1300 }}
                dataSource={annualReports.map((item: any) => {
                    if (item.canManage && !isAdmin)
                        return {
                            ...item,
                            idView: (
                                <>
                                    {item.id}{" "}
                                    <text style={{ color: "#3c5438" }}>
                                        <Tooltip
                                            placement="topLeft"
                                            title="Звіт у моєму розпорядженні"
                                        >
                                            <StarOutlined />
                                        </Tooltip>
                                    </text>
                                </>
                            ),
                        };
                    else return { ...item, idView: <>{item.id}</> };
                })}
                onRow={(record) => {
                    return {
                        onDoubleClick: (event) => {
                            if (record.id && canView)
                                history.push(`/annualreport/cityAnnualReport/${record.id}`);
                        },
                        onClick: () => {
                            hideDropdowns();
                        },
                        onContextMenu: (event) => {
                            event.preventDefault();
                            if (canView) {
                                showDropdown(record.status);
                                setAnnualReport(record);
                                setX(event.pageX);
                                setY(event.pageY - 200);
                            } else {
                                hideDropdowns();
                            }
                        },
                    };
                }}
                onChange={(pagination) => {
                    if (pagination) {
                        window.scrollTo({
                            left: 0,
                            top: 0,
                            behavior: "smooth",
                        });
                    }
                }}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: count,
                    showLessItems: true,
                    responsive: true,
                    showSizeChanger: true,
                    onChange: (page) => handlePageChange(page),
                    onShowSizeChange: (page, size) =>
                        handleSizeChange(page, size),
                }}
            />
            <ClickAwayListener onClickAway={hideDropdowns}>
                <UnconfirmedDropdown
                    showDropdown={showUnconfirmedDropdown}
                    record={annualReport}
                    pageX={x}
                    pageY={y}
                    canManage={isAdmin!}
                    onView={handleView}
                    onViewPDF={handleViewPDF}
                    onEdit={handleEdit}
                    onConfirm={handleConfirm}
                    onRemove={handleRemove}
                />
                <ConfirmedDropdown
                    showDropdown={showConfirmedDropdown}
                    record={annualReport}
                    pageX={x}
                    pageY={y}
                    canManage={isAdmin!}
                    onView={handleView}
                    onViewPDF={handleViewPDF}
                    onCancel={handleCancel}
                />
                <SavedDropdown
                    showDropdown={showSavedDropdown}
                    record={annualReport}
                    pageX={x}
                    pageY={y}
                    onView={handleView}
                    onViewPDF={handleViewPDF}
                />
            </ClickAwayListener>
        </div>
    );
};
