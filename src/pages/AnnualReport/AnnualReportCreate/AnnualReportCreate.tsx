import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { AxiosError } from 'axios'
import { Form, Button, Modal } from 'antd';
import styles from './AnnualReportCreate.module.css';
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
        if (cityId === undefined)
        {
            AnnualReportApi.getCities()
                .then(response => {
                    let cities = response.data.cities as City[];
                    setId(cities[0].id)
                    checkCreated(cities[0].id);
                })
                .catch((error: AxiosError) => {
                    showError(error.response?.data.message);
                });
        }
        else {
            setId(cityId);
            checkCreated(cityId);
        }
    }, [])

    const checkCreated = async (id: number) => {
        await AnnualReportApi.checkCreated(id)
            .then(response => {
                if (response.data.hasCreated === false) {
                    fetchData(id);
                }
                else {
                    showError(response.data.message);
                }
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            });
    }

    const fetchData = async (id: number) => {
        await fetchCityInfo(id);
        await fetchLegalStatuses();
    }

    const fetchCityInfo = async (id: number) => {
        await AnnualReportApi.getCityInfo(id)
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
        obj.cityId = id;
        await AnnualReportApi.create(obj)
            .then((response) => {
                form.resetFields();
                showSuccess(response.data.message);
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            })
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
                Подати річний звіт
            </Button>
        </Form>
    );
}

export default AnnualReportCreate;