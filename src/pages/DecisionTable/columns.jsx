const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Назва',
    dataIndex: 'name',
  },
  {
    title: 'Керівний орган',
    dataIndex: 'decisionStatusType',
  },
  {
    title: 'Статус',
    dataIndex: 'decisionStatusType',
  },
  {
    title: 'Рішення для',
    dataIndex: 'organizationName',
  },
  {
    title: 'Рішення',
    dataIndex: 'description',
    render: (text) => (
      text
    ),
  },
  {
    title: 'Дата',
    dataIndex: 'date',
  },
  {
    title: 'Додатки',
    dataIndex: 'address',
  },
];

export default columns;
