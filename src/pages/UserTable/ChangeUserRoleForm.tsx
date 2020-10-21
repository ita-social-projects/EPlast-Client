import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Typography, Radio } from 'antd';
import adminApi from '../../api/adminApi';
import { useHistory } from 'react-router-dom';
import AssignUserNewOptionsModal from './AssignUserNewOptionsModal';
const { Title } = Typography;

interface Props {
    record: string;
    setShowModal: (showModal: boolean) => void;
    onChange: (id: string, userRoles: string) => void;
}

const ChangeUserRoleForm = ({ record, setShowModal, onChange }: Props) => {
    const id = record;
    const [form] = Form.useForm();
    const history = useHistory();
    const [showEditOptionsModal, setShowEditOptionsModal] = useState(false);

    const [roles, setRoles] = useState<any>({
        userID: '',
        userEmail: '',
        allRoles: [{
            id: '',
            name: ''
        }],
        userRoles: ['']
    })

    const handleItemClick = async (item: any) => {
        await setShowEditOptionsModal(true);
      };

    useEffect(() => {
        const fetchData = async () => {
            await adminApi.getRolesForEdit(id).then(response => {
                const { allRoles, userRoles } = response.data;
                setRoles({ allRoles, userRoles });
                form.setFieldsValue({
                    userRoles: roles.userRoles
                });
            })
        }
        fetchData();
    }, [])

    const handleCancel = () => {
        setShowModal(false);
    }
    const handleFinish = async (value: any) => {
        const rolesParam = JSON.stringify(value.userRole);
        await adminApi.putEditedRoles(id, rolesParam);
        const newRoles: any = {
            userID: roles.userID,
            userEmail: roles.userEmail,
            allRoles: [{
                id: roles.allRoles.id,
                name: roles.allRoles.name,
            }],
            userRoles: rolesParam
        };
        onChange(id, newRoles);
        setShowModal(false);
    };

    return (
        <div>
            <Form
                name="basic"
                onFinish={handleFinish}
                form={form}
            >
                <h4>Оберіть одну або декілька ролей</h4>
                <Form.Item name="userRole">
                    <Select mode='multiple' >
                        {roles?.allRoles.map((item: any) => (<Radio.Button key={item.id} value={item.name} >
                            {item.name}
                        </Radio.Button>))}
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
                        type="primary" 
                        htmlType="submit"
                        onClick={handleItemClick}
                    >
                        Змінити
                        </Button>

                </Form.Item>
                <AssignUserNewOptionsModal
                    record={record}
                    showModal={showEditOptionsModal}
                    setShowModal={setShowEditOptionsModal}
                    onChange={onChange}
                    nameOfRoles={roles.userRoles}
                    
                />
            </Form>
        </div>
    );
};

export default ChangeUserRoleForm;
