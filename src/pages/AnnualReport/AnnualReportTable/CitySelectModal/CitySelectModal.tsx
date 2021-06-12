import React, { useState, useEffect } from 'react';
import { Modal, Select, Form, Button, Row, Col } from 'antd';
import AnnualReportApi from '../../../../api/AnnualReportApi';
import { useHistory } from 'react-router-dom';
import './CitySelectModal.less'
import {emptyInput} from "../../../../components/Notifications/Messages"
import { LoadingOutlined } from '@ant-design/icons';

interface Props {
    visibleModal: boolean,
    handleOk: () => void,
}

const CitySelectModal = (props: Props) => {
    const { visibleModal, handleOk } = props;
    const history = useHistory();
    const [cityOptions, setCityOptions] = useState<any>();
    const [cities, setCities]=useState<any>();
    const [isLoadingCities, setIsLoadingCities]=useState<boolean>(false);


    const validationSchema = {
        city: [
            { required: true, message: emptyInput() }
        ],
    }

    useEffect(() => {
        fetchCities();
    }, [])

    const checkCreated = async (id: number) => {
        try {
            let response = await AnnualReportApi.checkCreated(id);
            if (response.data.hasCreated === true) {
                showError(response.data.message);
            }
            else {
                history.push(`/annualreport/create/${id}`)            }
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

    const fetchCities = async () => {
        setIsLoadingCities(true);
        try {
            let response = await AnnualReportApi.getCitiesOptions()
            setCities([].concat(response.data.cities));
            let cities = response.data.cities.map((item:any) => {
                return {
                    label: <>{item.name}<div 
                    hidden={!item.hasReport}
                    style={{float:"right", fontSize:"12px", marginTop:"2px", marginRight:"10px"}}>
                        Станиця вже має створений звіт
                        </div></>,
                    value: item.id,
                    disabled: item.hasReport
                }
            })
            setCityOptions(cities);
        }
        catch (error) {
            showError(error.message)
        }finally{setIsLoadingCities(false)}
    }

    return (
        <Modal
            title='Оберіть станицю для створення річного звіту'
            onCancel={handleOk}
            visible={visibleModal}
            footer={null} >
            <Form
                onFinish={(obj) => {
                    history.push(`/annualreport/create/${obj.cityId}`) }} >
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
                                placeholder={<span>Обрати станицю {isLoadingCities && <LoadingOutlined />}</span>}
                                filterOption={(input, option) =>
                                    (cities.find((x:any)=>x.id==option?.value).name as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
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