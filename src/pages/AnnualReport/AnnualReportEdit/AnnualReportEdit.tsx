import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { AxiosError } from 'axios'
import { Form, Button, Modal, Input } from 'antd';
import styles from './AnnualReportEdit.module.css';
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
        await AnnualReportApi.getById(id)
            .then(response => {
                response.data.annualreport.city = null;
                response.data.annualreport.cityManagement.cityAdminNew = null;
                cityId = response.data.annualreport.cityId;
                setAnnualReport(response.data.annualreport);
                form.setFieldsValue(response.data.annualreport);
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            })
    }

    const fetchCityInfo = async () => {
        await AnnualReportApi.getCityInfo(cityId)
            .then(response => {
                let cityName = response.data.name;
                setTitle(title.concat(' ', cityName));
                setMembers((response.data.members as []).map((item: any) => item.user));
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            })
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
        await AnnualReportApi.getCityLegalStatuses()
            .then(response => {
                setCityLegalStatuses((response.data.legalStatuses as []).map((item, index) => {
                    return {
                        label: item,
                        value: index
                    }
                }));
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            })
    }

    const handleFinish = async (obj: any) => {
        let membersStatistic = Object.assign(annualReport?.membersStatistic, obj.membersStatistic);
        let cityManagement = Object.assign(annualReport?.cityManagement, obj.cityManagement);
        let annualReportEdited: AnnualReport = Object.assign(annualReport, obj);
        annualReportEdited.membersStatistic = membersStatistic;
        annualReportEdited.cityManagement = cityManagement;
        await AnnualReportApi.edit(annualReportEdited)
            .then(response => {
                form.resetFields();
                showSuccess(response.data.message);
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            });
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
            className={styles.form}
            form={form} >
            <AnnualReportForm
                title={title}
                cityMembers={cityMembers}
                cityLegalStatuses={cityLegalStatuses} />
            <Button
                type='primary'
                htmlType='submit'>
                Редагувати
            </Button>
        </Form>
    );
}

export default AnnualReportEdit;