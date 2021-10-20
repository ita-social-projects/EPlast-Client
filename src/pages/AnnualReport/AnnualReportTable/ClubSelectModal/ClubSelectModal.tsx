import React, { useState, useEffect } from "react";
import { Modal, Select, Form, Button, Row, Col } from "antd";
import clubsApi from "../../../../api/clubsApi";
import { useHistory } from "react-router-dom";
import "./ClubSelectModal.less";
import { emptyInput } from "../../../../components/Notifications/Messages";
import { LoadingOutlined } from "@ant-design/icons";

interface Props {
    visibleModal: boolean;
    handleOk: () => void;
}

const ClubSelectModal = (props: Props) => {
    const { visibleModal, handleOk } = props;
    const history = useHistory();
    const [clubOptions, setClubOptions] = useState<any>();
    const [clubs, setClubs] = useState<any>();
    const [isLoadingClubs, setIsLoadingClubs] = useState<boolean>(false);

    const validationSchema = {
        club: [{ required: true, message: emptyInput() }],
    };

    const fetchClubs = async () => {
        setIsLoadingClubs(true);
        try {
            let response = await clubsApi.getClubsOptions();
            setClubs(response.data);
            let clubs = response.data
                .filter((item: any) => {
                    return item.isActive;
                })
                .map((item: any) => {
                    return {
                        label: (
                            <>
                                {item.name}
                                <div
                                    hidden={!item.hasReport}
                                    className="clubCreatedReportStamp"
                                >
                                    Курінь вже має створений звіт
                                </div>
                            </>
                        ),
                        value: item.id,
                        disabled: item.hasReport,
                    };
                });
            setClubOptions(clubs);
        } catch (error) {
            showError(error.message);
        } finally {
            setIsLoadingClubs(false);
        }
    };

    const checkCreated = async (id: number) => {
        try {
            let response = await clubsApi.checkCreated(id);
            if (response.data.hasCreated === true) {
                showError(response.data.message);
            } else {
                history.push(`/annualreport/createClubAnnualReport/${id}`);
            }
        } catch (error) {
            showError(error.message);
        }
    };

    const showError = (message: string) => {
        Modal.error({
            title: "Помилка!",
            content: message,
        });
    };

    useEffect(() => {
        fetchClubs();
    }, []);

    return (
        <Modal
            title="Оберіть курінь для створення річного звіту"
            onCancel={handleOk}
            visible={visibleModal}
            footer={null}
        >
            <Form
                onFinish={(obj) => {
                    checkCreated(obj.clubId);
                }}
            >
                <Row>
                    <Col span={24}>
                        <Form.Item name="clubId" rules={validationSchema.club}>
                            <Select
                                showSearch
                                className=""
                                options={clubOptions}
                                placeholder={
                                    <span>
                                        Обрати курінь{" "}{isLoadingClubs && <LoadingOutlined />}
                                    </span>
                                }
                                filterOption={(input, option) =>
                                    (clubs.find(
                                        (x: any) => x.id == option?.value
                                    ).name as string)
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
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

export default ClubSelectModal;
