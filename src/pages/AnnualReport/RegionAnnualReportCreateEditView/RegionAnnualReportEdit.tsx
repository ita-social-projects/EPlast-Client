import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { Form, Button, Modal, Row, Col, Tooltip } from "antd";
import "./RegionAnnualReportCreate.less";
import Spinner from "../../Spinner/Spinner";
import RegionAnnualReportForm from "../RegionAnnualReportForm/RegionAnnualReportForm";
import regionsApi from "../../../api/regionsApi";
import { CloseCircleOutlined } from "@ant-design/icons";

export const RegionAnnualReportEdit = () => {
    const { annualreportId, year } = useParams();
    const history = useHistory();
    const [title, setTitle] = useState<string>("");
    const [regionId, setRegionId] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSaveChanges, setIsLoadingSaveChanges] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchRegionReports(annualreportId, year);
    }, []);

    const fetchRegionReports = async (annualreportId: number, year: number) => {
        setIsLoading(true);
        try {
            let response = await regionsApi.getReportById(annualreportId, year);
            setRegionId(response.data.regionId);

            setTitle(
                (response.data.regionName.includes("округ")
                    ? response.data.regionName
                    : response.data.regionName + " округа"
                ).concat(" " + year + " рік")
            );
            form.setFieldsValue(response.data);
        } catch (error) {
            showError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinish = async (obj: any) => {
        setIsLoadingSaveChanges(true);
        obj.regionId = regionId;
        try {
            let response = await regionsApi.editReport(annualreportId, obj);
            form.resetFields();
            showSuccess(response.data.message);
        } catch (error) {
            showError(error.message);
        } finally {
            setIsLoadingSaveChanges(false);
        }
    };

    const showSuccess = (message: string) => {
        Modal.success({
            content: message,
            onOk: () => {
                history.goBack();
            },
        });
    };

    const showError = (message: string) => {
        Modal.error({
            title: "Помилка!",
            content: message,
            onOk: () => {
                history.goBack();
            },
        });
    };

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <div className="report-menu">
                        <Tooltip title="Скасувати редагування звіту">
                            <div
                                className="report-menu-item"
                                onClick={() => history.goBack()}
                            >
                                <CloseCircleOutlined />
                            </div>
                        </Tooltip>
                    </div>
                    <Form
                        onFinish={handleFinish}
                        className="annualreport-form"
                        form={form}
                    >
                        <RegionAnnualReportForm
                            title={title}
                            regionId={regionId}
                            year={year}
                        />
                        <Row justify="center">
                            <Col>
                                <Button
                                    loading={isLoadingSaveChanges}
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Зберегти зміни
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </>
            )}
        </>
    );
};

export default RegionAnnualReportEdit;
