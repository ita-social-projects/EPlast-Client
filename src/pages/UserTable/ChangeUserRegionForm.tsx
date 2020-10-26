import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Typography } from 'antd';
import RegionForAdmin from '../../models/Region/RegionForAdmin';
import { getRegions } from '../../api/regionsApi';
import AddRegionAdministratorModal from './AddRegionAdministratorModal';
const { Option } = Select;

interface Props {
    record: string;
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    onChange: (id: string, userRoles: string) => void;
}

const ChangeUserRegionForm = ({ record, showModal, setShowModal, onChange }: Props) => {
    const id = record;
    const [form] = Form.useForm();
    const [regions, setRegions] = useState<RegionForAdmin[]>([]);
    const [regionId, setRegionId] = useState<number>(0);
    const [showAdministratorModal, setShowAdministratorModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await getRegions().then(response => {
                setRegions(response.data);
            })
        }
        fetchData();
        if ( showModal ) {
            form.resetFields();
        }
    }, [])

    const handleCancel = () => {
        setShowModal(false);
    }

    const handleClick = async (event: any) => {
        const id = regions.filter((c: any) => c.regionName === event)[0].id;
        setRegionId(id);
    }

    const handleFinish = async (value: any) => {
        setShowModal(false);
        setShowAdministratorModal(true);
    };

    return (
        <div>
            <Form
                name="basic"
                onFinish={handleFinish}
                form={form}
            >
                <h4>Оберіть округ для користувача</h4>
                <Form.Item name="userRegion">
                    <Select onChange={handleClick}>
                    {regions.map((item: RegionForAdmin) => <Option key={item.id} value={item.regionName} >
                            {item.regionName}
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
                <AddRegionAdministratorModal 
                    userId={id}
                    showAdministratorModal={showAdministratorModal}
                    setShowAdministratorModal={setShowAdministratorModal}
                    regionId={regionId}
                ></AddRegionAdministratorModal>
            </Form>
        </div>
    );
};

export default ChangeUserRegionForm;
