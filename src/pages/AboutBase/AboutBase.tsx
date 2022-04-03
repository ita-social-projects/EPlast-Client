import React, { useEffect, useState } from "react";
import { Input, Button, Layout, Collapse, Space, Tooltip } from "antd";
import Spinner from "../Spinner/Spinner";
import Search from "antd/lib/input/Search";
import Title from "antd/lib/typography/Title";
import AskQuestionModal from "./AskQuestionModal";
import { EditOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import "./AboutBase.less";
import SectionModel from "../../models/AboutBase/SectionModel";
import SubSectionModel from "../../models/AboutBase/SubsectionModel";
import aboutBase from "../../api/aboutBase";
import notificationLogic from "../../components/Notifications/Notification";
import AddSubsectionModal from "./AddSubsectionModal";
import EditSubsectionModal from "./EditSubsectionModal";
import DeleteSectConfirm from "./DeleteSectConfirm";
import DeleteSubsectConfirm from "./DeleteSubsectConfirm";
import PicturesWall from "./PicturesWall";
import { Roles } from "../../models/Roles/Roles";
import userApi from "../../api/UserApi";

const { Panel } = Collapse;

let defaultSect: SectionModel = {
  id: 0,
  title: "",
  subsection: {
    id: 0,
    sectionId: 0,
    title: "",
    description: "",
  },
};

let defaultSubSect: SubSectionModel = {
  id: 0,
  sectionId: 0,
  title: "",
  description: "",
};

const AboutBase = () => {
  const [loading, setLoading] = useState(false);
  const [visibleModalAsk, setVisibleModalAsk] = useState(false);
  const [visibleModalSubAdd, setVisibleModalSubAdd] = useState(false);
  const [visibleModalSubEdit, setVisibleModalSubEdit] = useState(false);
  const [searchedData, setSearchedData] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const [sectEdit, setSectEdit] = useState(0);
  const [curSect, setCurSect] = useState<SectionModel>(defaultSect);
  const [sectData, setSectData] = useState<SectionModel[]>([defaultSect]);
  const [subsectData, setSubsectData] = useState<SubSectionModel[]>([
    defaultSubSect,
  ]);
  const [title, setTitle] = useState("");
  const [sectId, setSectId] = useState(0);
  const [subId, setSubId] = useState(0);
  const [subTitle, setSubTitle] = useState("");
  const [subDescription, setSubDescription] = useState("");
  const [role, setRole] = useState(userApi.getActiveUserRoles());
  const [elementsvisible, setElementsVisible] = useState(false);
  const showModalAsk = () => setVisibleModalAsk(true);
  const showModalSubAdd = () => setVisibleModalSubAdd(true);
  const showModalSubEdit = () => setVisibleModalSubEdit(true);
  const [editKey, setEditKey] = useState(0);

  const fetchSectData = async () => {
    const sectData = (await aboutBase.getAboutBaseSections()).data;
    setSectData(sectData);
  };

  const fetchSubData = async () => {
    const subsectData = (await aboutBase.getAboutBaseSubsections()).data;
    setSubsectData(subsectData);
  };

  const handleSearch = (e: any) => {
    setSearchedData(e);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.toLowerCase() === "") {
      setSearchedData("");
    }
  };

  const handleDelete = (id: number) => {
    const filteredData = sectData.filter((s: { id: number }) => s.id !== id);
    setSectData([...filteredData]);
    notificationLogic("success", "Розділ успішно видалено!");
  };

  const handleSubDelete = (id: number) => {
    const filteredSubData = subsectData.filter(
      (s: { id: number }) => s.id !== id
    );
    setSubsectData([...filteredSubData]);
    setEditVisible(false);
    notificationLogic("success", "Підозділ успішно видалено!");
  };

  const showEdit = async (id: number) => {
    const section = (await aboutBase.getAboutBaseSectionById(id)).data;
    setCurSect(section);
    setEditVisible(true);
  };

  const handleEdit = async () => {
    if (curSect.title.length !== 0) {
      await aboutBase.editAboutBaseSection(curSect);
      notificationLogic("success", "Розділ успішно змінено!");
      fetchSectData();
      setCurSect(defaultSect);
      setEditVisible(false);
    } else notificationLogic("error", "Хибна назва");
  };

  const handleAdd = async () => {
    const newSection: SectionModel = {
      id: 0,
      title: title,
      subsection: {
        id: 0,
        sectionId: 0,
        title: "",
        description: "",
      },
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
  };

  const elementsVisibility = () => {
    role.forEach((r) => {
      if (r == Roles.Admin || r == Roles.RegionBoardHead) {
        setElementsVisible(true);
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    elementsVisibility();
    fetchSectData();
    fetchSubData();
    setLoading(false);
  }, []);

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
          onChange={handleSearchChange}
          onSearch={handleSearch}
        />
      </div>
      {sectData.map((sectitem) => (
        <Collapse className="section" key={sectitem.id}>
          <Panel
            header={
              editVisible && sectEdit == sectitem.id ? (
                <div>
                  <Input
                    style={{ width: 300 }}
                    defaultValue={sectitem.title}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onChange={(event) =>
                      setCurSect({
                        id: curSect.id,
                        title: event.target.value,
                        subsection: {
                          id: 0,
                          sectionId: 0,
                          title: "",
                          description: "",
                        },
                      })
                    }
                  />
                  <Space>
                    <Button
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit();
                      }}
                    >
                      <SaveOutlined />
                    </Button>
                    <Button
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditVisible(false);
                      }}
                    >
                      Відмінити
                    </Button>
                  </Space>
                </div>
              ) : (
                sectitem.title
              )
            }
            key={sectitem.id}
            extra={
              elementsvisible ? (
                [
                  <Space>
                    <Tooltip title="Редагувати розділ">
                      <EditOutlined
                        className="editInfoIcon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSectEdit(sectitem.id);
                          showEdit(sectitem.id);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Видалити розділ">
                      <DeleteOutlined
                        className="deleteInfoIcon"
                        onClick={(e) => {
                          e.stopPropagation();
                          DeleteSectConfirm(sectitem.id, handleDelete);
                        }}
                      />
                    </Tooltip>
                  </Space>,
                ]
              ) : (
                <></>
              )
            }
          >
            {subsectData
              .filter((subitem) => subitem.sectionId === sectitem.id)
              .map((subitem) => (
                <Collapse className="section" key={subitem.id}>
                  <Panel
                    header={subitem.title}
                    key={subitem.id}
                    extra={
                      elementsvisible ? (
                        [
                          <Space>
                            <Tooltip title="Редагувати підрозділ">
                              <EditOutlined
                                className="editInfoIcon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSubId(subitem.id);
                                  setSubTitle(subitem.title);
                                  setSubDescription(subitem.description);
                                  setSectId(sectitem.id);
                                  showModalSubEdit();
                                }}
                              />
                            </Tooltip>
                            <Tooltip title="Видалити підрозділ">
                              <DeleteOutlined
                                className="deleteInfoIcon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  DeleteSubsectConfirm(
                                    subitem.id,
                                    handleSubDelete
                                  );
                                }}
                              />
                            </Tooltip>
                          </Space>,
                        ]
                      ) : (
                        <></>
                      )
                    }
                  >
                    <p>{subitem.description}</p>
                    <PicturesWall subsectionId={subitem.id} key={editKey} />
                  </Panel>
                </Collapse>
              ))}
            {elementsvisible ? (
              <div className="addSubSection">
                <Button
                  type="primary"
                  onClick={(e) => {
                    setSectId(sectitem.id);
                    showModalSubAdd();
                  }}
                >
                  Додати підрозділ
                </Button>
              </div>
            ) : (
              <></>
            )}
          </Panel>
        </Collapse>
      ))}
      <AskQuestionModal
        setVisibleModal={setVisibleModalAsk}
        visibleModal={visibleModalAsk}
      />
      <AddSubsectionModal
        setVisibleModal={setVisibleModalSubAdd}
        visibleModal={visibleModalSubAdd}
        sectId={sectId}
        fetchSubData={fetchSubData}
      />
      <EditSubsectionModal
        setVisibleModal={setVisibleModalSubEdit}
        visibleModal={visibleModalSubEdit}
        id={subId}
        sectId={sectId}
        title={subTitle}
        description={subDescription}
        fetchSubData={fetchSubData}
        editKey={editKey}
        setEditKey={setEditKey}
      />

      {elementsvisible ? (
        <div className="addSection">
          <Input
            placeholder=" Додати розділ"
            type="text"
            maxLength={50}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <Button type="primary" onClick={handleAdd}>
            Додати
          </Button>
        </div>
      ) : (
        <></>
      )}
    </Layout.Content>
  ) : (
    <Spinner />
  );
};
export default AboutBase;
