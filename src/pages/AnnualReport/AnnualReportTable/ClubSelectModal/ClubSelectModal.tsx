import React, { useState, useEffect } from 'react';
import { Modal, Select, Form, Button, Row, Col } from 'antd';
import clubsApi, {createClubAnnualReport, getClubs, getClubsOptions} from '../../../../api/clubsApi';
import { useHistory } from 'react-router-dom';
import './ClubSelectModal.less'
import {emptyInput} from "../../../../components/Notifications/Messages"
import notificationLogic from "../../../../components/Notifications/Notification";

interface Props {
    visibleModal: boolean,
    handleOk: () => void,
}

const ClubSelectModal = (props: Props) => {
    const { visibleModal, handleOk } = props;
    const history = useHistory();
    const [clubOptions, setClubOptions] = useState<any>();
    const [form] = Form.useForm();
    

    const validationSchema = {
        club: [
            { required: true, message: emptyInput() }
        ],
    }

    const handleSubmit = async (values : any)=>{
        createClubAnnualReport(JSON.parse(values.region).id) 
        .then(() => {
          notificationLogic("success", "Річний звіт успішно створено");
          window.location.reload();
        })
        .catch(() => {
          notificationLogic("error", "Щось пішло не так. Можливо даний річний звіт уже створено");
        });    
        form.resetFields(); 
      }

    const fetchClubs = async()=>{
        let response = await getClubsOptions();
        let clubs = response.data.map((item:any) => {
            return {
                label: item.name,
                value: item.id
            }
        })
        setClubOptions(clubs);
    }

    const checkCreated = async (id: number) => {
        try {
            let response = await clubsApi.checkCreated(id);
            if (response.data.hasCreated === true) {
                showError(response.data.message);
            }
            else{
                history.push(`/annualreport/createClubAnnualReport/${id}`)
            }
        }
        catch (error) {
            showError(error.message)
        }
    }

    const showError = (message: string) => {
        Modal.error({
            title: 'Помилка!',
            content: message
        });
    }

    useEffect(() => {
       fetchClubs();
    }, [])

    return (
        <Modal
            title='Оберіть курінь для створення річного звіту'
            onCancel={handleOk}
            visible={visibleModal}
            footer={null} >
            <Form
                onFinish={(obj) =>{
                    checkCreated(obj.clubId);
                }} >
                <Row>
                    <Col
                        span={24} >
                        <Form.Item
                            name='clubId'
                            rules={validationSchema.club} >
                            <Select
                                showSearch
                                className=''
                                options={clubOptions}
                                placeholder='Обрати курінь'
                                filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                                } />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify='center'>
                    <Col>
                        <Button
                            type='primary'
                            htmlType='submit' >
                            Створити річний звіт
                    </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ClubSelectModal;