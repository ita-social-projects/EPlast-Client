import React from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { FormLabelAlign } from 'antd/lib/form/interface';

const nameMaxLength = 71;
const columns = [
    {
        align: 'right' as FormLabelAlign,
        title: '№',
        dataIndex: 'number',     
        width: 75,
        fixed: true,
        defaultSortOrder: 'ascend' as SortOrder,
        sorter: (a: any, b: any) => a.number - b.number,
    },
    {
        title: 'Відзначення',
        dataIndex: 'distinctionName',
        render: (distinctionName: any) => {
          return((distinctionName?.length > nameMaxLength) ?
            <Tooltip title={distinctionName}>
              <span>{distinctionName.slice(0, 70)+ "..."}</span>
            </Tooltip>
          : distinctionName)
        },
        sorter: (a: any, b: any) => a.distinctionName.localeCompare(b.distinctionName),
        sortDirections: ['ascend', 'descend'] as SortOrder[],   
    },
    {
        title: 'Ім\'я',
        dataIndex: 'userName',
        render: (userName: string) => {
            return userName
        },
        sorter: (a: any, b: any) => a.userName.localeCompare(b.userName),
        sortDirections: ['ascend', 'descend'] as SortOrder[],
    },
    {
        title: 'Дата затвердження',
        dataIndex: 'date',
        render: (date: Date) => {
            return moment.utc(date.toLocaleString()).local().format('DD.MM.YYYY');
        },
        sorter:(a: any, b: any)  => a.date.localeCompare(b.date),
        sortDirections: ['ascend', 'descend'] as SortOrder[],
    },
    {
        title: 'Подання від',
        dataIndex: 'reporter',
        ellipsis: {
            showTitle: false,
        },
        render: (reporter: any) => (
          <Tooltip placement="topLeft" title={reporter}>
            {reporter}
          </Tooltip>
        ),
    },
    {
        title: 'Обгрунтування',
        dataIndex: 'reason',
        ellipsis: {
            showTitle: false,
        },
        render: (reason: any) => (
          <Tooltip placement="topRight" title={reason}>
            {reason}
          </Tooltip>
        ),
    },
];
export default columns;
