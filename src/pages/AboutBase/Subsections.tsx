import React, { useEffect, useState } from 'react';
import {Form,Input, Modal, Button, Layout, Collapse} from 'antd';
import { useHistory } from "react-router-dom";
import Spinner from '../Spinner/Spinner';
import Search from "antd/lib/input/Search";
import Title from "antd/lib/typography/Title";
import TextEditor from './TextEditor';
import {
  EditOutlined,
  PlusSquareFilled,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./AboutBase.less";
import "./Subsections.css";
import SubsectionModel from '../../models/AboutBase/SubsectionModel';


const {Content} = Layout;
const { Panel } = Collapse;

function callback(key: any) {
    console.log(key);
  }

const Subsections = () =>{
    const [regionAdm, setRegionAdm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [searchedData, setSearchedData] = useState("");
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [data, setData]= useState<SubsectionModel[]>([
      {
          id:0,
          sectionId:0,
          title:"",
          description:""
      }
    ]);

    const showModal = () => {
      setIsModalVisible(true);
    };
    const handleOk = () => {
      setIsModalVisible(false);
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };
    const handleSubDelete=(id:SubsectionModel['id'])=>
    {
      setData(prev=>prev.filter(item=>item.id!==id))
    }

    const handleSubEdit = (title: string, id: SubsectionModel['id']) =>{
      setData(prev=>prev.map(item=>item.id===id?{...item,title}:item))
    }

    const handleSubAdd = async (index:any) => {
      setLoading(false);
      //const newItem = {id:++, title:'', description:'', sectionId:''}
      // const res: SectionModel[] = await Api.get();
      // setData(res);
      //setData(prev => [...prev.slice(0, index + 1), newItem, ...prev.slice(index + 1)])
      setLoading(true);
    };

    
    
    const editOtlined = () => (
      <EditOutlined className="editInfoIcon"
        //onClick={() =>history.push(``)}
        onClick={event => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
        }}
      />
    );

    const deleteOtlined = () =>(
    <DeleteOutlined className="deleteInfoIcon"
        //onClick={() => seeDeleteModal()}
        //onClick={()=>handleDelete(item.id)}
        onClick={event => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
        }}
    />
    );

    
    return !loading ? (
        <Layout.Content className="aboutbase">
     {
    <>
    <div>
    <Collapse
            onChange={callback}
            className="subsection" 
        >
            <Panel
                header={'Subsection'}
                key="1"
                extra={<>{editOtlined()}{deleteOtlined()}</>}
            >

            </Panel>
    </Collapse>
    </div>

     <div className="modalDiv"> 
     <Button className="addPostButton" type="primary" onClick={showModal}>Додати допис</Button>
     <Modal  visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
    {/* <div><TextEditor /></div> */}
     </Modal>
    </div> 
    
    </>
    }
        </Layout.Content>
    ) : (
        <Spinner />
      );
};
export default Subsections;