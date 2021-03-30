import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import {
  FilePdfOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import AuthStore from '../../stores/AuthStore';
import jwt_decode from "jwt-decode";
import classes from './Table.module.css';
import EditDecisionModal from './EditDecisionModal';
import deleteConfirm from './DeleteConfirm';
import decisionsApi, { DecisionPost } from '../../api/decisionsApi';

interface Props {
  record: number;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  onDelete :(id: number)=> void;
  onEdit :(id: number, name: string, description: string) => void;
}

const DropDown = (props: Props) => {
  const { record, pageX, pageY, showDropdown, onDelete, onEdit } = props;
  const [showEditModal, setShowEditModal] = useState(false);
  const [userRole, setUser] = useState<string[]>();
  const [canEdit, setCanEdit] = useState(false);
  const [canSee, setCanSee] = useState(false);
  const [regionAdm, setRegionAdm] = useState(false);
  const [cityAdm, setCityAdm] = useState(false);
  const [clubAdm, setClubAdm] = useState(false);
  const [data, setData] = useState<DecisionPost>({
    id: 0,
    name: "",
    decisionStatusType: 0,
    governingBody: {id : 0, description: "", phoneNumber: "", email: "" ,governingBodyName: "", logo: ""},
    decisionTarget: {id : 0 ,targetName : ""},
    description: "",
    date: "",
    fileName: null,
});
const fetchUser = async () => {
  let jwt = AuthStore.getToken() as string;
  let decodedJwt = jwt_decode(jwt) as any;
  let roles = decodedJwt['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string[];
  setUser(roles);
  setCanEdit(roles.includes("Admin"));
  setRegionAdm(roles.includes("Голова Округи"));
  setCityAdm(roles.includes("Голова Станиці"));
  setClubAdm(roles.includes("Голова Куреня"));
  setCanSee(roles.includes("Пластун"));
}
const fetchData = async () =>{
  await decisionsApi.getById(record).then(res => setData(res));
}
  useEffect(() => {
    if(showEditModal)
    {
    fetchData();
    }
  }
  ,[showEditModal]);

  useEffect(() => {
    fetchUser();
  }
  ,[]);
  
  /* eslint no-param-reassign: "error" */
  const handleItemClick =async (item: any) => {
    switch (item.key) {
      case '1':
        setShowEditModal(true);
        break;
      case '2':{
        const pdf = await decisionsApi.getPdf(record);
        window.open(pdf);
        break;
      }
      case '3':
        deleteConfirm(record, onDelete);
        break;
      default:
        break;
    }
    item.key = '0'
  };

  return (
    <>
      <Menu
        theme="dark"
        onClick={handleItemClick}
        className={classes.menu}
        style={{
          top: pageY,
          left: (window.innerWidth - (pageX + 184)) < 0 ? window.innerWidth - 227 : pageX ,
          display: showDropdown ? 'block' : 'none',
        }
        }
      >
        {(canEdit === true || regionAdm === true || cityAdm === true || clubAdm === true) ? (
        <Menu.Item key="1">
          <EditOutlined />
          Редагувати
        </Menu.Item>
          ) : (<> </>)
        }
        <Menu.Item key="2">
          <FilePdfOutlined />
          Конвертувати в PDF
        </Menu.Item>
        {(canEdit === true) ? (
        <Menu.Item key="3">
          <DeleteOutlined />
          Видалити
        </Menu.Item>
        ) : (<> </>)
              }
      </Menu>
      <EditDecisionModal
        record={record}
        decision ={ data}
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        onEdit = {onEdit}
      />
    </>
  );
};

export default DropDown;
