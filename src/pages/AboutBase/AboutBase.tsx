import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Layout, Collapse, Space } from 'antd';
import { useHistory } from "react-router-dom";
import Spinner from '../Spinner/Spinner';
import Search from "antd/lib/input/Search";
import Title from "antd/lib/typography/Title";
import AskQuestionModal from './AskQuestionModal';
import TextEditor from './TextEditor';
import {
  EditOutlined,
  PlusSquareFilled,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  HighlightOutlined,
} from "@ant-design/icons";
import "./AboutBase.less";
import SectionModel from '../../models/AboutBase/SectionModel';
import SubSectionModel from '../../models/AboutBase/SubsectionModel';
import Subsections from './Subsections';
import aboutBase from '../../api/aboutBase';
import notificationLogic from "../../components/Notifications/Notification";
import AddSubsectionModal from './AddSubsectionModal';
import DeleteSectConfirm from "./DeleteSectConfirm";
import DeleteSubsectConfirm from './DeleteSubsectConfirm';
import { List, Tooltip, Typography } from "antd";


const { Content } = Layout;
const { Panel } = Collapse;

function callback(key: any) {
  console.log(key);
}

let count = 1;

let defaultSect: SectionModel = {
  id: 0,
  title: "",
  subsection: {
    id: 0,
    sectionId: 0,
    title: "",
    description: ""
  }
};

let defaultSubSect: SubSectionModel = {
  id: 0,
  sectionId: 0,
  title: "",
  description: ""
};
const typeMaxLength = 200;

