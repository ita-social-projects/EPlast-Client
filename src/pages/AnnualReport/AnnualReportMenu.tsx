import React, { useEffect, useState } from "react";
import "./AnnualReportMenu.less";
import { Tooltip } from "antd";
import {
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    FileDoneOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { tryAgain } from "../../components/Notifications/Messages";
import notificationLogic from "../../components/Notifications/Notification";

interface Props {
    record: {
        id: number;
        status: number;
        canManage: boolean;
    };
    isAdmin: boolean;
    ViewPDF: boolean;
    status: number;
    handleViewPDF?: (id: number) => Promise<void>;
    setStatus: (status: number) => void;
    handleEdit: (id: number) => void;
    handleConfirm: (id: number) => Promise<void>;
    handleCancel: (id: number) => Promise<void>;
    handleRemove: (id: number) => Promise<void>;
}

const AnnualReportMenu = (props: Props) => {
    const {
        record,
        isAdmin,
        ViewPDF,
        status,
        handleViewPDF,
        handleEdit,
        handleConfirm,
        handleCancel,
        handleRemove,
    } = props;
    const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
    const [isLoadingCancel, setIsLoadingCancel] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const history = useHistory();

    useEffect(() => { }, [status]);

    const Confirm = async () => {
        setIsLoadingConfirm(true);
        try {
            handleConfirm(record.id);
        } catch (error) {
            notificationLogic("error", tryAgain);
        } finally {
            setIsLoadingConfirm(false);
        }
    };

    const Cancel = async () => {
        setIsLoadingCancel(true);
        try {
            handleCancel(record.id);
        } catch (error) {
            notificationLogic("error", tryAgain);
        } finally {
            setIsLoadingCancel(false);
        }
    };

    const Remove = async () => {
        setIsLoadingDelete(true);
        try {
            handleRemove(record.id);
        } catch (error) {
            notificationLogic("error", tryAgain);
        } finally {
            setIsLoadingDelete(false);
        }
    };

    return (
        <div className="report-menu">
            <Tooltip title="Закрити звіт">
                <div
                    className="report-menu-item"
                    onClick={() => history.goBack()}
                >
                    <CloseCircleOutlined />
                </div>
            </Tooltip>
            {ViewPDF && (
                <Tooltip title="Переглянути у форматі PDF">
                    <div
                        className="report-menu-item"
                        onClick={() =>
                            handleViewPDF ? handleViewPDF(record.id) : null
                        }
                    >
                        <FilePdfOutlined />
                    </div>
                </Tooltip>
            )}
            {status == 0 && (record.canManage || isAdmin) && (
                <Tooltip title="Редагувати звіт">
                    <div
                        className="report-menu-item"
                        onClick={() => handleEdit(record.id)}
                    >
                        <EditOutlined />
                    </div>
                </Tooltip>
            )}
            {status == 0 && isAdmin && (
                <Tooltip title="Підтвердити звіт">
                    <div className="report-menu-item" onClick={Confirm}>
                        {isLoadingConfirm ? (<LoadingOutlined />) : (<FileDoneOutlined />)}
                    </div>
                </Tooltip>
            )}
            {status == 1 && isAdmin && (
                <Tooltip title="Скасувати звіт">
                    <div className="report-menu-item" onClick={Cancel}>
                        {isLoadingCancel ? (<LoadingOutlined />) : (<FileExcelOutlined />)}
                    </div>
                </Tooltip>
            )}
            {status == 0 && isAdmin && (
                <Tooltip title="Видалити звіт">
                    <div className="report-menu-item" onClick={Remove}>
                        {isLoadingDelete ? (<LoadingOutlined />) : (<DeleteOutlined />)}
                    </div>
                </Tooltip>
            )}
        </div>
    );
};

export default AnnualReportMenu;
