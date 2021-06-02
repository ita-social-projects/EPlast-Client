import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Form, Button, Modal, Row, Col, Tooltip } from 'antd';
import './AnnualReportCreate.less';
import AnnualReportForm from '../AnnualReportForm/AnnualReportForm';
import AnnualReportApi from '../../../api/AnnualReportApi';
import Spinner from "../../Spinner/Spinner";
import { CloseCircleOutlined } from '@ant-design/icons';

export const AnnualReportCreate = () => {
    const { cityId } = useParams();
    const history = useHistory();
    const [title, setTitle] = useState<string>('Річний звіт станиці');
    const [id, setId] = useState<number>();
    const [cityMembers, setCityMembers] = useState<any>();
    const [cityLegalStatuses, setCityLegalStatuses] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData(cityId);
    }, [])

    const fetchData = async (id: number) => {
        setIsLoading(true);
        try {
            await fetchCityInfo(id);
            await fetchLegalStatuses();
        } catch (error) {
            showError(error.message)
        } finally {
            setId(cityId);
            setIsLoading(false);
        }
    }

    const fetchCityInfo = async (id: number) => {
        try {
            let response = await AnnualReportApi.getCityMembers(id);
            let cityName = response.data.name;
            setTitle(title.concat(' ', cityName));
            setCityMembers(response.data.cityMembers.map((item: any) => {
                return {
                    label: String.prototype.concat(item.user.firstName, ' ', item.user.lastName),
                    value: item.user.id
                }
            }))
        }
        catch (error) {
            showError(error.message)
        }
    }

    const fetchLegalStatuses = async () => {
        try {
            let response = await AnnualReportApi.getCityLegalStatuses();
            setCityLegalStatuses((response.data.legalStatuses as []).map((item, index) => {
                return {
                    label: item,
                    value: index
                }
            }));
        }
        catch (error) {
            showError(error.message)
        }
    }

    const handleFinish = async (obj: any) => {
        obj.cityId = id;
        try {
            let response = await AnnualReportApi.create(obj);
            form.resetFields();
            showSuccess(response.data.message);
        }
        catch (error) {
            showError(error.message)
        }
    }

    const showSuccess = (message: string) => {
        Modal.success({
            content: message,
            onOk: () => { history.goBack(); }
        });
    }

    const showError = (message: string) => {
        Modal.error({
            title: 'Помилка!',
            content: message,
            onOk: () => { history.goBack(); }
        });
    }

    return (
        <>
            {isLoading ? <Spinner /> :
                <>
                    <div className="report-menu">
                        <Tooltip title="Скасувати створення звіту">
                            <div className="report-menu-item" onClick={() => history.goBack()}><CloseCircleOutlined /></div>
                        </Tooltip>
                    </div>
                    <Form
                        onFinish={handleFinish}
                        className='annualreport-form'
                        form={form} >
                        <AnnualReportForm
                            title={title}
                            cityMembers={cityMembers}
                            cityLegalStatuses={cityLegalStatuses} />
                        <Row
                            justify='center' >
                            <Col>
                                <Button
                                    loading={isLoading}
                                    type='primary'
                                    htmlType='submit'>
                                    Подати річний звіт
                        </Button>
                            </Col>
                        </Row>
                    </Form>
                </>}
        </>
    );
};

export default AnnualReportCreate;