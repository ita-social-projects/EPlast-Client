import React, { useState, useEffect } from 'react';
import { Modal, Select, Form, Button, Row, Col } from 'antd';
import { useHistory } from 'react-router-dom';
import './RegionSelectModal.less'
import { emptyInput } from "../../../../components/Notifications/Messages"
import regionsApi from '../../../../api/regionsApi';

interface Props {
    visibleModal: boolean,
    handleOk: () => void,
}

const RegionSelectModal = (props: Props) => {
    const { visibleModal, handleOk } = props;
    const history = useHistory();
    const [years, setYears] = useState<any>();
    const [regions, setRegions] = useState<any[]>([{
        id: '',
        regionName: ''
    }]);

    const validationSchema = {
        region: [
            { required: true, message: emptyInput() }
        ],
        year: [
            { required: true, message: emptyInput() }
        ],
    }

    useEffect(() => {
        fetchRegions();
        fechYears();
    }, [])

    const fechYears = async () => {
        try {
            const arrayOfYears = [];
            const currentYear: number = new Date().getFullYear();
            for (let i = 2000; i <= currentYear; i++) {
                arrayOfYears.push({ lable: i.toString(), value: i });
            }
            setYears(arrayOfYears);
        }
        catch (error) {
            showError(error.message);
        }
    }

    const fetchRegions = async () => {
        try {
            let response = await regionsApi.GetAllRegions()
            let tempRegions = response.data.map((item:any) => {
                return {
                    label: item.regionName,
                    value: item.id
                }
            })
            setRegions(tempRegions);
        }
        catch (error) {
            showError(error.message)
        }
    }

    const showError = (message: string) => {
        Modal.error({
            title: 'Помилка!',
            content: message
        });
    }

    return (
        <Modal
            title='Оберіть округу та рік для створення річного звіту'
            onCancel={handleOk}
            visible={visibleModal}
            footer={null} >
            <Form
                onFinish={(obj) => {
                    history.push(`/annualreport/createRegionAnnualReport/${obj.regionId}`);
                }} >
                <Row>
                    <Col md={24} xs={24} >
                        <Form.Item
                            name='regionId'
                            rules={validationSchema.region} >
                            <Select
                                showSearch
                                className=''
                                options={regions}
                                placeholder='Обрати округу'
                                filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                                } />
                        </Form.Item>
                    </Col>
                    <Col md={24} xs={24}>
                        <Form.Item
                            name="year"
                            rules={validationSchema.year}>
                            <Select
                                showSearch
                                className=''
                                options={years}
                                placeholder="Обрати рік"
                                filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            />
                        </Form.Item></Col>
                </Row>
                <Row justify='center'>
                    <Col>
                        <Button
                            type='primary'
                            htmlType='submit' >
                            Створити річний звіт
                    </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default RegionSelectModal;