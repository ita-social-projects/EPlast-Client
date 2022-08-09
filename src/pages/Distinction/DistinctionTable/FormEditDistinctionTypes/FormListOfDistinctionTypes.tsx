import { CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { List, Tooltip, Typography } from "antd";
import React, { useEffect } from "react";
import { useDistinctions } from "../../../../stores/DistinctionsStore";
import Distinction from "../../Interfaces/Distinction";
import classes from "../FormEdit.module.css";
import DeleteTypeConfirm from "./DeleteTypeConfirm";
import FormAddDistinctionType from "./FormAddDistinctionType";
import FormEditDistinctionType from "./FormEditDistinctionType";

type FormListOfDistinctionTypesProps = {
  setVisibleModal: (visibleModal: boolean) => void;
  onDelete: () => void;
};

let defaultDist: Distinction = {
  name: "",
  id: 0,
};
const typeMaxLength = 200;

const FormListOfDistinctionTypes: React.FC<FormListOfDistinctionTypesProps> = (
  props: any
) => {
  const [state, actions] = useDistinctions();

  useEffect(() => {
    actions.fetchData();
  }, []);

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
              state.editedDistinction.id == item.id ? (
                <Tooltip title="Редагувати відзначення">
                  <CloseOutlined
                    className={classes.editIcon}
                    onClick={actions.closeEditForm}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Редагувати відзначення">
                  <EditOutlined
                    className={classes.editIcon}
                    onClick={() => actions.openEditForm(item)}
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
      {state.editIsVisible ? (
        <FormEditDistinctionType />
      ) : (
        <FormAddDistinctionType />
      )}
    </>
  );
};

export default FormListOfDistinctionTypes;
