import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Typography } from 'antd';
import { getAllFollowers,  getAllMembers, getCities, addFollowerWithId, toggleMemberStatus } from '../../api/citiesApi';
import CityForAdmin from '../../models/City/CityForAdmin';
import CityAdmin from '../../models/City/CityAdmin';
import CityUser from '../../models/City/CityUser';
import AdminType from '../../models/Admin/AdminType';
import AddAdministratorModal from '../City/AddAdministratorModal/AddAdministratorModal';
import CityMember from '../../models/City/CityMember';
const { Option } = Select;

interface Props {
    record: string;
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    onChange: (id: string, userRoles: string) => void;
}

const ChangeUserCityForm = ({ record, showModal, setShowModal, onChange }: Props) => {
    const id = record;
    const [form] = Form.useForm();
    const [cities, setCities] = useState<CityForAdmin[]>([]);
    const [cityId, setCityId] = useState<number>(0);
    const [visibleModal, setVisibleModal] = useState(false);
    const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin());
    const [members, setMembers] = useState<CityMember[]>([]);
    const [followers, setFollowers] = useState<CityMember[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            await getCities().then(response => {
                setCities(response.data);
            })
        }
        fetchData();
        
        if ( showModal ) {
            form.resetFields();
        }
    }, [])

    const handleClick = async (event: any) => {
        const id = cities.filter((c: any) => c.name === event)[0].id;
        setCityId(id);

        await getAllMembers(id).then(response =>{
            setMembers(response.data.members);})

        await getAllFollowers(id).then(response => {
            setFollowers(response.data.followers);})
    }

    const handleCancel = () => {
        setShowModal(false);
    }
    
    const handleFinish = async (value: any) => {

        const member = members.find((m: any) => m.userId === record);
        const follower = followers.find((f: any) => f.userId === record);

        if( member === undefined ){
            if(follower === undefined ){
                const newFollower: any = await addFollowerWithId(cityId, record);
                await toggleMemberStatus(newFollower.data.id);
            }
            else{
                await toggleMemberStatus(follower.id);
            }
        }

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
          ></AddAdministratorModal>
        </div>
    );
};

export default ChangeUserCityForm;
