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
import { Roles } from '../../models/Roles/Roles';
import notificationLogic from "../../components/Notifications/Notification";
import {tryAgain} from "../../components/Notifications/Messages";
import DecisionLayout from "../../models/PDF/Decision/DecisionLayout";
import { fonts } from "../../models/PDF/fonts";
import pdfMake from "pdfmake/build/pdfmake";
import pdfVFS from "../../assets/VFS/vfs";

pdfMake.vfs = pdfVFS;
pdfMake.fonts = fonts;

interface Props {
  record: number;
  recordCreatorId: string;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  onDelete :(id: number)=> void;
  onEdit :(id: number, name: string, description: string) => void;
}

const DropDown = (props: Props) => {
  const { record, recordCreatorId, pageX, pageY, showDropdown, onDelete, onEdit } = props;
  const [showEditModal, setShowEditModal] = useState(false);
  const [userId, setUserId] = useState<string>();
  const [userRole, setUser] = useState<string[]>();
  const [canEdit, setCanEdit] = useState(false);
  const [canSee, setCanSee] = useState(false);
  const [regionAdm, setRegionAdm] = useState(false);
  const [regionAdmDeputy, setRegionAdmDeputy] = useState(false);
  const [cityAdm, setCityAdm] = useState(false);
  const [cityAdmDeputy, setCityAdmDeputy] = useState(false);
  const [clubAdm, setClubAdm] = useState(false);
  const [clubAdmDeputy, setClubAdmDeputy] = useState(false);
  const [data, setData] = useState<DecisionPost>({
    id: 0,
    name: "",
    decisionStatusType: 0,
    governingBody: {id : 0, description: "", phoneNumber: "", email: "" ,governingBodyName: "", logo: ""},
    decisionTarget: {id : 0 ,targetName : ""},
    description: "",
    date: "",
    userId: "",
    fileName: null,
});
const fetchUser = async () => {
  let jwt = AuthStore.getToken() as string;
  let decodedJwt = jwt_decode(jwt) as any;
  setUserId(decodedJwt.nameid);
  let roles = decodedJwt['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string[];
  setUser(roles);
  setCanEdit(roles.includes(Roles.Admin));
  setRegionAdm(roles.includes(Roles.OkrugaHead));
  setRegionAdmDeputy(roles.includes(Roles.OkrugaHeadDeputy));
  setCityAdm(roles.includes(Roles.CityHead));
  setCityAdmDeputy(roles.includes(Roles.CityHeadDeputy));
  setClubAdm(roles.includes(Roles.KurinHead));
  setClubAdmDeputy(roles.includes(Roles.KurinHeadDeputy));
  setCanSee(roles.includes(Roles.PlastMember));
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
  const handleViewPDF = async (id: number) => {
    try {
        let decision = await decisionsApi.getById(id);

        pdfMake.createPdf(DecisionLayout(decision)).open();
    } catch (error) {
        notificationLogic("error", tryAgain);
    }
};
  /* eslint no-param-reassign: "error" */
  const handleItemClick =async (item: any) => {
    switch (item.key) {
      case '1':
        setShowEditModal(true);
        break;
      case '2':{
        handleViewPDF(record);
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
        {(canEdit || ((regionAdm || regionAdmDeputy || cityAdm || cityAdmDeputy || clubAdm || clubAdmDeputy) &&
         (userId === recordCreatorId))) ? (
        <Menu.Item key="1">
          <EditOutlined />
          Редагувати
        </Menu.Item>
          ) : (<> </>)
        }
        <Menu.Item key="2">
          <FilePdfOutlined />
          Переглянути в PDF
        </Menu.Item>
        {(canEdit) ? (
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
