import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Form, Button, Modal, Row, Col } from 'antd';
import './AnnualReportCreate.less';
import AnnualReportForm from '../AnnualReportForm/AnnualReportForm';
import AnnualReportApi from '../../../api/AnnualReportApi';
import User from '../Interfaces/User';
import City from '../Interfaces/City';

export const AnnualReportCreate = () => {
    const { cityId } = useParams();
    const history = useHistory();
    const [title, setTitle] = useState<string>('Річний звіт станиці');
    const [id, setId] = useState<number>();
    const [cityMembers, setCityMembers] = useState<any>();
    const [cityLegalStatuses, setCityLegalStatuses] = useState<any>();
    const [form] = Form.useForm();

    useEffect(() => {
        if (cityId === undefined) {
            fetchCity();
        }
        else {
            setId(cityId);
            checkCreated(cityId);
        }
    }, [])

    const fetchCity = async () => {
        try {
            let response = await AnnualReportApi.getCities();
            let cities = response.data.cities as City[];
            setId(cities[0].id)
            checkCreated(cities[0].id);
        }
        catch (error) {
            showError(error.message)
        }
    }

    const checkCreated = async (id: number) => {
        try {
            let response = await AnnualReportApi.checkCreated(id);
            if (response.data.hasCreated === false) {
                fetchData(id);
            }
            else {
                showError(response.data.message);
            }
        }
        catch (error) {
            showError(error.message)
        }
    }

    const fetchData = async (id: number) => {
        await fetchCityInfo(id);
        await fetchLegalStatuses();
    }

    const fetchCityInfo = async (id: number) => {
        try {
            let response = await AnnualReportApi.getCityInfo(id);
            let cityName = response.data.name;
            setTitle(title.concat(' ', cityName));
            setMembers((response.data.members as []).map((item: any) => item.user));
        }
        catch (error) {
            showError(error.message)
        }
    }

    const setMembers = (members: User[]) => {
        setCityMembers(members.map(item => {
            return {
                label: String.prototype.concat(item.firstName, ' ', item.lastName),
                value: item.id
            }
        }));
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
                        type='primary'
                        htmlType='submit'>
                        Подати річний звіт
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default AnnualReportCreate;