import React, { useState, useEffect } from "react";
import { Modal, Select, Form, Button, Row, Col, Tooltip } from "antd";
import { useHistory } from "react-router-dom";
import "./RegionSelectModal.less";
import { emptyInput } from "../../../../components/Notifications/Messages";
import regionsApi from "../../../../api/regionsApi";
import { ClearOutlined, LoadingOutlined } from "@ant-design/icons";

interface Props {
    visibleModal: boolean;
    handleOk: () => void;
}

const RegionSelectModal = (props: Props) => {
    const { visibleModal, handleOk } = props;
    const history = useHistory();
    const [isLoadingRegions, setIsLoadingRegions] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [years, setYears] = useState<any>();
    const [regions, setRegions] = useState<
        {
            id: "";
            name: "";
            yearsHasReport: number[];
            isActive: true;
        }[]
    >();
    const [year, setYear] = useState<number>(0);
    const [region, setRegion] = useState<any>(0);

    const validationSchema = {
        region: [{ required: true, message: emptyInput() }],
        year: [{ required: true, message: emptyInput() }],
    };

    useEffect(() => {
        fetchRegions();
        fechYears();
    }, []);

    const fechYears = async () => {
        try {
            const arrayOfYears = [];
            const currentYear: number = new Date().getFullYear();
            for (let i = 2000; i <= currentYear; i++) {
                arrayOfYears.push({ lable: i.toString(), value: i });
            }
            setYears(arrayOfYears);
        } catch (error) {
            showError(error.message);
        }
    };

    const fetchRegions = async () => {
        setIsLoadingRegions(true);
        try {
            let response = await regionsApi.getAccessableRegions();
            let tempRegions = response.data.regions.map((item: any) => {
                return {
                    id: item.id,
                    name: item.regionName,
                    yearsHasReport: item.yearsHasReport,
                    isActive: item.isActive,
                };
            });
            setRegions(tempRegions);
        } catch (error) {
            showError(error.message);
        } finally {
            setIsLoadingRegions(false);
        }
    };

    const onYearSelect = async (year: any) => {
        if (region == 0) {
            form.resetFields(["region"]);
            setYear(year);
        }
    };

    const onRegionSelect = async (regionId: any) => {
        if (year == 0) {
            form.resetFields(["year"]);
            setRegion(regions?.find((x: any) => x.id == regionId));
        }
    };

    const onFormClear = () => {
        form.resetFields();
        setYear(0);
        setRegion(0);
    };

    const showError = (message: string) => {
        Modal.error({
            title: "Помилка!",
            content: message,
        });
    };

    return (
        <Modal
            title="Оберіть округу та рік для створення річного звіту"
            onCancel={handleOk}
            visible={visibleModal}
            footer={null}
        >
            <Form
                form={form}
                onFinish={(obj) => {
                    history.push(`/annualreport/region/create/${obj.region}/${obj.year}`);
                }}
            >
                <Row>
                    <Row>
                        <Tooltip title={"Очистити"}>
                            <ClearOutlined
                                onClick={onFormClear}
                                className="regionSelectModalClearOutlined"
                            />
                        </Tooltip>
                    </Row>
                    <Col md={24} xs={24}>
                        <Form.Item
                            name="region"
                            rules={validationSchema.region}
                        >
                            <Select
                                showSearch
                                placeholder={
                                    <span>
                                        Обрати округу{" "}
                                        {isLoadingRegions && (
                                            <LoadingOutlined />
                                        )}
                                    </span>
                                }
                                onSelect={onRegionSelect}
                                options={regions
                                    ?.filter((item: any) => {
                                        return item.isActive;
                                    })
                                    .map((item: any) => {
                                        return {
                                            label: (
                                                <>
                                                    {item.name}
                                                    <div
                                                        hidden={!item.yearsHasReport?.includes(year)}
                                                        className="regionSelectModalStamp"
                                                    >
                                                        Округа вже має звіт за{" "}{year} рік
                                                    </div>
                                                </>
                                            ),
                                            value: item.id,
                                            disabled: item.yearsHasReport?.includes(year),
                                        };
                                    })}
                                filterOption={(input, option) =>
                                    (regions?.find((x: any) => x.id == option?.value)?.name as string)
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col md={24} xs={24}>
                        <Form.Item name="year" rules={validationSchema.year}>
                            <Select
                                showSearch
                                onSelect={onYearSelect}
                                options={years?.map((item: any) => {
                                    return {
                                        label: (
                                            <>
                                                {item.lable}
                                                <div
                                                    hidden={
                                                        !region?.yearsHasReport?.includes(
                                                            item.value
                                                        )
                                                    }
                                                    className="regionSelectModalStamp"
                                                >
                                                    {region.name} округа вже має звіт за цей рік
                                                </div>
                                            </>
                                        ),
                                        value: item.value,
                                        disabled: region?.yearsHasReport?.includes(item.value),
                                    };
                                })}
                                filterOption={(input, option) =>
                                    (years?.find((x: any) => x.value == option?.value)?.lable as string)
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                placeholder="Обрати рік"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="center">
                    <Col>
                        <Button type="primary" htmlType="submit">
                            Створити річний звіт
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default RegionSelectModal;
