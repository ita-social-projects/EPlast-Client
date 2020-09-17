import React, {useState, useEffect} from 'react';
import {Modal, Input,  Button, Card, Spin } from 'antd';

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


export const KadrasTable = ()=>{



  const [searchedData, setSearchedData] = useState('');

  const contentListNoTitle: { [key: string]: any } = {
    KV1N: <div key='1'><KVTable  current={1} searchData={searchedData}/></div>,
    KV1U: <div key='2'><KVTable current={2} searchData={searchedData}/></div>,
    KV2N: <div key='3'><KVTable current={3} searchData={searchedData}/></div>,
    KV2U: <div key='4'><KVTable current={4} searchData={searchedData}/></div>
  };

   const [visible, setvisible]= useState<boolean>(false) ;
   
   

   const [noTitleKey, setKey] = useState<string>('KV1N');


   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedData(event.target.value);
  };


   const showModal = () => {
    
      setvisible(true);
    };
  

  const handleOk = () => {
    
    setvisible(false);
   
  };

  const handleCancel = () => {

    setvisible(false);
  };

       const  renewPage = ()=>{
        const key = noTitleKey;
        
        setKey('KV1N');
        setKey('KV2N');
        setKey(key);
        setvisible(false);
       }


       const onTabChange =  (key:string) => {
         console.log(noTitleKey)
         setKey(key);
        
        console.log(noTitleKey)
        
      };
     





    return(
    <>
        <h1 className={classes.titleTable}>Кадра виховників</h1>
        <Button className={classes.addKadraButton} type="primary" onClick={showModal}>
          Додати кадру
        </Button>
        <Input.Search className={classes.searchInput} placeholder="Пошук"  onChange={handleSearch} />
        <br />
        <Card
          style={{ width: '100%' }}
          tabList={tabListNoTitle}
          activeTabKey={noTitleKey}
         
          onTabChange={key => {
            onTabChange(key);
            
          }}
        >
          
          {contentListNoTitle[noTitleKey ]}
        </Card>

       
            
        <Modal
          title="Надати кадру виховників"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <AddNewKadraForm onAdd={renewPage}></AddNewKadraForm>
        </Modal>
      </>
    )
        
}
export default KadrasTable;