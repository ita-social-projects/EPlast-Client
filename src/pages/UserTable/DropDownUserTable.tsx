import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  FileSearchOutlined,
  DeleteOutlined,
  EditOutlined,
  ScissorOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import classes from "./UserTable.module.css";
import userDeleteCofirm from "./UserDeleteConfirm";
import ChangeUserRoleModal from "./ChangeUserRoleModal";
import ChangeUserCityModal from "./ChangeUserCityModal";
import adminApi from "../../api/adminApi";
import ModalAddPlastDegree from "../userPage/ActiveMembership/PlastDegree/ModalAddPlastDegree";
import ChangeUserRegionModal from "./ChangeUserRegionModal";
import ChangeUserClubModal from "./ChangeUserClubModal";
import AuthStore from '../../stores/AuthStore';
import jwt_decode from "jwt-decode";


interface Props {
  record: string;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  onDelete: (id: string) => void;
  onChange: (id: string, userRoles: string) => void;
  roles: string | undefined;
}

const { SubMenu } = Menu;

const DropDown = (props: Props) => {
  const history = useHistory();
  const { record, pageX, pageY, showDropdown, onDelete, onChange } = props;
  const [showEditModal, setShowEditModal] = useState(false);
  const [visibleModalDegree, setVisibleModalDegree] = useState<boolean>(false);
  const [showCityModal, setShowCityModal] = useState<boolean>(false);
  const [showRegionModal, setShowRegionModal] = useState<boolean>(false);
  const [showClubModal, setShowClubModal] = useState<boolean>(false);
  const [userRole, setUser] = useState<string[]>();
  const [canEdit, setCanEdit] = useState(false);
  const [canSee, setCanSee] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const [regionAdm, setRegionAdm] = useState(false);
  const [cityAdm, setCityAdm] = useState(false);
  const [clubAdm, setClubAdm] = useState(false);

  const handleItemClick = async (item: any) => {
    switch (item.key) {
      case "1":
        window.open(`/userpage/main/${record}`);
        break;
      case "2":
        await userDeleteCofirm(record, onDelete);
        break;
      case "3":
        await setShowCityModal(true);
        break;
      case "4":
        await setShowRegionModal(true);
        break;
      case "5":
        await setShowClubModal(true);
        break;
      case "6":
        await setShowEditModal(true);
        break;
      case "7":
        await setVisibleModalDegree(true);
        break;
      case "8":
        await adminApi.putExpiredRole(record);
        break;
      default:
        break;
    }
    item.key = "0";
  };
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
    setCanAccess(roles.includes("Прихильник")); 
  }

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
      <Menu
        theme="dark"
        onClick={handleItemClick}
        className={classes.menu}
        style={{
          top: pageY,
          left: (window.innerWidth - (pageX + 223)) < 0 ? window.innerWidth - 266 : pageX,
          display: showDropdown ? "block" : "none",
        }}
      >
        <Menu.Item key="1">
          <FileSearchOutlined />
          Переглянути профіль
        </Menu.Item>
        {(canEdit == true) ? (
        <Menu.Item key="2">
          <DeleteOutlined />
          Видалити
        </Menu.Item>
         ) : (<> </>)
        }
       {(canEdit == true || regionAdm == true || cityAdm == true || clubAdm == true) ? (
        <SubMenu key="sub" icon={<EditOutlined />} title="Змінити права доступу">
          {(canEdit == true || regionAdm == true || cityAdm == true) ? (
          <Menu.Item key="3">Провід станиці</Menu.Item>
          ) : (<> </>)
          }
          {(canEdit == true || regionAdm == true) ? (
          <Menu.Item key="4">Провід округи</Menu.Item>
          ) : (<> </>)
          }
          {(canEdit == true || clubAdm == true) ? (
          <Menu.Item key="5">Провід куреня</Menu.Item>
          ) : (<> </>)
          }
          {(canEdit == true || regionAdm == true || cityAdm == true) ? (
          <Menu.Item key="6">Поточний стан користувача</Menu.Item>
          ) : (<> </>)
          }
        </SubMenu>
        ) : (<> </>)
       }
        {(canEdit == true || regionAdm == true || cityAdm == true || clubAdm == true) ? (
        <Menu.Item key="7">
          <PlusCircleOutlined />
          Додати ступінь
        </Menu.Item>
         ) : (<> </>)
        }
         {(canEdit == true || regionAdm == true || cityAdm == true || clubAdm == true) ? (
        <Menu.Item key="8">
          <ScissorOutlined />
          Заархівувати користувача
        </Menu.Item>
         ) : (<> </>)
         }
        <ChangeUserRoleModal
          record={record}
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          onChange={onChange}
        />
        <ChangeUserCityModal
          record={record}
          showModal={showCityModal}
          setShowModal={setShowCityModal}
          onChange={onChange}
        />
        <ChangeUserRegionModal
          record={record}
          showModal={showRegionModal}
          setShowModal={setShowRegionModal}
          onChange={onChange}
          roles={props.roles}
        />
        <ChangeUserClubModal
          record={record}
          showModal={showClubModal}
          setShowModal={setShowClubModal}
          onChange={onChange}
        />
        <ModalAddPlastDegree
          handleAddDegree={() => { }}
          userId={record}
          visibleModal={visibleModalDegree}
          setVisibleModal={setVisibleModalDegree}
        />
      </Menu>
    </>
  );
};

export default DropDown;
