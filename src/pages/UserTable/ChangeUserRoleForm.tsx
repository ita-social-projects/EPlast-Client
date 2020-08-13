import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Select } from 'antd';
import adminApi from '../../api/adminApi';
import { AxiosError } from 'axios';

interface Props {
    record: string;
    setShowModal: (showModal: boolean) => void;
    onChange: (id: string, userRoles: string[]) => void;
}

const ChangeUserRoleForm = ({ record, setShowModal }: Props) => {
    const id = record;
    const [form] = Form.useForm();

    const [roles, setRoles] = useState<any>({
        userID: '',
        userEmail: '',
        allRoles: [{
            id: '',
            name: ''
        }],
        userRoles: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            await adminApi.getRolesForEdit(id).then(response => {
                setRoles(response.data);
            })
        }
        fetchData();
    }, [])

    const handleCancel = () => {
        setShowModal(false);
    }
    const handleFinish = async (value: any) => {
        const newRoles: any[] = [{
            userRoles: value.userRole
        }];
        await adminApi.putEditedRoles(id, newRoles);
        setShowModal(false);
    };

    return (
        <div>
            <Form
                name="basic"
                onFinish={handleFinish}
                form={form}
            >
                <Form.Item name="userRole">
                    <Select mode='multiple' >
                        {roles?.allRoles.map((item: any) => (<Select.Option key={item.id} value={item.name} >
                            {item.name}
                        </Select.Option>))}
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

export default ChangeUserRoleForm;
