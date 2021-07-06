import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Form, Button, Modal, Row, Col, Tooltip } from 'antd';
import './AnnualReportEdit.less';
import AnnualReportForm from '../AnnualReportForm/AnnualReportForm';
import AnnualReportApi from '../../../api/AnnualReportApi';
import AnnualReport from '../Interfaces/AnnualReport';
import Spinner from "../../Spinner/Spinner";
import { CloseCircleOutlined } from '@ant-design/icons';

const AnnualReportEdit = () => {
    const { id } = useParams();
    const history = useHistory();
    const [title, setTitle] = useState<string>('Річний звіт станиці');
    const [cityMembers, setCityMembers] = useState<any>();
    const [cityLegalStatuses, setCityLegalStatuses] = useState<any>();
    const [annualReport, setAnnualReport] = useState<AnnualReport>()
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSaveChanges, setIsLoadingSaveChanges]=useState(false);
    const [form] = Form.useForm();

    let cityId: number;

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        setIsLoading(true);
        try {
            await fetchAnnualReport();
            await fetchLegalStatuses();
        } catch (error) {
            showError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchAnnualReport = async () => {
        try {
            let annualreport = await AnnualReportApi.getAnnualReportEditFormById(id)
                .then((response) => { return response.data.annualReport as AnnualReport });
            if (annualreport.city) {
                setTitle(title.concat(' ', annualreport.city.name));
                setCityMembers((annualreport.city.cityMembers as []).map((item: any) => {
                    return {
                        label: String.prototype.concat(item.user.firstName, ' ', item.user.lastName),
                        value: item.user.id
                    }
                }));
            }
            annualreport.city = null;
            annualreport.newCityAdmin = null;
            cityId = annualreport.cityId;
            setAnnualReport(annualreport);
            form.setFieldsValue(annualreport);
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
        setIsLoadingSaveChanges(true);
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
        }finally{setIsLoadingSaveChanges(false);}
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
                        <Tooltip title="Скасувати редагування звіту">
                            <div className="report-menu-item" onClick={() => history.goBack()}><CloseCircleOutlined /></div>
                        </Tooltip>
                    </div>
                    <Form
                        onFinish={handleFinish}
                        className='annualreport-form'
                        form={form} >
                        <Row>
                            <Col>
                                <AnnualReportForm
                                    title={title}
                                    cityMembers={cityMembers}
                                    cityLegalStatuses={cityLegalStatuses} />
                                <Row justify='center'>
                                    <Col>
                                        <Button
                                            loading={isLoadingSaveChanges}
                                            type='primary'
                                            htmlType='submit'>
                                            Зберегти зміни
                            </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </>
            }
        </>
    );
};

export default AnnualReportEdit;
