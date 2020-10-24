import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Typography } from 'antd';
import adminApi from '../../api/adminApi';
import ClubForAdmin from '../../models/Club/ClubForAdmin';
import { getClubs } from '../../api/clubsApi';
const { Title } = Typography;
const { Option } = Select;

interface Props {
    record: string;
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    onChange: (id: string, userRoles: string) => void;
}

const ChangeUserClubForm = ({ record, showModal, setShowModal, onChange }: Props) => {
    const id = record;
    const [form] = Form.useForm();
    const[clubs, setClubs] = useState<ClubForAdmin[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            await getClubs().then(response => {
                setClubs(response.data);
            })
        }
        fetchData();
        if( showModal ) {
            form.resetFields();
        }
    }, [])

    const handleCancel = () => {
        setShowModal(false);
    }
    const handleFinish = async (value: any) => {
        setShowModal(false);
    };

    return (
        <div>
            <Form
                name="basic"
                onFinish={handleFinish}
                form={form}
            >
                <h4>Оберіть курінь для користувача</h4>
                <Form.Item name="userClub">
                    <Select >
                    {clubs.map((item: ClubForAdmin) => <Option key={item.id} value={item.name} >
                            {item.name}
                        </Option>)}
                    </Select>
                </Form.Item>
                <Form.Item style={{ textAlign: "right" }}>
                    <Button
                        key="back"
                        onClick={handleCancel}
                    >
                        Відмінити
                        </Button>
                    <Button
                        type="primary" htmlType="submit"
                    >
                        Змінити
                        </Button>

                </Form.Item>
            </Form>
        </div>
    );
};

export default ChangeUserClubForm;
