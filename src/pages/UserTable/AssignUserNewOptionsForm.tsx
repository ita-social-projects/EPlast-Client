import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Typography, Radio } from 'antd';
import adminApi from '../../api/adminApi';
import { getCitiesForEdit } from '../../api/citiesApi';
import { useHistory } from 'react-router-dom';
const { Title } = Typography;

interface Props {
    record: string;
    setShowModal: (showModal: boolean) => void;
    onChange: (id: string, userRoles: string) => void;
}

const AssignUserNewOptionsForm = ({ record, setShowModal, onChange }: Props) => {
    const id = record;
    const [form] = Form.useForm();
    const history = useHistory();

    const [cities, setCities] = useState<any>({
        userID: '',
        userEmail: '',
        allCities: [{
            id: '',
            name: ''
        }],
        userCity: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            await getCitiesForEdit(id).then(response => {
                const { allCities, userCity } = response.data;
                setCities({ allCities, userCity });
                form.setFieldsValue({
                    userCity: cities.userCity
                });
            })
        }
        fetchData();
    }, [])

    const handleCancel = () => {
        setShowModal(false);
    }
    // const handleFinish = async (value: any) => {
    //     const rolesParam = JSON.stringify(value.userRole);
    //     await adminApi.putEditedRoles(id, rolesParam);
    //     const newRoles: any = {
    //         userID: roles.userID,
    //         userEmail: roles.userEmail,
    //         allRoles: [{
    //             id: roles.allRoles.id,
    //             name: roles.allRoles.name,
    //         }],
    //         userRoles: rolesParam
    //     };
    //     onChange(id, newRoles);
    //     setShowModal(false);
    // };

    return (
        <div>
            <Form
                name="basic"
                // onFinish={handleFinish}
                form={form}
            >
                <h4>Оберіть курінь</h4>
                <Form.Item name="userRole">
                    <Select mode='multiple' >
                        {cities?.allCities.map((item: any) => (<Radio.Button key={item.id} value={item.name} >
                            {item.name}
                        </Radio.Button>)) }
                    </Select>
                </Form.Item>
                <h4>Оберіть станицю</h4>
                <Form.Item name="userRole">
                    <Select mode='multiple' >
                        {/* {roles?.allRoles.map((item: any) => (<Radio.Button key={item.id} value={item.name} >
                            {item.name}
                        </Radio.Button>))} */}
                    </Select>
                </Form.Item>
                <h4>Оберіть округ</h4>
                <Form.Item name="userRole">
                    <Select mode='multiple' >
                        {/* {roles?.allRoles.map((item: any) => (<Radio.Button key={item.id} value={item.name} >
                            {item.name}
                        </Radio.Button>))} */}
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


export default AssignUserNewOptionsForm;