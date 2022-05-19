import React, { useEffect } from "react";
import { List, Tooltip, Typography } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  SaveOutlined,
  PlusOutlined,
  HighlightOutlined,
} from "@ant-design/icons";
import classes from "./FormEdit.module.css";
import Item from "antd/lib/list/Item";
import DeleteTypeConfirm from "./DeleteTypeConfirm";
import Search from "antd/lib/input/Search";
import Text from "antd/lib/typography/Text";
import { createHook } from "react-sweet-state";
import PrecautionStore from "./PrecautionStore";

const FormEditPrecautionTypes = () => {
  const useStore = createHook(PrecautionStore);
  const [state, actions] = useStore();

  useEffect(() => {
    actions.setEditLoading(true);
    actions.editFetchData();
    actions.setEditLoading(false);
  }, []);

  return (
    <div>
      <List
        className={classes.list}
        header={null}
        footer={null}
        bordered
        rowKey="id"
        loading={state.editLoading}
        dataSource={state.editDistData}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Tooltip title="Редагувати перестороги">
                <EditOutlined
                  className={classes.editIcon}
                  onClick={() => actions.editShowEdit(item.id)}
                />
              </Tooltip>,
              <Tooltip title="Видалити пересторогу">
                <DeleteOutlined
                  className={classes.deleteIcon}
                  onClick={() => DeleteTypeConfirm(item.id, actions.editHandleDelete)}
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
      {!state.editVisible ? (
        <div className={classes.addDiv}>
          <Item>
            <Search
              prefix={<PlusOutlined />}
              size="large"
              className={classes.inputField}
              name="inputName"
              value={state.editTitle}
              onChange={(event) => {
                if (event.target.value.length < 250) {
                  actions.editSetTitle(event.target.value)                  
                  actions.editSetVisRule(false);
                } else actions.editSetVisRule(true);
              }}
              placeholder="Додати пересторогу"
              maxLength={250}
              onPressEnter={actions.editHandleAdd}
              enterButton={<CheckOutlined onClick={actions.editHandleAdd} />}
            />
          </Item>
          {state.editVisRule ? (
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
      {state.editVisible ? (
        <Item>
          <Search
            size="large"
            prefix={<HighlightOutlined />}
            className={classes.inputField}
            name="editName"
            placeholder="Редагувати пересторогу"
            value={state.editCurDist?.name}
            onChange={(event) =>
              actions.editSetCurDist({
                id: state.editCurDist.id,
                name: event.target.value,
              })
            }
            maxLength={250}
            onPressEnter={actions.editHandleEdit}
            enterButton={<SaveOutlined />}
            onSearch={actions.editHandleEdit}
          />
        </Item>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FormEditPrecautionTypes;