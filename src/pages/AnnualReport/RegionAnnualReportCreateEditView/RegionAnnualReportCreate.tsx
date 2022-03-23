import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { Form, Button, Modal, Row, Col, Tooltip } from "antd";
import "./RegionAnnualReportCreate.less";
import Spinner from "../../Spinner/Spinner";
import RegionAnnualReportForm from "../RegionAnnualReportForm/RegionAnnualReportForm";
import regionsApi from "../../../api/regionsApi";
import { CloseCircleOutlined } from "@ant-design/icons";

export const RegionAnnualReportCreate = () => {
  const { regionId, year } = useParams();
  const history = useHistory();
  const [title, setTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData(regionId);
  }, []);

  const fetchData = async (id: number) => {
    setIsLoading(true);
    try {
      await fetchRegions(regionId);
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegions = async (id: number) => {
    try {
      let response = await regionsApi.getRegionById(id).then((response) => {
        return response.data;
      });
      setTitle(
        (response.regionName.includes("округ")
          ? response.regionName
          : response.regionName + " округа"
        ).concat(" " + year + " рік")
      );
    } catch (error) {
      showError(error.message);
    }
  };

  const handleFinish = async (obj: any) => {
    setIsLoadingSave(true);
    obj.regionId = regionId;
    try {
      let response = await regionsApi.createRegionAnnualReport(
        regionId,
        year,
        obj
      );
      form.resetFields();
      showSuccess(response.data.message);
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoadingSave(false);
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
            <Tooltip title="Скасувати створення звіту">
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
                  loading={isLoadingSave}
                  type="primary"
                  htmlType="submit"
                >
                  Подати річний звіт
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </>
  );
};

export default RegionAnnualReportCreate;
