import React, { useState, useEffect } from 'react';
import { Modal, Select, Form, Button, Row, Col } from 'antd';
import AnnualReportApi from '../../../../api/AnnualReportApi';
import City from '../../Interfaces/City';
import { useHistory } from 'react-router-dom';
import './CitySelectModal.less'
import {emptyInput} from "../../../../components/Notifications/Messages"

interface Props {
    visibleModal: boolean,
    handleOk: () => void,
}

const CitySelectModal = (props: Props) => {
    const { visibleModal, handleOk } = props;
    const history = useHistory();
    const [cityOptions, setCityOptions] = useState<any>();

    const validationSchema = {
        city: [
            { required: true, message: emptyInput() }
        ],
    }

    useEffect(() => {
        fetchCities();
    }, [])

    const fetchCities = async () => {
        try {
            let response = await AnnualReportApi.getCities();
            let cities = response.data.cities as City[];
            setCityOptions(cities.map(item => {
                return {
                    label: item.name,
                    value: item.id
                }
            }));
        }
        catch (error) {

        }
    }

    return (
        <Modal
            title='Оберіть станицю для створення річного звіту'
            onCancel={handleOk}
            visible={visibleModal}
            footer={null} >
            <Form
                onFinish={(obj) => { history.push(`/annualreport/create/${obj.cityId}`) }} >
                <Row>
                    <Col
                        span={24} >
                        <Form.Item
                            name='cityId'
                            rules={validationSchema.city} >
                            <Select
                                showSearch
                                className=''
                                options={cityOptions}
                                placeholder='Обрати станицю'
                                filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                                } />
                        </Form.Item>
                    </Col>
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

export default CitySelectModal;