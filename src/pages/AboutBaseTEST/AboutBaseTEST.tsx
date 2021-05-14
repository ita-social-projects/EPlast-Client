import React, { useEffect, useState } from 'react';
import {Form,Input, Button, Layout, Collapse} from 'antd';
import { useHistory } from "react-router-dom";
import Spinner from '../Spinner/Spinner';
import Search from "antd/lib/input/Search";
import Title from "antd/lib/typography/Title";
import Popup from "reactjs-popup";
import {
  EditOutlined,
  PlusSquareFilled,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./AboutBaseTEST.less";
import SectionModel from '../../models/AboutBase/SectionModel';
import SubSectionModel from '../../models/AboutBase/SubsectionModel';
import aboutBaseApi from '../../api/aboutBaseApi';
import { title } from 'process';

const {Content} = Layout;

function callback(key: any) {
    console.log(key);
  }

const AboutBaseTEST = () =>{
    const [regionAdm, setRegionAdm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [searchedData, setSearchedData] = useState("");
    const [form] = Form.useForm();
    const [Section, setData]= useState<SectionModel[]>(
        [
            {
               id:0,
               title: "" ,
               subsection:{
                id:0,
                title:"",
                description:"",
                sectionId:0
               }
            }
        ]
    );

    useEffect(()=>{
        const fetchData = async () =>{
            const res: SectionModel[] = await aboutBaseApi.getAboutBaseSections();
            setData(res);
            //setLoading(true);
        };
        fetchData();
    },[]);

    let filtredData = searchedData
    ? Section.filter((item)=>{
        return Object.values([
            item.title,
            item.subsection.description,
            item.subsection.title
        ]).find((element)=>{
            return String(element).toLowerCase().includes(searchedData);
        })
    }):Section;

    // filtredData = filtredData.concat(
    //     Section?.filter((item)=>
    //     (item.title.toLowerCase()?.includes(searchedData)||
    //     item.subsection.title.toLowerCase()?.includes(searchedData)||
    //     item.subsection.description.toLowerCase()?.includes(searchedData) &&
    //     !filtredData.includes(item))
    //     )
    // );
    
    const handleSearch = (event:React.ChangeEvent<HTMLInputElement>)=>{
        setSearchedData(event.target.value.toLowerCase());
        setLoading(true);
    }

    const handleDelete = (id: number) => {
        const filteredData = Section.filter(
            (d:{id: number})=> d.id !==id)
            setData([...filtredData]);    
    };
    
    const handleEdit = (id: number, title: string) => {
            /* eslint no-param-reassign: "error" */
            const filteredData = Section.filter((d) => {
              if (d.id === id) {
                d.title = title;
              }
              return d;
            });
            setData([...filteredData]);};
    
    const handleAdd = async () => {
               setLoading(false);
               const res: SectionModel[] = await aboutBaseApi.getAboutBaseSections();
               setData(res);
               setLoading(true);
              };
    
    const columns = [
        { title: '', dataIndex: 'title', key: 'title'},
        {title: '', render : () =>{ 
              return <EditOutlined className="deleteInfoIcon"/>;
            
        }},
        {title: '',render : () =>{ 
            return <DeleteOutlined className="deleteInfoIcon"/>;
          
      }}
    ]

      return loading ===false ? (
          <Spinner/> ):(
        <Layout.Content className="aboutbaseTEST">
            <Title level={1}>Про базу</Title>
            <div className="searchContainer">
            {
                <Button type="primary" /*onClick={showModal}*/>
                  Задати запитання
                </Button>
            }
            <Input  placeholder="Пошук"  onChange={handleSearch} allowClear/>
            </div>
            <div>
            <table>
             className="SectionTable"
            dataSource={filtredData}
            columns={columns}
            //expandedRowRender={}
            </table>
            </div>
            <Form>
        <Input
          type="text"
          value={title}
          placeholder="Enter a title&hellip;"
          required
        />
        <Button type="primary" onClick= {handleAdd} >Add Section</Button>
      
    </Form>
        </Layout.Content>
      );
  };

  export default AboutBaseTEST