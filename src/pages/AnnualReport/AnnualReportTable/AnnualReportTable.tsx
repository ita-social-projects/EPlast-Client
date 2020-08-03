import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Table, Button, Layout, Modal, Input, Row, Col, Typography, Select } from 'antd';
import moment from 'moment';
import AnnualReportApi from '../../../api/AnnualReportApi';
import AnnualReport from '../Interfaces/AnnualReport';
import User from '../Interfaces/User';
import City from '../Interfaces/City';
import Region from '../Interfaces/Region';
import AnnualReportInformation from '../AnnualReportInformation/AnnualReportInformation';
import UnconfirmedDropdown from './Dropdowns/UnconfirmedDropdown/UnconfirmedDropdown';
import ConfirmedDropdown from './Dropdowns/ConfirmedDropdown/ConfirmedDropdown';
import SavedDropdown from './Dropdowns/SavedDropdown/SavedDropdown';
import Filters from './Filters';
import styles from './AnnualReportTable.module.css';

const { Title } = Typography;

const AnnualReportTable = () => {
    const history = useHistory();
    const [annualReport, setAnnualReport] = useState<AnnualReport>(Object);
    const [reportStatusNames, setReportStatusNames] = useState<string[]>(Array());
    const [cityLegalStatuses, setCityLegalStatuses] = useState<string[]>(Array());
    const [cityOptions, setCityOptions] = useState<any>();
    const [annualReports, setAnnualReports] = useState<AnnualReport[]>(Array());
    const [searchedData, setSearchedData] = useState('');
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [showUnconfirmedDropdown, setShowUnconfirmedDropdown] = useState<boolean>(false);
    const [showConfirmedDropdown, setShowConfirmedDropdown] = useState<boolean>(false);
    const [showSavedDropdown, setShowSavedDropdown] = useState<boolean>(false);
    const [showAnnualReportModal, setShowAnnualReportModal] = useState<boolean>(false);
    const { idFilter, userFilter, cityFilter, regionFilter, dateFilter, statusFilter } = Filters;

    useEffect(() => {
        fetchCityLegalStatuses();
        fetchAnnualReportStatuses();
        fetchCities();
        fetchAnnualReports();
    }, [])

    const fetchCityLegalStatuses = async () => {
        await AnnualReportApi.getCityLegalStatuses()
            .then(response => {
                setCityLegalStatuses(response.data.legalStatuses);
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            })
    }

    const fetchAnnualReportStatuses = async () => {
        await AnnualReportApi.getAnnualReportStatuses()
            .then(response => {
                setReportStatusNames(response.data.statuses);
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            });
    }

    const fetchCities = async () => {
        await AnnualReportApi.getCities()
            .then(response => {
                let cities = response.data.cities as City[];
                setCityOptions(cities.map(item => {
                    return {
                        label: item.name,
                        value: item.id
                    }
                }));
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            });
    }

    const fetchAnnualReports = async () => {
        await AnnualReportApi.getAll()
            .then(response => {
                setAnnualReports(response.data.annualReports);
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            });
    }

    const handleView = async (id: number) => {
        hideDropdowns();
        await AnnualReportApi.getById(id)
            .then(response => {
                setAnnualReport(response.data.annualreport);
                setShowAnnualReportModal(true);
            })
            .catch((error: AxiosError) => {

            })
    }

    const handleEdit = (id: number) => {
        hideDropdowns();
        history.push(`/annualreport/edit/${id}`);
    }

    const handleConfirm = async (id: number) => {
        hideDropdowns();
        await AnnualReportApi.confirm(id)
            .then(response => {
                let cityId = annualReports.find(item => item.id == id)?.cityId;
                setAnnualReports(annualReports.map(item => {
                    if (item.id === id ||
                        (item.id !== id && item.cityId === cityId && item.status === 1)) {
                        item.status++;
                    }
                    return item;
                }));
                showSuccess(response.data.message);
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            });
    }

    const handleCancel = async (id: number) => {
        hideDropdowns();
        await AnnualReportApi.cancel(id)
            .then(response => {
                setAnnualReports(annualReports.map(item => {
                    if (item.id === id) {
                        item.status--;
                    }
                    return item;
                }));
                showSuccess(response.data.message);
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            });
    }

    const handleRemove = async (id: number) => {
        hideDropdowns();
        await AnnualReportApi.remove(id)
            .then(response => {
                setAnnualReports(annualReports?.filter(item => item.id !== id));
                showSuccess(response.data.message);
            })
            .catch((error: AxiosError) => {
                showError(error.response?.data.message);
            });
    }

    const itemRender = (current: any, type: string, originalElement: any) => {
        if (type === 'prev') {
            return <Button type="primary">Попередня</Button>;
        }
        if (type === 'next') {
            return <Button type="primary">Наступна</Button>;
        }
        return originalElement;
    }

    const hideDropdowns = () => {
        setShowUnconfirmedDropdown(false);
        setShowConfirmedDropdown(false);
        setShowSavedDropdown(false);
    }

    const hideAnnualReport = () => {
        setShowAnnualReportModal(false);
    }

    const showDropdown = (annualReportStatus: number) => {
        switch (annualReportStatus) {
            case 0:
                setShowUnconfirmedDropdown(true);
                break;
            case 1:
                setShowConfirmedDropdown(true);
                break;
            case 2:
                setShowSavedDropdown(true);
                break;
        }
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        hideDropdowns();
        setSearchedData(event.target.value);
    };

    const filteredData = searchedData !== ''
        ? annualReports.filter(item =>
            idFilter(item.id, searchedData) || userFilter(item.user as User, searchedData) ||
            cityFilter(item.city as City, searchedData) || dateFilter(item.date, searchedData) ||
            regionFilter(item.city?.region as Region, searchedData) ||
            statusFilter(item.status, reportStatusNames, searchedData))
        : annualReports;

    const showSuccess = (message: string) => {
        Modal.success({
            content: message,
        });
    }

    const showError = (message: string) => {
        Modal.error({
            title: 'Помилка!',
            content: message
        });
    }

    const columns = [
        {
            title: 'Номер',
            dataIndex: 'id'
        },
        {
            title: 'Подавач',
            dataIndex: 'user',
            render: (user: User) => {
                return `${user.firstName} ${user.lastName}`;
            }
        },
        {
            title: 'Станиця',
            dataIndex: ['city', 'name']
        },
        {
            title: 'Регіон',
            dataIndex: ['city', 'region', 'regionName']
        },
        {
            title: 'Дата подання',
            dataIndex: 'date',
            render: (date: Date) => {
                return moment(date.toLocaleString()).format('DD-MM-YYYY');
            }
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            render: (status: number) => {
                return reportStatusNames[status];
            }
        }
    ]

    return (
        <Layout.Content>
            <Title
                level={2}>Річні звіти станиць</Title>
            <Row
                className={styles.searchContainer}
                gutter={16}>
                <Col span={4}>
                    <Input placeholder='Пошук' onChange={handleSearch} />
                </Col>
                <Col span={4}>
                    <Select
                        showSearch
                        className={styles.select}
                        options={cityOptions}
                        placeholder='Подати річний звіт'
                        filterOption={(input, option) =>
                            (option?.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onSelect={(value) => history.push(`/annualreport/create/${value}`)} />
                </Col>
            </Row>
            <Table
                bordered
                rowKey="id"
                columns={columns}
                dataSource={filteredData}
                onRow={(record) => {
                    return {
                        onClick: () => {
                            hideDropdowns();
                        },
                        onContextMenu: (event) => {
                            event.preventDefault();
                            showDropdown(record.status);
                            setAnnualReport(record);
                            setX(event.pageX);
                            setY(event.pageY);
                        },
                    };
                }}
                onChange={(pagination) => {
                    if (pagination) {
                        window.scrollTo({
                            left: 0,
                            top: 0,
                            behavior: 'smooth',
                        });
                    }
                }}
                pagination={{
                    itemRender,
                    position: ['bottomRight'],
                    showTotal: (total, range) =>
                        `Записи з ${range[0]} по ${range[1]} із ${total} записів`,
                }} />
            <UnconfirmedDropdown
                showDropdown={showUnconfirmedDropdown}
                record={annualReport}
                pageX={x}
                pageY={y}
                onView={handleView}
                onEdit={handleEdit}
                onConfirm={handleConfirm}
                onRemove={handleRemove} />
            <ConfirmedDropdown
                showDropdown={showConfirmedDropdown}
                record={annualReport}
                pageX={x}
                pageY={y}
                onView={handleView}
                onCancel={handleCancel} />
            <SavedDropdown
                showDropdown={showSavedDropdown}
                record={annualReport}
                pageX={x}
                pageY={y}
                onView={handleView} />
            <AnnualReportInformation
                visibleModal={showAnnualReportModal}
                annualReport={annualReport}
                cityLegalStatuses={cityLegalStatuses}
                handleOk={hideAnnualReport} />
        </Layout.Content >
    );
}

export default AnnualReportTable;