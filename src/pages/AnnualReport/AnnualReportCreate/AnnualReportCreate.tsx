import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
<<<<<<< HEAD
import { AxiosResponse, AxiosError } from 'axios'
import { Typography, Modal, Form, Row, Col, Input, Button, Select, Space, Spin } from 'antd';
import styles from './AnnualReportCreate.module.css';
import { AnnualReport } from '../Interfaces/AnnualReport';
import AnnualReportApi from '../../../api/AnnualReportApi';

const { Title, Text } = Typography;
const { TextArea } = Input;
=======
import { AxiosError } from 'axios'
import { Form, Button, Modal } from 'antd';
import styles from './AnnualReportCreate.module.css';
import AnnualReportForm from '../AnnualReportForm/AnnualReportForm';
import AnnualReportApi from '../../../api/AnnualReportApi';
import User from '../Interfaces/User';
import City from '../Interfaces/City';
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544

export const AnnualReportCreate = () => {
    const { cityId } = useParams();
    const history = useHistory();
<<<<<<< HEAD
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('Річний звіт станиці');
    const [cityLegalStatuses, setCityLegalStatuses] = useState<any>();
    const [cityMembers, setCityMembers] = useState<any>();

    const validationSchema = {
        cityLegalStatus: [
            { required: true, message: "Оберіть правовий статус осередку" }
        ],
        number: [
            { required: true, message: "Поле є обов'язковим для заповнення" },
            { pattern: /^\d+$/, message: "Поле повинне містити додатні цілі числа" }
        ]
    }

    useEffect(() => {
        checkCreated();
        setLoading(true);
    }, [])

    const checkCreated = async () => {
        await AnnualReportApi.checkCreated(cityId)
            .then(response => {
                console.log(response.data);
                if (response.data.hasCreated === false) {
                    fetchData();
=======
    const [title, setTitle] = useState<string>('Річний звіт станиці');
    const [id, setId] = useState<number>();
    const [cityMembers, setCityMembers] = useState<any>();
    const [cityLegalStatuses, setCityLegalStatuses] = useState<any>();
    const [form] = Form.useForm();

    useEffect(() => {
        if (cityId === undefined)
        {
            AnnualReportApi.getCities()
                .then(response => {
                    let cities = response.data.cities as City[];
                    setId(cities[0].id)
                    checkCreated(cities[0].id);
                })
                .catch((error: AxiosError) => {
                    showError(error.response?.data.message);
                });
        }
        else {
            setId(cityId);
            checkCreated(cityId);
        }
    }, [])

    const checkCreated = async (id: number) => {
        await AnnualReportApi.checkCreated(id)
            .then(response => {
                if (response.data.hasCreated === false) {
                    fetchData(id);
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
                }
                else {
                    showError(response.data.message);
                }
<<<<<<< HEAD
                console.log(response.data)
=======
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            });
    }
<<<<<<< HEAD
    
    const fetchData = async () => {
        await fetchCityInfo();
        await fetchLegalStatuses();
    }

    const fetchCityInfo = async () => {
        await AnnualReportApi.getCityInfo(cityId)
            .then(response => {
                let cityName = response.data.name;
                setTitle(title.concat(' ', cityName))
                setMembers(response.data.members);
            })
            .catch((error: AxiosError) => {
                console.log(error.toJSON);
            })
    }

    const setMembers = (members: []) => {
        setCityMembers(members.map(item => {
            let member = item as any;
            let firstName = member.user.firstName as string;
            let lastName = member.user.lastName as string;
            return {
                label: firstName.concat(' ', lastName),
                value: member.user.id
=======

    const fetchData = async (id: number) => {
        await fetchCityInfo(id);
        await fetchLegalStatuses();
    }

    const fetchCityInfo = async (id: number) => {
        await AnnualReportApi.getCityInfo(id)
            .then(response => {
                let cityName = response.data.name;
                setTitle(title.concat(' ', cityName));
                setMembers(response.data.members);
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            })
    }

    const setMembers = (members: User[]) => {
        setCityMembers(members.map(item => {
            return {
                label: String.prototype.concat(item.firstName, ' ', item.lastName),
                value: item.id
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
            }
        }));
    }

    const fetchLegalStatuses = async () => {
        await AnnualReportApi.getCityLegalStatuses()
            .then(response => {
<<<<<<< HEAD
                let legalStatuses = response.data.legalStatuses as [];
                setCityLegalStatuses(legalStatuses.map((item, index) => {
=======
                setCityLegalStatuses((response.data.legalStatuses as []).map((item, index) => {
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
                    return {
                        label: item,
                        value: index
                    }
                }));
            })
            .catch((error: AxiosError) => {
<<<<<<< HEAD
                console.log(error.toJSON);
=======
                showError(error.response?.data.message);
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
            })
    }

    const handleFinish = async (obj: any) => {
<<<<<<< HEAD
        let annualReport = new AnnualReport(obj);
        annualReport.cityId = cityId;
        await AnnualReportApi.post(annualReport)
            .then((response: AxiosResponse) => {
=======
        obj.cityId = id;
        await AnnualReportApi.create(obj)
            .then((response) => {
                form.resetFields();
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
                showSuccess(response.data.message);
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            })
    }

    const showSuccess = (message: string) => {
        Modal.success({
            content: message,
            onOk: () => { history.push('/userpage/main'); }
        });
    }

    const showError = (message: string) => {
        Modal.error({
            title: 'Помилка!',
            content: message,
            onOk: () => { history.push('/userpage/main'); }
        });
    }

<<<<<<< HEAD
    return loading === false ? (
        <div className={styles.spaceWrapper}>
          <Space className={styles.loader} size="large">
            <Spin size="large" />
          </Space>
        </div>
      ) : (
        <Form
            onFinish={handleFinish}
            className={styles.form} >
            <Title>{title}</Title>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className={styles.container}>
                    <Text strong={true}>Голова новообраної Старшини</Text>
                    <Form.Item
                        name='userId'
                        className={styles.w100}>
                        <Select
                            options={cityMembers}></Select>
                    </Form.Item>
                </Col>
                <Col
                    xs={24} sm={12} md={12} lg={12}
                    className={styles.container}>
                    <Text strong={true}>Правовий статус осередку</Text>
                    <Form.Item
                        className={styles.w100}
                        name='cityLegalStatusNew'
                        rules={validationSchema.cityLegalStatus}>
                        <Select
                            options={cityLegalStatuses}></Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={24} md={12} lg={12}
                    className={styles.container}>
                    <Text strong={true}>УПП</Text>
                    <Row
                        gutter={16}
                        align='bottom'>
                        <Col
                            xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість гніздечок пташат</Text>
                            <Form.Item
                                className={styles.w100}
                                name='numberOfSeatsPtashat'
                                rules={validationSchema.number}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість пташат</Text>
                            <Form.Item
                                className={styles.w100}
                                name='numberOfPtashata'
                                rules={validationSchema.number}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col
                    xs={24} sm={24} md={12} lg={12}
                    className={styles.container}>
                    <Text strong={true}>УПН</Text>
                    <Row
                        gutter={16}
                        align='bottom'>
                        <Col
                            xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість самостійних роїв</Text>
                            <Form.Item
                                className={styles.w100}
                                name='numberOfIndependentRiy'
                                rules={validationSchema.number}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість новацтва</Text>
                            <Form.Item
                                className={styles.w100}
                                name='numberOfNovatstva'
                                rules={validationSchema.number}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div className={styles.container}>
                <Text strong={true}>УПЮ</Text>
                <Row
                    gutter={16}
                    align='bottom'>
                    <Col
                        xs={24} sm={24} md={12} lg={8}>
                        <Text>Кількість куренів у станиці/паланці (окрузі/регіоні)</Text>
                        <Form.Item
                            className={styles.w100}
                            name='numberOfClubs'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24} sm={24} md={12} lg={8}>
                        <Text>Кількість самостійних гуртків</Text>
                        <Form.Item
                            className={styles.w100}
                            name='numberOfIndependentGroups'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24} sm={24} md={12} lg={8}>
                        <Text>Кількість неіменованих разом</Text>
                        <Form.Item
                            className={styles.w100}
                            name='numberOfUnatstvaNoname'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24} sm={24} md={12} lg={6}>
                        <Text>Кількість прихильників/ць</Text>
                        <Form.Item
                            className={styles.w100}
                            name='numberOfUnatstvaSupporters'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24} sm={24} md={8} lg={6}>
                        <Text>Кількість учасників/ць</Text>
                        <Form.Item
                            className={styles.w100}
                            name='numberOfUnatstvaMembers'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24} sm={24} md={8} lg={6}>
                        <Text>Кількість розвідувачів</Text>
                        <Form.Item
                            className={styles.w100}
                            name='numberOfUnatstvaProspectors'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24} sm={24} md={8} lg={6}>
                        <Text>Кількість скобів/вірлиць</Text>
                        <Form.Item
                            className={styles.w100}
                            name='numberOfUnatstvaSkobVirlyts'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
            <Row
                gutter={16}
                align='bottom'>
                <Col
                    xs={24} sm={24} md={12} lg={12}
                    className={styles.container}>
                    <Text strong={true}>УСП</Text>
                    <Row
                        gutter={16}
                        align='bottom'>
                        <Col
                            xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість старших пластунів прихильників</Text>
                            <Form.Item
                                className={styles.w100}
                                name='numberOfSeniorPlastynSupporters'
                                rules={validationSchema.number}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість старших пластунів</Text>
                            <Form.Item
                                className={styles.w100}
                                name='numberOfSeniorPlastynMembers'
                                rules={validationSchema.number}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col
                    xs={24} sm={24} md={12} lg={12}
                    className={styles.container}>
                    <Text strong={true}>УПС</Text>
                    <Row
                        gutter={16}
                        align='bottom'>
                        <Col
                            xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість сеньйорів пластунів прихильників</Text>
                            <Form.Item
                                className={styles.w100}
                                name='numberOfSeigneurSupporters'
                                rules={validationSchema.number}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24} sm={12} md={24} lg={12}>
                            <Text>Кількість сеньйорів пластунів</Text>
                            <Form.Item
                                className={styles.w100}
                                name='numberOfSeigneurMembers'
                                rules={validationSchema.number}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div className={styles.container}>
                <Text strong={true}>Адміністрування та виховництво</Text>
                <Row
                    gutter={16}
                    align='bottom'>
                    <Col
                        xs={24} sm={24} md={8} lg={8}>
                        <Text>Кількість діючих виховників (з усіх членів УСП, УПС)</Text>
                        <Form.Item
                            className={styles.w100}
                            name='numberOfTeachers'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24} sm={24} md={8} lg={8}>
                        <Text>Кількість адміністраторів (в проводах будь якого рівня)</Text>
                        <Form.Item
                            className={styles.w100}
                            name='numberOfAdministrators'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24} sm={24} md={8} lg={8}>
                        <Text>Кількість тих, хто поєднує виховництво та адміністрування</Text>
                        <Form.Item
                            className={styles.w100}
                            name='numberOfTeacherAdministrators'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
            <div className={styles.container}>
                <Text strong={true}>Пластприят</Text>
                <Row
                    gutter={16}
                    align='bottom'>
                    <Col
                        xs={24} sm={24} md={8} lg={8}>
                        <Text>Кількість пільговиків</Text>
                        <Form.Item
                            className={styles.w100}
                            name='numberOfBeneficiaries'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24} sm={24} md={8} lg={8}>
                        <Text>Кількість членів Пластприяту</Text>
                        <Form.Item
                            className={styles.w100}
                            name='numberOfPlastpryiatMembers'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24} sm={24} md={8} lg={8}>
                        <Text>Кількість почесних членів</Text>
                        <Form.Item
                            className={styles.w100}
                            name='numberOfHonoraryMembers'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
            <div className={styles.container}>
                <Text strong={true}>Залучені кошти</Text>
                <Row
                    gutter={16}
                    align='bottom'>
                    <Col
                        xs={24} sm={24} md={12} lg={6}>
                        <Text>Державні кошти</Text>
                        <Form.Item
                            className={styles.w100}
                            name='publicFunds'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24} sm={24} md={12} lg={6}>
                        <Text>Внески</Text>
                        <Form.Item
                            className={styles.w100}
                            name='contributionFunds'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24} sm={24} md={12} lg={6}>
                        <Text>Пластовий заробіток</Text>
                        <Form.Item
                            className={styles.w100}
                            name='plastSalary'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24} sm={24} md={12} lg={6}>
                        <Text>Спонсорські кошти</Text>
                        <Form.Item
                            className={styles.w100}
                            name='sponsorshipFunds'
                            rules={validationSchema.number}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
            <div className={styles.container}>
                <Text strong={true}>Майно та потреби станиці</Text>
                <Row
                    gutter={16}
                    align='bottom'>
                    <Col
                        xs={24} sm={24} md={12} lg={12}>
                        <Text>Вкажіть, що вам допоможе ефективніше залучати волонтерів та створювати виховні частини (гнізда, курені)</Text>
                        <Form.Item
                            className={styles.w100}
                            name='listProperty'>
                            <TextArea />
                        </Form.Item>
                    </Col>
                    <Col
                        xs={24} sm={24} md={12} lg={12}>
                        <Text>Вкажіть перелік майна, що є в станиці</Text>
                        <Form.Item
                            className={styles.w100}
                            name='improvementNeeds'>
                            <TextArea />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
=======
    return (
        <Form
            onFinish={handleFinish}
            className={styles.form}
            form={form} >
            <AnnualReportForm
                title={title}
                cityMembers={cityMembers}
                cityLegalStatuses={cityLegalStatuses} />
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
            <Button
                type='primary'
                htmlType='submit'>
                Подати річний звіт
            </Button>
        </Form>
    );
}

export default AnnualReportCreate;