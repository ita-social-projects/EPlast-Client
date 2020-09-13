import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Form, Button, Modal, Row, Col } from 'antd';
import './AnnualReportEdit.less';
import AnnualReportForm from '../AnnualReportForm/AnnualReportForm';
import AnnualReportApi from '../../../api/AnnualReportApi';
import AnnualReport from '../Interfaces/AnnualReport';
import User from '../Interfaces/User';

const AnnualReportEdit = () => {
    const { id } = useParams();
    const history = useHistory();
    const [title, setTitle] = useState<string>('Річний звіт станиці');
    const [cityMembers, setCityMembers] = useState<any>();
    const [cityLegalStatuses, setCityLegalStatuses] = useState<any>();
    const [annualReport, setAnnualReport] = useState<AnnualReport>()
    const [form] = Form.useForm();

    let cityId: number;

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        await fetchAnnualReport();
        await fetchCityInfo();
        await fetchLegalStatuses();
    }

    const fetchAnnualReport = async () => {
        try {
            let response = await AnnualReportApi.getById(id);
            response.data.annualreport.city = null;
            response.data.annualreport.newCityAdmin = null;
            cityId = response.data.annualreport.cityId;
            setAnnualReport(response.data.annualreport);
            form.setFieldsValue(response.data.annualreport);
        }
        catch (error) {
            showError(error.message)
        }
    }

    const fetchCityInfo = async () => {
        try {
            let response = await AnnualReportApi.getCityInfo(cityId);
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
        let membersStatistic = Object.assign(annualReport?.membersStatistic, obj.membersStatistic);
        let annualReportEdited: AnnualReport = Object.assign(annualReport, obj);
        annualReportEdited.membersStatistic = membersStatistic;
        try {
            let response = await AnnualReportApi.edit(annualReportEdited);
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
            <Row justify='center'>
                <Col>
                    <Button
                        type='primary'
                        htmlType='submit'>
                        Редагувати
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default AnnualReportEdit;