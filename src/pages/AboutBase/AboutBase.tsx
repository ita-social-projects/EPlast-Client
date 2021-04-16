import React, { useEffect, useState } from 'react';
import {Form,Input, Button, Layout, Collapse} from 'antd';
import { useHistory } from "react-router-dom";
import Spinner from '../Spinner/Spinner';
import Search from "antd/lib/input/Search";
import Title from "antd/lib/typography/Title";
import Popup from "reactjs-popup";
import TextEditor from './TextEditor';
import {
  EditOutlined,
  PlusSquareFilled,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./AboutBase.less";
import SectionModel from '../../models/AboutBase/SectionModel';
import SubSectionModel from '../../models/AboutBase/SubsectionModel';

const {Content} = Layout;
const { Panel } = Collapse;

function callback(key: any) {
    console.log(key);
  }

  const text = `
  jlvlvkcvjkb
`;

let count = 1;

const AboutBase = () =>{
    const [regionAdm, setRegionAdm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [searchedData, setSearchedData] = useState("");
    const [form] = Form.useForm();
    const [Sections, setData]= useState<SectionModel[]>([
      {
        id: 0,
        title:"",
        subsection:{
          id:0,
          sectionId:0,
          title:"",
          descroption:"",
          imagePath:""
        }
      }
    ]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchedData(event.target.value.toLowerCase());
      setLoading(true);
    };

    const handleDelete = (id:SectionModel['id'])=>{
      setData(prev=>prev.filter(item=>item.id!==id))
    }

    const handleSubDelete=(id:SubSectionModel['id'])=>
    {
      setData(prev=>prev.filter(item=>item.subsection.id!==id))
    }

    const handleEdit = (title: string, id: SectionModel['id']) =>{
      setData(prev=>prev.map(item=>item.id===id?{...item,title}:item))
    }
    const handleAdd = async (index:any) => {
      setLoading(false);
      const newItem = {id:count++, title:'', subsection: JSON.parse(index.subsection)}
      // const res: SectionModel[] = await Api.get();
      // setData(res);
      setData(prev => [...prev.slice(0, index + 1), newItem, ...prev.slice(index + 1)])
      setLoading(true);
    };

    const handleSubmit = async(values:any)=>{
      const newSection: SectionModel = {
        id:0,
        title:"",
        subsection:JSON.parse(values.subsection)
      }
    }

    return !loading ? (
        <Layout.Content className="aboutbase">
            <Title level={1}>Про базу</Title>
            <div className="searchContainer">
            {
                <Button type="primary" /*onClick={showModal}*/>
                  Задати запитання
                </Button>
            }
            <Search
          placeholder="Пошук"
          enterButton
          onChange={handleSearch}
        />
            </div>
    {Sections.map((item,index)=>(
    <Collapse onChange={callback} className="section" key={item.id}>
      <EditOutlined className="editInfoIcon"
        //onClick={() =>history.push(``)}
        onClick={e=>handleEdit(e.currentTarget.title,item.id)}
    />
    <DeleteOutlined className="deleteInfoIcon"
        //onClick={() => seeDeleteModal()}
        onClick={()=>handleDelete(item.id)}
    />
    <Panel header={item.title='Section'} key="1" >
    <Collapse className="subsection" defaultActiveKey="2" key={item.subsection.id}> 
      <EditOutlined className="editInfoIcon"
        //onClick={() =>history.push(``)}
        onClick={e=>handleEdit(e.currentTarget.title,item.subsection.id)}
      />
    <DeleteOutlined className="deleteInfoIcon"
        //onClick={() => seeDeleteModal()}
        onClick={()=>handleSubDelete(item.subsection.id)}
    />
        <Panel header={item.subsection.title='Subsection'} key="2">
          <p>{item.subsection.descroption='subsection description'}</p>
        </Panel>
      </Collapse>
      <div>
      <Popup modal trigger={<Button className="addPostButton" type="primary" /*onClick={addPost}*/>Додати допис</Button>}>
        <div><TextEditor></TextEditor></div>
      </Popup>
      </div>
    </Panel>
  </Collapse>
    ))}
    <div className="addSection">
  <Input placeholder="➕ Додати розділ"/>
  <Button type="primary" onClick={()=>handleAdd}>✓</Button>
  </div>
        </Layout.Content>
            
    ) : (
        <Spinner />
      );
};
export default AboutBase;