import React, { useEffect, useState } from "react";
import { List, Tooltip, Typography } from "antd";
import Precaution from "../Interfaces/Precaution";
import precautionApi from "../../../api/precautionApi";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  SaveOutlined,
  PlusOutlined,
  HighlightOutlined,
} from "@ant-design/icons";
import notificationLogic from "../../../components/Notifications/Notification";
import classes from "./FormEdit.module.css";
import Item from "antd/lib/list/Item";
import DeleteTypeConfirm from "./DeleteTypeConfirm";
import Search from "antd/lib/input/Search";
import Text from "antd/lib/typography/Text";

type FormEditPrecautionTypesProps = {
  setVisibleModal: (visibleModal: boolean) => void;
};

let defaultDist: Precaution = {
  name: "",
  id: 0,
};

const FormEditPrecautionTypes: React.FC<FormEditPrecautionTypesProps> = () => {
  const [distData, setDistData] = useState<Precaution[]>([defaultDist]);
  const [title, setTitle] = useState("");
  const [curDist, setCurDist] = useState<Precaution>(defaultDist);
  const [editVisible, setEditVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visRule, setVisRule] = useState(false);
  const fetchData = async () => {
    const distData = (await precautionApi.getPrecautions()).data;
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
    notificationLogic("success", "Тип перестороги успішно видалено!");
  };

  const handleAdd = async () => {
    const newPrecaution: Precaution = {
      id: 0,
      name: title,
    };
    if (title.length != 0) {
      await precautionApi.addPrecaution(newPrecaution);
      const res: Precaution[] = (await precautionApi.getPrecautions()).data;
      setDistData(res);
      setTitle("");
      notificationLogic("success", "Тип перестороги додано!");
    } else {
      notificationLogic("error", "Хибна назва");
    }
  };

  const showEdit = async (id: number) => {
    const Precaution = (await precautionApi.getPrecautionById(id)).data;
    setCurDist(Precaution);
    if (curDist.id != id) {
      setEditVisible(true);
    } else {
      setEditVisible(false);
      setCurDist(defaultDist);
    }
  };

  const handleEdit = async () => {
    if (curDist.name.length !== 0) {
      await precautionApi.editPrecaution(curDist);
      notificationLogic("success", "Тип перестороги успішно змінено!");
      fetchData();
      setCurDist(defaultDist);
      setEditVisible(false);
    } else notificationLogic("error", "Хибна назва");
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
              <Tooltip title="Редагувати перестороги">
                <EditOutlined
                  className={classes.editIcon}
                  onClick={() => showEdit(item.id)}
                />
              </Tooltip>,
              <Tooltip title="Видалити пересторогу">
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
                if (event.target.value.length < 250) {
                  setTitle(event.target.value);
                  setVisRule(false);
                } else setVisRule(true);
              }}
              placeholder="Додати пересторогу"
              maxLength={250}
              onPressEnter={handleAdd}
              enterButton={<CheckOutlined onClick={handleAdd} />}
            />
          </Item>
          {visRule ? (
            <div>
              <Text type="danger">
                Поле не повинно містити більше 250 символів!
              </Text>
            </div>
          ) : (
            <></>
          )}
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
            placeholder="Редагувати пересторогу"
            value={curDist?.name}
            onChange={(event) =>
              setCurDist({
                id: curDist.id,
                name: event.target.value,
              })
            }
            maxLength={250}
            onPressEnter={handleEdit}
            enterButton={<SaveOutlined />}
            onSearch={handleEdit}
          />
        </Item>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FormEditPrecautionTypes;