const AboutBase = () => {
  const [regionAdm, setRegionAdm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleModalAsk, setVisibleModalAsk] = useState(false);
  const [visibleModalSub, setVisibleModalSub] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [searchedData, setSearchedData] = useState("");
  const [form] = Form.useForm();
  const [editVisible, setEditVisible] = useState(false);
  const [editNewVisible, setEditNewVisible] = useState(false);
  const [curSect, setCurSect] = useState<SectionModel>(defaultSect);
  const [Sections, setData] = useState<SectionModel[]>([
    {
      id: 0,
      title: "",
      subsection: {
        id: 0,
        sectionId: 0,
        title: "",
        description: ""
      }
    }
  ]);
  const [sectData, setSectData] = useState<SectionModel[]>([defaultSect]);
  const [title, setTitle] = useState("");
  const fetchSectData = async () => {
    const sectData = (await aboutBase.getAboutBaseSections()).data;
    //console.log(sectData);
    setSectData(sectData);
  };
  const [visRule, setVisRule] = useState(false);

  const [curSubsect, setCurSubsect] = useState<SubSectionModel>(defaultSubSect);
  const [SubSections, setSubData] = useState<SubSectionModel[]>([
    {
      id: 0,
      sectionId: 0,
      title: "",
      description: ""
    }
  ]);
  const [subsectData, setSubsectData] = useState<SubSectionModel[]>([defaultSubSect]);
  const fetchSubData = async () => {
    const subsectData = (await aboutBase.getAboutBaseSubsections()).data;
    setSubsectData(subsectData);
  };

  useEffect(() => {
    setLoading(true);
    fetchSectData();
    fetchSubData();
    setLoading(false);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedData(event.target.value.toLowerCase());
    setLoading(true);
  };

  /*const handleDelete = (id: SectionModel['id']) => {
    setData(prev => prev.filter(item => item.id !== id))
  }

  const handleEdit = (title: string, id: SectionModel['id']) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, title } : item))
  }*/

  const handleDelete = (id: number) => {
    const filteredData = sectData.filter((s: { id: number }) => s.id !== id);
    setSectData([...filteredData]);
    setEditVisible(false);
    notificationLogic("success", "Розділ успішно видалено!");
  }

  const handleSubDelete = (id: number) => {
    const filteredSubData = subsectData.filter((s: { id: number }) => s.id !== id);
    setSubsectData([...filteredSubData]);
    setEditVisible(false);
    notificationLogic("success", "Підозділ успішно видалено!");
  }

  const handleEdit = async () => {
    if (curSect.title.length !== 0) {
      await aboutBase.editAboutBaseSection(curSect);
      notificationLogic("success", "Розділ успішно змінено!");
      fetchSectData();
      setCurSect(defaultSect);
      setEditVisible(false);
    } else
      notificationLogic("error", "Хибна назва");
  }

  const handleAdd = async () => {
    const newSection: SectionModel = {
      id: 0,
      title: title,
      subsection: {
        id: 0,
        sectionId: 0,
        title: "",
        description: ""
      }
    };
    if (title.length != 0) {
      await aboutBase.addAboutBaseSection(newSection);
      const res: SectionModel[] = (await aboutBase.getAboutBaseSections()).data;
      setSectData(res);
      setTitle("");
      notificationLogic("success", "Розділ додано!");
    } else {
      notificationLogic("error", "Хибна назва");
    }
  }

  const handleSubAdd = async (index: any) => {

  }


  /*const handleAdd = async (index: any) => {
    setLoading(false);
    const newItem = { id: count++, title: '', subsection: JSON.parse(index.subsection) }
    // const res: SectionModel[] = await Api.get();
    // setData(res);
    setData(prev => [...prev.slice(0, index + 1), newItem, ...prev.slice(index + 1)])
    setLoading(true);
  };*/

  const handleSubmit = async (values: any) => {
    const newSection: SectionModel = {
      id: 0,
      title: "",
      subsection: JSON.parse(values.subsection)
    }
  }

  const showEdit = async (id: number) => {
    const section = (await aboutBase.getAboutBaseSectionById(id)).data;
    setCurSect(section);
    if (curSect.id != id) {
      setEditVisible(true);
    }
  };

  const showSubEdit = async (id: number) => {
    const subsection = (await aboutBase.getAboutBaseSubsectionById(id)).data;
    setCurSubsect(subsection);
  }

  const showModalAsk = () => setVisibleModalAsk(true);
  const showModalSub = () => setVisibleModalSub(true);

  const [sectId, setSectId] = useState(0);

  const [sectHeader, setSectHeader] = useState();

  return !loading ? (
    <Layout.Content className="aboutbase">
      <Title level={1}>Про базу</Title>
      <div className="searchContainer">
        {
          <Button type="primary" onClick={showModalAsk}>
            Задати запитання
          </Button>
        }
        <Search
          placeholder="Пошук"
          enterButton
          onChange={handleSearch}
        />
      </div>
      {sectData.map((sectitem) => (
        <Collapse
          onChange={callback}
          className="section" key={sectitem.id}
        >
          <Panel
            header={sectHeader/*sectitem.title <Input style={{width: 300}}/>*/}
            key={sectitem.id}
            extra={[
              <Space>
                <Tooltip title="Редагувати розділ">
                  <EditOutlined
                    className="editInfoIcon"
                    onClick={() => showEdit(sectitem.id)}
                  />
                </Tooltip>
                <Tooltip title="Видалити розділ">
                  <DeleteOutlined
                    className="deleteInfoIcon"
                    onClick={() => DeleteSectConfirm(sectitem.id, handleDelete)}
                  />
                </Tooltip>
              </Space>
            ]}
          >
            {subsectData.filter(subitem => subitem.sectionId === sectitem.id).map((subitem) => (
              <Collapse
                onChange={callback}
                className="section" key={subitem.id}
              >
                <Panel
                  header={subitem.title}
                  key={subitem.id}
                  extra={[
                    <Space>
                      <Tooltip title="Редагувати підрозділ">
                        <EditOutlined
                          className="editInfoIcon"
                        //onClick={() => showEdit(sectitem.id)}
                        />
                      </Tooltip>
                      <Tooltip title="Видалити підрозділ">
                        <DeleteOutlined
                          className="deleteInfoIcon"
                          onClick={() => DeleteSubsectConfirm(subitem.id, handleSubDelete)}
                        />
                      </Tooltip>
                    </Space>
                  ]}
                >
                  <p>{subitem.description}</p>
                </Panel>
              </Collapse>
            ))}
            <div className="addSubSection">
              <Button type="primary" onClick={(e) => { setSectId(sectitem.id); showModalSub() }}>Додати підрозділ</Button>
            </div>
          </Panel>
        </Collapse>
      ))}
      {/*<div className="addSection">
        <Input placeholder=" Додати розділ" type="text" maxLength={50}
          value={title}
          onChange={(event) => {
            if (event.target.value.length < typeMaxLength) {
              setTitle(event.target.value);
              setVisRule(false);
            }
            else
              setVisRule(true);
          }} />
        <Button type="primary" onClick={handleAdd}>Додати</Button>
        </div>*/}
      <AskQuestionModal
        setVisibleModal={setVisibleModalAsk}
        visibleModal={visibleModalAsk}
      //onAdd={handleAdd}
      />
      <AddSubsectionModal
        setVisibleModal={setVisibleModalSub}
        visibleModal={visibleModalSub}
        sectId={sectId}
        fetchSubData={fetchSubData}
      //onAdd={onAdd}
      />

      {/*!editNewVisible ? (
        <div></div>
      ) : (
        <></>
      )*/}

      {!editVisible ? (
        <div></div>
      ) : (
        <></>
      )}
      {editVisible ? (
        <div>

        </div>
      ) : (
        <></>
      )}

      {/*!editVisible ? (
        <div className="addSection">
          <Input placeholder=" Додати розділ" type="text" maxLength={50}
            value={title}
            onChange={(event) => {
              if (event.target.value.length < typeMaxLength) {
                setTitle(event.target.value);
                setVisRule(false);
              }
              else
                setVisRule(true);
            }} />
          <Button type="primary" onClick={handleAdd}>Додати</Button>
        </div>
      ) : (
        <></>
      )*/}
      {/*editVisible ? (
        <div className="addSection">
          <Input placeholder=" Редагувати розділ" type="text" maxLength={50}
            value={curSect?.title}
            onChange={(event) =>
              setCurSect({
                id: curSect.id,
                title: event.target.value,
                subsection: {
                  id: 0,
                  sectionId: 0,
                  title: "",
                  description: ""
                }
              })
            } />
          <Space>
            <Button type="primary" onClick={handleEdit} ><SaveOutlined /></Button>
            <Button type="primary" onClick={() => setEditVisible(false)}>Скасувати</Button>
          </Space>

        </div>
      ) : (
        <></>
      )*/}
    </Layout.Content>
  ) : (
    <Spinner />
  );
};
export default AboutBase;
