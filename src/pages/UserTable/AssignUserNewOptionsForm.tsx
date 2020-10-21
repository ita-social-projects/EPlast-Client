import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Typography, Radio } from 'antd';
import adminApi from '../../api/adminApi';
import { getCitiesForEdit, putEditedCities } from '../../api/citiesApi';
import { useHistory } from 'react-router-dom';
import CityAdmin from '../../models/City/CityAdmin';
import AddAdministratorModal from '../City/AddAdministratorModal/AddAdministratorModal';
import CityUser from '../../models/City/CityUser';
import AdminType from '../../models/Admin/AdminType';
const { Title } = Typography;

interface Props {
    record: string;
    setShowModal: (showModal: boolean) => void;
    onChange: (id: string, userCities: string) => void;
    nameOfRoles: any;
}

const AssignUserNewOptionsForm = ({ record, setShowModal, onChange, nameOfRoles }: Props) => {
    const [form] = Form.useForm();

    const [cityId, setCityId] = useState<number>(0);
    const [visibleModal, setVisibleModal] = useState(false);
    const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin());
    
    const [cities, setCities] = useState<any>({
        userID: '',
        userEmail: '',
        allCities: [{
            id: '',
            name: ''
        }],
        userCity: ['']
    })

    useEffect(() => {
        const fetchData = async () => {
            await getCitiesForEdit(record).then(response => {
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
    const handleFinish = async (value: any) => {
        const cityParam = JSON.stringify(value.userCity);
        await putEditedCities(record, cityParam);
        const newCities: any = {
            userID: cities.userID,
            userEmail: cities.userEmail,
            allCities: [{
                id: cities.allCities.id,
                name: cities.allCities.name,
            }],
            userCity: cityParam
        };
        onChange(record, newCities);
        setShowModal(false);
    };

    const handleClick = async (event: any) => {
        debugger
        const id = cities.allCities.filter((c: any) => c.name = event)[0].id;
        setCityId(id);
        const newAdmin: CityAdmin = {
            id: 0,
            userId: record,
            user: new CityUser(),
            adminType: new AdminType(),
            cityId: id
          };
        setAdmin(newAdmin)
        setVisibleModal(true);
    }

    return (
        <div>
            <Form
                name="basic"
                onFinish={handleFinish}
                form={form}
            >
                <h4>Оберіть cтаницю</h4>
                <Form.Item name="userCity">
                    <Select onChange={handleClick}>
                        {cities?.allCities.map((item: any) => (<Select.Option key={item.id} value={item.name}>
                            {item.name}
                        </Select.Option>)) }
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
                <h4>Оберіть курінь</h4>
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
                        type="primary" 
                        htmlType="submit"
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


export default AssignUserNewOptionsForm;