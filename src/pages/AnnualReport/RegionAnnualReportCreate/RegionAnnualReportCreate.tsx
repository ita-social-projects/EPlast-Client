import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Form, Button, Modal, Row, Col } from 'antd';
import './RegionAnnualReportCreate.less';
import AnnualReportApi from '../../../api/AnnualReportApi';
import Spinner from "../../Spinner/Spinner";
import RegionAnnualReportForm from '../RegionAnnualReportForm/RegionAnnualReportForm';
import regionsApi from '../../../api/regionsApi';

export const RegionAnnualReportCreate = () => {
    const { regionId } = useParams();
    const history = useHistory();
    const [title, setTitle] = useState<string>('Річний звіт округи');
    const [isLoading, setIsLoading]=useState(false);
    const [region, setRegion] = useState<any[]>();
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData(regionId);
    }, [])

    const fetchData = async (id: number) => {
        setIsLoading(true);
        try {
            await fetchRegions(regionId);
        }catch (error) {
            showError(error.message)
        }finally {
            setIsLoading(false);
        }
    }

    const fetchRegionInfo = async (id: number) => {
        try {
            let response = await AnnualReportApi.getCityMembers(id);
            let cityName = response.data.name;
            setTitle(title.concat(' ', cityName));
        }
        catch (error) {
            showError(error.message)
        }
    }

    const fetchRegions = async (id: number) => {
        await regionsApi.getRegionById(id).then(response => {
            setRegion(response.data);
        });
        try {
            let response = await regionsApi.getRegionById(id).then(response => {
                return response.data;
            });
            setTitle(title.concat(' ', response.regionName));
        }
        catch (error) {
            showError(error.message)
        }
    }

    const handleFinish = async (obj: any) => {
        obj.regionId = regionId;
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
            {isLoading? <Spinner/> : <Form
                onFinish={handleFinish}
                className='annualreport-form'
                form={form} >
                <RegionAnnualReportForm
                    title={title}
                    regionId={regionId}
                    year={2021}
                     />
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
            </Form>}
        </>
    );
};

export default RegionAnnualReportCreate;