import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Typography } from 'antd';
import adminApi from '../../api/adminApi';
import { getCities } from '../../api/citiesApi';
import CityForAdmin from '../../models/City/CityForAdmin';
import CityAdmin from '../../models/City/CityAdmin';
import CityUser from '../../models/City/CityUser';
import AdminType from '../../models/Admin/AdminType';
import AddAdministratorModal from '../City/AddAdministratorModal/AddAdministratorModal';
const { Title } = Typography;
const { Option } = Select;

interface Props {
    record: string;
    setShowModal: (showModal: boolean) => void;
    onChange: (id: string, userRoles: string) => void;
}

const ChangeUserCityForm = ({ record, setShowModal, onChange }: Props) => {
    const id = record;
    const [form] = Form.useForm();
    const [cities, setCities] = useState<CityForAdmin[]>([]);
    const [cityId, setCityId] = useState<number>(0);
    const [visibleModal, setVisibleModal] = useState(false);
    const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin());

    useEffect(() => {
        const fetchData = async () => {
            await getCities().then(response => {
                setCities(response.data);
            })
        }
        fetchData();
    }, [])

    const handleClick = async (event: any) => {
        const id = cities.filter((c: any) => c.name === event)[0].id;
        setCityId(id);
        
    }

    const handleCancel = () => {
        setShowModal(false);
    }
    const handleFinish = async (value: any) => {
        //перевірка чи є фоловером запит на всіх фоловерів і на всіх мемберів

        const newAdmin: CityAdmin = {
            id: 0,
            userId: record,
            user: new CityUser(),
            adminType: new AdminType(),
            cityId: cityId
          };
        setAdmin(newAdmin)
        setVisibleModal(true);
        setShowModal(false);
    };

    return (
        <div>
            <Form
                name="basic"
                onFinish={handleFinish}
                form={form}
            >
                <h4>Оберіть станицю для користувача</h4>
                <Form.Item name="userCity">
                    <Select onChange={handleClick}>
                    {cities.map((item: CityForAdmin) => <Option key={item.id} value={item.name} >
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
            <AddAdministratorModal
            admin={admin}
            setAdmin={setAdmin}
            visibleModal={visibleModal}
            setVisibleModal={setVisibleModal}
            cityId={cityId}
            //onAdd={onAdd}
          ></AddAdministratorModal>
        </div>
    );
};

export default ChangeUserCityForm;
