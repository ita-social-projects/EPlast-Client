import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Form, Button, Row, Col } from 'antd';
import './ClubAnnualReportEdit.less';
import ClubAnnualReport from '../Interfaces/ClubAnnualReport';
import { editClubAnnualReport, getClubAnnualReportById} from '../../../api/clubsApi';
import { Typography, Input} from 'antd';
import { emptyInput, maxLength, successfulEditAction, tryAgain } from '../../../components/Notifications/Messages';
import moment from 'moment';
import notificationLogic from "../../../components/Notifications/Notification";


const { Title, Text } = Typography;
const { TextArea } = Input;

const ClubAnnualReportEdit = () => {
    const { id } = useParams();
    const history = useHistory();
    const [title] = useState<string>('Річний звіт куреня');
    const [clubAnnualReport, setClubAnnualReport] = useState<ClubAnnualReport>();
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        await fetchClubAnnualReport();
    }

    const fetchClubAnnualReport = async () => {
        try {
            let response = await getClubAnnualReportById(id);
            setClubAnnualReport(response.data.annualreport);
            form.setFieldsValue({
                clubName:response.data.annualreport.clubName,
                clubMembersSummary:response.data.annualreport.clubMembersSummary,
                clubContacts:response.data.annualreport.clubContacts,
                clubPage :response.data.annualreport.clubPage,
                kbUSPWishes :response.data.annualreport.kbUSPWishes,
                clubCenters :response.data.annualreport.clubCenters,
                clubEnteredMembersCount :response.data.annualreport.clubEnteredMembersCount,
                clubLeftMembersCount :response.data.annualreport.clubLeftMembersCount,
            });
        }
        catch (error) {
            notificationLogic("error", tryAgain);
            history.goBack(); 
        }
    }

    const handleFinish = async (obj: any) => {
        obj.date = moment();
        let annualReportEdited: ClubAnnualReport = Object.assign(clubAnnualReport, obj);
        try {
            let response = await editClubAnnualReport(annualReportEdited);
            notificationLogic('success', successfulEditAction('Річний звіт', response.data.name));
            history.goBack(); 
        }
        catch (error) {
            notificationLogic("error", tryAgain);
            history.goBack(); 
        }
    }

    return (
        <Form
            onFinish={handleFinish}
            className='annualreport-form'
            form={form} >
            <Title>{title}</Title>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Курінь</Text>
                    <Form.Item
                        name='clubName'
                        className='w100'>
                        {clubAnnualReport?.clubName}
                    </Form.Item>
                </Col>
                </Row>
                <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Провід куреня</Text>
                    <Form.Item
                        className='w100'
                        name='currentClubMembers'
                    >{(clubAnnualReport?.clubMembersSummary.split('\n').map((item, key) => {
                        return <span key={key}>{item}<br/></span>
                      }))}
                    </Form.Item>      
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Контакти:</Text>
                    {clubAnnualReport?.clubContacts}
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Сайт/сторінка в інтернеті:</Text>
                    <Form.Item
                        className='w100'
                        name='clubPage'>
                    {clubAnnualReport?.clubPage}
                    </Form.Item>
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Дані про членів куреня</Text>

                          <p>Дійсних членів куреня - {clubAnnualReport?.currentClubMembers}</p>
                          <p>Прихильників куреня - {clubAnnualReport?.currentClubFollowers}</p>
        
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>До куреня приєдналось за звітній період</Text>
                    <Form.Item
                            className='w100'
                            name='clubEnteredMembersCount'
                            rules={[{ required: true, message: emptyInput() },
                                { max: 7, message: maxLength(7) }]}>
                                    <Input  type="number" min="0" onKeyDown={ e => ( e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189 || e.keyCode===188) && e.preventDefault() }  />
                    </Form.Item>
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Вибули з куреня за звітній період</Text>
                    <Form.Item
                            className='w100'
                            name='clubLeftMembersCount'
                            rules={[{ required: true, message: emptyInput() },
                                { max: 7, message: maxLength(7) }]}>
                                    <Input  type="number" min="0"  onKeyDown={ e => ( e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189 || e.keyCode===188) && e.preventDefault() }  />
                    </Form.Item>
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Географія куреня. Осередки в Україні:</Text>
                    <Form.Item
                            className='w100'
                            name='clubCenters'
                            rules={[{ required: true, message: emptyInput() }, { max: 2000, message: maxLength(2000)}]} >
                            <TextArea />
                    </Form.Item>
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Вкажіть побажання до КБ УСП</Text>
                    <Form.Item
                            className='w100'
                            name='kbUSPWishes'
                            rules={[{ required: true, message: emptyInput() }, { max: 2000, message: maxLength(2000)}]} >
                            <TextArea />
                    </Form.Item>
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className='container'>
                    <Text strong={true}>Дата заповнення</Text>
                    <Form.Item
                        className='w100'
                        name='date'
                        >
                            {moment().format("DD.MM.YYYY")}
                    </Form.Item>
                </Col>
            </Row>
            
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

export default ClubAnnualReportEdit;