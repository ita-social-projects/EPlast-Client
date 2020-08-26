import React, {useState} from 'react';
import {Modal, Input,  Button, Card } from 'antd';

import {KVTable} from './KVTable';

import AddNewKadraForm from './AddNewKadraForm';


const classes = require('./Table.module.css');


const tabListNoTitle = [
    {
      key: 'KV1N',
      tab: 'КВ1(УПН)',
    },
    {
      key: 'KV1U',
      tab: 'КВ1(УПЮ)',
    },
    {
      key: 'KV2N',
      tab: 'КВ2(УПН)',
    },
    {
        key: 'KV2U',
        tab: 'КВ2(УПЮ)',
      },
  ];

  const contentListNoTitle = {
    KV1N: <KVTable current={1}/>,
    KV1U: <KVTable current={2}/>,
    KV2N: <KVTable current={3}/>,
    KV2U: <KVTable current={4}/>
  };


export const KadrasTable = ()=>{

   const [visible, setvisible]= useState<boolean>(false) ;
  
   const [noTitleKey, setKey] = useState<string>('KV1N');

   
   const showModal = () => {
    
      setvisible(true);
    };
  

  const handleOk = () => {
    
    setvisible(false);
   
  };

  const handleCancel = () => {

    setvisible(false);
  };

       

       const onTabChange = (key:string) => {
         console.log(noTitleKey)
        setKey(key);
        
        console.log(noTitleKey)
      };
     
     
    return(
    <>
        <h1 className={classes.titleTable}>Кадра виховників</h1>
        <Input.Search className={classes.searchInput} placeholder="Пошук" />
        <br />
        <Card
          style={{ width: '100%' }}
          tabList={tabListNoTitle}
          activeTabKey={noTitleKey}
          tabBarExtraContent={<Button type="primary" onClick={showModal}>
          Додати кадру
        </Button>}
          onTabChange={key => {
            onTabChange(key);
            
          }}
        >
          {contentListNoTitle['KV1U']}
        </Card>

        <Modal
          title="Надати кадру виховників"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <AddNewKadraForm></AddNewKadraForm>
        </Modal>
            
      </>
    )
        
}




export default KadrasTable;