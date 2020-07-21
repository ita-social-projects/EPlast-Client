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
    dataIndex: 'organization',
  },
  {
    title: 'Статус',
    dataIndex: 'decisionStatusType',
  },
  {
    title: 'Рішення для',
    dataIndex: 'decisionTarget',
  },
  {
    title: 'Рішення',
    dataIndex: 'description',
    render: (text: string) => {
      if(text.length > 50){
        return `${text.slice(0,50) }...`;
      }
      return text;
    },
  },
  {
    title: 'Дата',
    dataIndex: 'date',
  },
  {
    title: 'Додатки',
    dataIndex: 'fileName',
  },
];

export default columns;
