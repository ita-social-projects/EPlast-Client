import React, { useEffect, useState } from "react";
import { Empty, Modal, Table, Tooltip } from "antd";
import {
    cancelClubAnnualReport,
    confirmClubAnnualReport,
    getSearchedClubAnnualReports,
    removeClubAnnualReport,
} from "../../../api/clubsApi";
import ClickAwayListener from "react-click-away-listener";
import UnconfirmedDropdown from "./DropdownsForClubAnnualReports/UnconfirmedDropdown/UnconfirmedDropdown";
import ConfirmedDropdown from "./DropdownsForClubAnnualReports/ConfirmedDropdown/ConfirmedDropdown";
import SavedDropdown from "./DropdownsForClubAnnualReports/SavedDropdown/SavedDropdown";
import {
    successfulConfirmedAction,
    successfulDeleteAction,
    successfulUpdateAction,
    tryAgain,
} from "../../../components/Notifications/Messages";
import notificationLogic from "../../../components/Notifications/Notification";
import { useHistory } from "react-router-dom";
import {
    ExclamationCircleOutlined,
    StarFilled,
    StarOutlined,
} from "@ant-design/icons";
import UserApi from "../../../api/UserApi";
import { Roles } from "../../../models/Roles/Roles";

interface props {
    columns: any;
    searchedData: any;
    sortKey: any;
}

export const ClubAnnualReportTable = ({
    columns,
    searchedData,
    sortKey,
}: props) => {
    const history = useHistory();
    const [clubAnnualReport, setClubAnnualReport] = useState(Object);
    const [clubAnnualReports, setClubAnnualReports] = useState(Array());
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [currentSearchedData, setCurrentSearchedData] = useState<string>();
    const [showUnconfirmedDropdown, setShowUnconfirmedDropdown] = useState<boolean>(false);
    const [showConfirmedDropdown, setShowConfirmedDropdown] = useState<boolean>(false);
    const [showSavedDropdown, setShowSavedDropdown] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isClubAdmin, setIsClubAdmin] = useState<boolean>();
    const [canView, setCanView] = useState<boolean>();
    const [isLoading, setIsLoading] = useState(false);
    const [authReport, setAuthReport] = useState(false);

    useEffect(() => {
        if (currentSearchedData != searchedData) {
            setCurrentSearchedData(searchedData);
            setPage(1);
        }
        fetchClubAnnualReports();
        checkAccessToManage();
    }, [searchedData, page, pageSize, sortKey, authReport]);

    const fetchClubAnnualReports = async () => {
        setIsLoading(true);
        try {
            let response = await getSearchedClubAnnualReports(
                searchedData,
                page,
                pageSize,
                sortKey,
                authReport
            );
            setClubAnnualReports(response.data.clubAnnualReports);
            setTotal(response.data.clubAnnualReports[0]?.total);
            setCount(response.data.clubAnnualReports[0]?.count);
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

    const checkAccessToManage = () => {
        let roles = UserApi.getActiveUserRoles();
        setIsAdmin(roles.includes(Roles.Admin));
        setIsClubAdmin(roles.includes(Roles.KurinHead));
        setCanView(
            roles.includes(Roles.CityHead) ||
            roles.includes(Roles.CityHeadDeputy) ||
            roles.includes(Roles.OkrugaHead) ||
            roles.includes(Roles.OkrugaHeadDeputy) ||
            roles.includes(Roles.Admin)
        );
    };

    const hideDropdowns = () => {
        setShowUnconfirmedDropdown(false);
        setShowConfirmedDropdown(false);
        setShowSavedDropdown(false);
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

    const renewPage = () => {
        window.location.reload(false);
    };

    const handleView = async (id: number) => {
        hideDropdowns();
        history.push(`/annualreport/clubAnnualReport/${id}`);
    };

    const handleCancel = async (id: number) => {
        hideDropdowns();
        try {
            let response = await cancelClubAnnualReport(id);
            setClubAnnualReports(
                clubAnnualReports?.filter((item) => item.id !== id)
            );
            notificationLogic(
                "success",
                successfulUpdateAction("Річний звіт", response.data.name)
            );
            renewPage();
        } catch (error) {
            if (error.response?.status === 400) {
                notificationLogic("error", tryAgain);
                history.goBack();
            }
        }
    };

    const handleConfirm = async (id: number) => {
        hideDropdowns();
        try {
            let response = await confirmClubAnnualReport(id);
            setClubAnnualReports(
                clubAnnualReports.map((item) => {
                    if (
                        item.id === id ||
                        (item.id !== id && item.clubId === response.data.clubId && item.status === 1)
                    ) {
                        item.status++;
                    }
                    return item;
                })
            );
            notificationLogic(
                "success",
                successfulConfirmedAction("Річний звіт", response.data.name)
            );
            renewPage();
        } catch (error) {
            notificationLogic("error", tryAgain);
            history.goBack();
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
                    let response = await removeClubAnnualReport(id);
                    setClubAnnualReports(clubAnnualReports?.filter((item) => item.id !== id));
                    notificationLogic(
                        "success",
                        successfulDeleteAction("Річний звіт", response.data.name)
                    );
                    renewPage();
                },
            });
        } catch (error) {
            notificationLogic("error", tryAgain);
            history.goBack();
        }
    };

    const handleEdit = (id: number) => {
        hideDropdowns();
        history.push(`/club/editClubAnnualReport/${id}`);
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
                {isClubAdmin ? (
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
                dataSource={clubAnnualReports.map((item: any) => {
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
                            if (record.id && (canView || record.canManage))
                                history.push(`/annualreport/clubAnnualReport/${record.id}`);
                        },
                        onClick: () => {
                            hideDropdowns();
                        },
                        onContextMenu: (event) => {
                            event.preventDefault();
                            if (record.id && (canView || record.canManage)) {
                                showDropdown(record.status);
                                setClubAnnualReport(record);
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
                    record={clubAnnualReport}
                    pageX={x}
                    pageY={y}
                    canManage={isAdmin}
                    onView={handleView}
                    onEdit={handleEdit}
                    onConfirm={handleConfirm}
                    onRemove={handleRemove}
                />
                <ConfirmedDropdown
                    showDropdown={showConfirmedDropdown}
                    record={clubAnnualReport}
                    pageX={x}
                    pageY={y}
                    canManage={isAdmin}
                    onView={handleView}
                    onCancel={handleCancel}
                />
                <SavedDropdown
                    showDropdown={showSavedDropdown}
                    record={clubAnnualReport}
                    pageX={x}
                    pageY={y}
                    onView={handleView}
                />
            </ClickAwayListener>
        </div>
    );
};
