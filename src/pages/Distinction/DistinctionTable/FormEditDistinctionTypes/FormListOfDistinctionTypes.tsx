import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { List, Tooltip, Typography } from "antd";
import React, { useEffect } from "react";
import { useDistinctions } from "../../../../stores/DistinctionsStore";
import classes from "../FormEdit.module.css";
import DeleteTypeConfirm from "./DeleteTypeConfirm";
import FormAddDistinctionType from "./FormAddDistinctionType";
import FormEditDistinctionType from "./FormEditDistinctionType";

const FormListOfDistinctionTypes: React.FC = () => {
  const [state, actions] = useDistinctions();

  useEffect(() => {
    if (state.editDistinctionTypesModalIsVisible) {
      actions.fetchDistinctions();
    }
  }, [state.editDistinctionTypesModalIsVisible]);

  return (
    <>
      <List
        className={classes.list}
        header={null}
        footer={null}
        bordered
        rowKey="id"
        dataSource={state.distinctionTypes}
        renderItem={(item) => (
          <List.Item
            actions={[
              state.editedDistinction.id !== item.id && (
                <Tooltip title="Редагувати відзначення">
                  <EditOutlined
                    className={classes.editIcon}
                    onClick={() => actions.openDistinctionEditForm(item)}
                  />
                </Tooltip>
              ),
              <Tooltip title="Видалити відзначення">
                <DeleteOutlined
                  className={classes.deleteIcon}
                  onClick={() =>
                    DeleteTypeConfirm(item.id, actions.deleteDistinction)
                  }
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
      <br />
      {state.editDistinctionIsVisible ? (
        <FormEditDistinctionType />
      ) : (
        <FormAddDistinctionType />
      )}
    </>
  );
};

export default FormListOfDistinctionTypes;
