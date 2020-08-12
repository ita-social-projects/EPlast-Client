import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import adminApi from '../../api/adminApi';

interface Props {
    record: string;
    setShowModal: (showModal: boolean) => void;
    onChange: (id: string, userRoles: string[]) => void;
}

const ChangeUserRoleForm = ({ record, setShowModal, onChange }: Props) => {
    const [loading, setLoading] = useState(false);
    const id = record;
    const [form] = Form.useForm();

    const [roles, setRoles] = useState<any>([{
        userID: '',
        userEmail: '',
        allRoles: [{
            id: '',
            name: ''
        }],
        userRoles: []
    }])


    useEffect(() => {
        const fetchData = async () => {
            await adminApi.getRolesForEdit(id).then(response => {
                setRoles(response.data);
            })
            setLoading(true);
        }
        fetchData();
    }, [])

    const handleCancel = () => {
        setShowModal(false);
    }
    const handleFinish = async (dec: any) => {
        const newRoles: any = {

        };
        await adminApi.putEditedRoles(id);
        onChange(newRoles.id, newRoles.userRoles);
        setShowModal(false);
    };

    return (
        <div>
            {!loading && (
                <Form
                    name="basic"
                    onFinish={handleFinish}
                    form={form}
                >
                    <Form.Item>
                        {/* {(roles?.allRoles).map((item: any) => (<Checkbox> {item.name}</Checkbox>))} */}
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
                </Form>)}
        </div>
    );
};

export default ChangeUserRoleForm;
