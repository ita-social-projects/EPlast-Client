import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Form, Button, Row, Col, Typography, Tooltip, Modal } from 'antd';
import './ClubAnnualReportCreate.less';
import { getClubMembersInfo, createClubAnnualReport, checkCreated } from '../../../api/clubsApi';
import moment from 'moment';
import ClubAdmin from '../../../models/Club/ClubAdmin';
import ClubMember from '../../../models/Club/ClubMember';
import notificationLogic from "../../../components/Notifications/Notification";
import { successfulCreateAction, tryAgain } from '../../../components/Notifications/Messages';
import { Link, useHistory } from 'react-router-dom';
import Spinner from "../../Spinner/Spinner";
import { CloseCircleOutlined } from '@ant-design/icons';
import ClubAnnualReportForm from '../ClubAnnualReportForm/ClubAnnualReportForm';

const { Title } = Typography;

export const ClubAnnualReportCreate = () => {
    const history = useHistory();
    const { clubId } = useParams();
    const [form] = Form.useForm();
    const [admins, setAdmins] = useState<ClubAdmin[]>([]);
    const [clubHead, setClubHead] = useState<ClubAdmin>({} as ClubAdmin);
    const [members, setClubMembers] = useState<ClubMember[]>([]);
    const [followers, setFollowers] = useState<ClubMember[]>([]);
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingSave, setIsLoadingSave]=useState(false);
    const [countUsersPerYear, setCountUsersPerYear] = useState({}as number);
    const [countDeletedUsersPerYear, setCountDeletedUsersPerYear] = useState({}as number);
    const [club, setClub] = useState<any>({
        id: 0,
        name: "",
        description: "",
        clubURL: "",
        email: "",
    });

    useEffect(() => {
        fetchData(clubId);
    }, [])

    const fetchData = async (id: any) => {
        setIsLoading(true);
        try {
            let created = await checkCreated(id);
            if (created.data.hasCreated === true) {
                showError(created.data.message);
            } else {
                let response = await getClubMembersInfo(id);
                setClub(response.data.club);
                setAdmins(response.data.admins);
                setClubHead(response.data.head);
                setClubMembers(response.data.members);
                setFollowers(response.data.followers);
                setCountUsersPerYear(response.data.countUsersPerYear);
                setCountDeletedUsersPerYear(response.data.countDeletedUsersPerYear);
            }
        }
        catch (error) {
            notificationLogic("error", tryAgain);
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
    function seeDeleteModal() {
        return Modal.confirm({
          title: "Роман ще додае функціонал на зберігання",
          okText: "Так, Прискорити Романа",
          okType: "primary",
          cancelText: "Скасувати",
          maskClosable: true,
          onOk() {
          },
        });
      }



    const handleFinish = async (obj: any) => {
        seeDeleteModal();
        if (false) {
            obj.clubId = clubId
            obj.name = club.name
            obj.clubPage = club.clubURL
            obj.currentClubFollowers = followers.length
            obj.currentClubMembers = members.length
            obj.date = moment()
            setIsLoadingSave(true);
            try {
                let response = await createClubAnnualReport(obj);
                form.resetFields();
                notificationLogic('success', successfulCreateAction('Річний звіт', response.data.name));
                history.goBack();
            }
            catch (error) {
                if (error.response.status === 400 || error.response.status === 404) {
                    notificationLogic('error', tryAgain);
                    history.goBack();
                }
            } finally {
                setIsLoadingSave(false);
            }
        }
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
                        form={form} 
                    >
                        <Title
                            className='textCenter'
                            level={3} >
                            {`Річний звіт куреня ${club.name} за  ${moment(club.date).year()} рік`}
                        </Title>

                        <Link
                         className="LinkText" 
                         style={{ fontSize: "14px" }} 
                         to={"/clubs/" + clubId} target="blank">Перейти на профіль куреня {club.name}
                         </Link>

                        <br />
                        <br />

                        <ClubAnnualReportForm
                            club={club}
                            admins={admins}
                            members={members}
                            followers={followers} 
                            head={clubHead}
                            countUsersPerYear={countUsersPerYear}
                            countdeletedUsersPerYear={countDeletedUsersPerYear}
                        />

                        <Row justify='center'>
                            <Col>
                                <Button
                                    loading={isLoadingSave}
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
}

export default ClubAnnualReportCreate;