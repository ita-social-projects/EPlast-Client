import React from 'react';
import moment from 'moment';
import { Typography, Tooltip, List, Tag } from 'antd';
const { Text } = Typography;

const setTagColor = (userRoles: string) => {
    let color = '';
    if (userRoles === 'Admin') {
        color = 'red';
    }
    if (userRoles === 'Пластун') {
        color = 'green';
    }
    if (userRoles === 'Прихильник') {
        color = 'orange';
    }
    if (userRoles === 'Колишній член пласту') {
        color = 'black';
    }
    return color;
}

const ColumnsForUserTable: any = [

    {
        title: 'Ім`я',
        dataIndex: ['user', 'firstName'],
        render: (text: any) => <Text underline strong>{text}</Text>,
        sorter: (a: any, b: any) => a.user.firstName.localeCompare(b.user.firstName),
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'ascend',
    },
    {
        title: 'Прізвище',
        dataIndex: ['user', 'lastName'],
        render: (text: any | null) => <Text underline strong>{text}</Text>,
        sorter: (a: any, b: any) => a.user.lastName.localeCompare(b.user.lastName),
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Дата народження',
        dataIndex: ['user', 'birthday'],
        render: (date: Date) => {
            if (date !== null) {
                return moment(date).format('DD-MM-YYYY')
            }
        }
    },
    {
        title: 'Округ',
        dataIndex: 'regionName',
        render: (regionName: any) => {
            if (regionName.length > 0) {
                return <Tag color={'blue'} key={regionName}>
                    {regionName.toUpperCase()}
                </Tag>
            }
        },
    },
    {
        title: 'Станиця',
        dataIndex: 'cityName',
        render: (cityName: any) => {
            if (cityName.length > 0) {
                return <Tag color={'lime'} key={cityName}>
                    {cityName.toUpperCase()}
                </Tag>
            }
        },
    },
    {
        title: 'Курінь',
        dataIndex: 'clubName',
        render: (clubName: any) => {
            if (clubName.length > 0) {
                return <Tag color={'pink'} key={clubName}>
                    {clubName.toUpperCase()}
                </Tag>
            }
        },
    },
    {
        title: 'Ступінь',
        dataIndex: 'userPlastDegreeName',
        render: (userPlastDegreeName: any) => {
            if (userPlastDegreeName.length > 0) {
                return <Tag color={'red'} key={userPlastDegreeName}>
                    {userPlastDegreeName.toUpperCase()}
                </Tag>
            }
        },
    },
    {
        title: 'Права доступу',
        dataIndex: 'userRoles',
        ellipsis: true,
        sorter: (a: any, b: any) => a.userRoles.localeCompare(b.userRoles),
        sortDirections: ['descend', 'ascend'],
        render: (userRoles: any) => {
            if (userRoles.length > 50) {
                return <Tag color={setTagColor(userRoles)} key={userRoles}>
                    <Tooltip placement="topLeft" title={userRoles}>
                        {userRoles.slice(0, 50).toUpperCase()}
                    </Tooltip>
                </Tag>
            }
            return <Tag color={setTagColor(userRoles)} key={userRoles}>
                <Tooltip placement="topLeft" title={userRoles}>
                    {userRoles.toUpperCase()}
                </Tooltip>
            </Tag>
        },
    },
]

export default ColumnsForUserTable;