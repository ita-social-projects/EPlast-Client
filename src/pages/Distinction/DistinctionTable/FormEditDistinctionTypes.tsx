import React, { useEffect, useState } from "react";
import { List, Tooltip, Typography } from "antd";
import Distinction from "../Interfaces/Distinction";
import distinctionApi from "../../../api/distinctionApi";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  SaveOutlined, 
  PlusOutlined, HighlightOutlined
} from "@ant-design/icons";
import notificationLogic from "../../../components/Notifications/Notification";
import classes from "./FormEdit.module.css";
import Item from "antd/lib/list/Item";
import DeleteTypeConfirm from "./DeleteTypeConfirm";
import Search from "antd/lib/input/Search";
import Text from "antd/lib/typography/Text";


type FormEditDistinctionTypesProps = {
  setVisibleModal: (visibleModal: boolean) => void;
};

let defaultDist: Distinction = {
  name: "",
  id: 0,
};

const FormEditDistinctionTypes: React.FC<FormEditDistinctionTypesProps> = () => {
  const [distData, setDistData] = useState<Distinction[]>([defaultDist]);
  const [title, setTitle] = useState("");
  const [curDist, setCurDist] = useState<Distinction>(defaultDist);
  const [editVisible, setEditVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visRule, setVisRule] = useState(false);
  const fetchData = async () => {
    const distData = (await distinctionApi.getDistinctions()).data;
    setDistData(distData);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  const handleDelete = (id: number) => {
    const filteredData = distData.filter((d: { id: number }) => d.id !== id);
    setDistData([...filteredData]);
    setEditVisible(false);
    notificationLogic("success", "Тип відзначення успішно видалено!");
  };

  const handleAdd = async () => {
    const newDistinction: Distinction = {
      id: 0,
      name: title,
    };
    if (title.length != 0) {
      await distinctionApi.addDistinction(newDistinction);
      const res: Distinction[] = (await distinctionApi.getDistinctions()).data;
      setDistData(res);
      setTitle("");
      notificationLogic("success", "Тип відзначення додано!");
    } else {
      notificationLogic("error", "Хибна назва");
    }
  };

  const showEdit = async (id: number) => {
    const distinction = (await distinctionApi.getDistinctionById(id)).data;
    setCurDist(distinction);
    if (curDist.id != id) {
      setEditVisible(true);
    }
    else {
      setEditVisible(false);
      setCurDist(defaultDist);
    }
  };

  const handleEdit = async () => {
    await distinctionApi.editDistinction(curDist);
    notificationLogic("success", "Тип відзначення успішно змінено!");
    fetchData();
    setCurDist(defaultDist);
    setEditVisible(false);
  };

  return (
    <div>
      <List
        className={classes.list}
        header={null}
        footer={null}
        bordered
        rowKey="id"
        dataSource={distData}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Tooltip title="Редагувати відзначення">
                <EditOutlined
                  className={classes.editIcon}
                  onClick={() => showEdit(item.id)}
                />
              </Tooltip>,
              <Tooltip title="Видалити відзначення">
                <DeleteOutlined
                  className={classes.deleteIcon}
                  onClick={() => DeleteTypeConfirm(item.id, handleDelete)}
                />
              </Tooltip>,
            ]}
          >
            <Tooltip title={item.name}>
              <Typography.Text className="text" ellipsis>
                {item.name}
              </Typography.Text>
            </Tooltip>
          </List.Item>
        )}
      />
      {!editVisible ? (
        <div className={classes.addDiv}>
          <Item>
            <Search
              prefix={<PlusOutlined />}
              size="large"
              className={classes.inputField}
              name="inputName"
              value={title}
              onChange={(event) => {
                if(event.target.value.length < 249)
                {
                  setTitle(event.target.value);
                  setVisRule(false);
                }
                else
                  setVisRule(true);
              }}
              placeholder="Додати відзначення"
              maxLength={250}
              onPressEnter={handleAdd}
              enterButton={<CheckOutlined onClick={handleAdd} />}
            /> 
           
          </Item>
          {visRule ?
              <div>
                <Text type="danger">
                  Поле не повинно містити більше 250 символів!
                </Text>
              </div>
              : <></>
            }
        </div>
        
      ) : (
        <></>
      )}
      {editVisible ? (
        <Item>
          <Search
            size="large"
            prefix={<HighlightOutlined />}
            className={classes.inputField}
            name="editName"
            placeholder="Редагувати відзначення"
            value={curDist?.name}
            onChange={(event) =>
              setCurDist({
                id: curDist.id,
                name: event.target.value,
              })
            }
            maxLength={250}
            onPressEnter={handleEdit}
            enterButton={<SaveOutlined/>}
            onSearch={handleEdit}
          />
        </Item>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FormEditDistinctionTypes;
