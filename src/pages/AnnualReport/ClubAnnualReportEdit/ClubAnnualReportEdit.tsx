import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link, useHistory } from 'react-router-dom';
import { Form, Button, Row, Col, Tooltip, Modal } from 'antd';
import './ClubAnnualReportEdit.less';
import ClubAnnualReport from '../Interfaces/ClubAnnualReport';
import { editClubAnnualReport, getClubAnnualReportById, getClubById } from '../../../api/clubsApi';
import { Typography } from 'antd';
import {
    successfulEditAction,
    tryAgain
} from '../../../components/Notifications/Messages';
import moment from 'moment';
import notificationLogic from "../../../components/Notifications/Notification";
import Spinner from "../../Spinner/Spinner";
import { CloseCircleOutlined } from '@ant-design/icons';
import AuthStore from '../../../stores/AuthStore';
import jwt from "jwt-decode";
import ClubAdmin from '../../../models/Club/ClubAdmin';
import ClubMember from '../../../models/Club/ClubMember';
import ClubAnnualReportForm from '../ClubAnnualReportForm/ClubAnnualReportForm';
import UserApi from '../../../api/UserApi';


const { Title } = Typography;

const ClubAnnualReportEdit = () => {
    const { id } = useParams();
    const history = useHistory();
    const [clubAnnualReport, setClubAnnualReport] = useState<ClubAnnualReport>();
    const [admins, setAdmins] = useState<ClubAdmin[]>([]);
    const [members, setClubMembers] = useState<ClubMember[]>([]);
    const [followers, setFollowers] = useState<ClubMember[]>([]);
    const [club, setClub] = useState<any>({
        id: 0,
        name: "",
        description: "",
        clubURL: "",
        email: "",
    });
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingSaveChanges, setIsLoadingSaveChanges]=useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        await fetchClubAnnualReport();
    }

    const fetchClubAnnualReport = async () => {
        setIsLoading(true)
        try {
            let token = AuthStore.getToken() as string;
            let roles = UserApi.getActiveUserRoles();
            let response = await getClubAnnualReportById(id);

            let club = await getClubById(response.data.annualreport.clubId);
            setClub(club.data);

            setAdmins(club.data.administration.filter((a: any) => a != null));

            setClubMembers(club.data.members);

            setFollowers(club.data.followers);

            const user: any = jwt(token);
            if (!((roles.includes("Admin") ||
                (roles.includes("Голова Куреня") && club.data.head?.userId == user.nameid))
                && response.data.annualreport.status == 0)) { showError('Немає доступу до редагування звіту.'); }
            else {
                setClubAnnualReport(response.data.annualreport);
                form.setFieldsValue(response.data.annualreport);
            }
        }
        catch (error) {
            notificationLogic("error", tryAgain);
            history.goBack();
        } finally {
            setIsLoading(false);
        }
    }

    const showError = (message: string) => {
        Modal.error({
            title: 'Помилка!',
            content: message,
            onOk: () => { history.goBack(); }
        });
    }

    const handleFinish = async (obj: any) => {
        setIsLoadingSaveChanges(true);
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
        }finally{setIsLoadingSaveChanges(false);}
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
                        <Title
                            className='textCenter'
                            level={3} >
                            {`Річний звіт куреня ${club.name} за 
                    ${moment(club.date).year()} рік`}</Title>
                        <Link className="LinkText" style={{ fontSize: "14px" }} to={"/clubs/" + club.id} target="blank">Перейти на профіль куреня {club.name}</Link>
                        <br />
                        <br />
                        <ClubAnnualReportForm
                            club={club}
                            admins={admins}
                            members={members}
                            followers={followers} />

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
                    </Form>
                </>}
        </>
    );
}

export default ClubAnnualReportEdit;