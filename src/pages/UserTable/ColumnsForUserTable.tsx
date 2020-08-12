import React from 'react';
import moment from 'moment';
import { Typography } from 'antd';
const { Text } = Typography;

const ColumnsForUserTable: any = [
    {
        title: 'Ім`я',
        dataIndex: ['user', 'firstName'],
        render: (text: any) => <Text underline strong>{text}</Text>,
        sorter: (a: any, b: any) => a.user.firstName - b.user.firstName,
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
    },
    {
        title: 'Прізвище',
        dataIndex: ['user', 'lastName'],
        render: (text: any) => <Text underline strong>{text}</Text>,
    },
    {
        title: 'Дата народження',
        dataIndex: ['user', 'birthday'],
        render: (date: Date) => {
            if (date === null) {
                return "Не вказано";
            }
            else {
                return moment(date).format('DD-MM-YYYY')
            }
        }
    },
    {
        title: 'Округ',
        dataIndex: 'regionName'
    },
    {
        title: 'Станиця',
        dataIndex: 'cityName',
    },
    {
        title: 'Курінь',
        dataIndex: 'clubName'
    },
    {
        title: 'Ступінь',
        dataIndex: 'userPlastDegreeName'
    },
    {
        title: 'Права доступу',
        dataIndex: 'userRoles',
        render: (text: string) => {
            if (text.length > 50) {
                return `${text.slice(0, 50)}...`;
            }
            return text;
        },
    },
]

export default ColumnsForUserTable;