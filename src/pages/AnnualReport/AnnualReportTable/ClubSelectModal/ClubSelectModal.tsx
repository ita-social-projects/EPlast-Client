import React, { useState, useEffect } from 'react';
import { Modal, Select, Form, Button, Row, Col } from 'antd';
import {getClubs} from '../../../../api/clubsApi';
import Clubs from '../../Interfaces/ClubAnnualReport'
import { useHistory } from 'react-router-dom';
import './ClubSelectModal.less'
import {emptyInput} from "../../../../components/Notifications/Messages"

interface Props {
    visibleModal: boolean,
    handleOk: () => void,
}

const ClubSelectModal = (props: Props) => {
    const { visibleModal, handleOk } = props;
    const history = useHistory();
    const [clubOptions, setClubOptions] = useState<any>();

    const validationSchema = {
        club: [
            { required: true, message: emptyInput() }
        ],
    }

    const fetchClubs = async()=>{
        let response = await getClubs();
        let clubs = response.data as Clubs[];
        setClubOptions(clubs.map(item => {
            return {
                label: item.name,
                value: item.id
            }
        }));
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
                onFinish={(obj) => { history.push(`/club/1`) }} >
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