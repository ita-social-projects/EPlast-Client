const columns = [
  {
    title: 'Прізвище',
    dataIndex: 'username',
  },
  {
    title: "Ім'я",
    dataIndex: 'name',
  },
  {
    title: 'Стать',
    dataIndex: ['address', 'street'],
  },
  {
    title: 'День народження',
    dataIndex: 'completed',
  },
  {
    title: 'Ступінь',
    dataIndex: 'userId',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    render: (text: string) => text,
  },
  {
    title: 'Округи',
    dataIndex: 'address',
  },
  {
    title: 'Станиця',
    dataIndex: 'address',
  },
  {
    title: 'Курінь',
    dataIndex: 'address',
  },
  {
    title: 'Права доступу Eplast',
    dataIndex: 'address',
  },
];

export default columns;
