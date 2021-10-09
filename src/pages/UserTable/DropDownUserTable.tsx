import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  FileSearchOutlined,
  DeleteOutlined,
  EditOutlined,
  ScissorOutlined,
  PlusCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import classes from "./UserTable.module.css";
import userDeleteCofirm from "./UserDeleteConfirm";
import ChangeUserRoleModal from "./ChangeUserRoleModal";
import ChangeUserCityModal from "./ChangeUserCityModal";
import adminApi from "../../api/adminApi";
import ModalAddPlastDegree from "../userPage/ActiveMembership/PlastDegree/ModalAddPlastDegree";
import ChangeUserRegionModal from "./ChangeUserRegionModal";
import ChangeUserClubModal from "./ChangeUserClubModal";
import AuthorizeApi from "../../api/authorizeApi";
import UserApi from "../../api/UserApi";
import { Roles } from "../../models/Roles/Roles";
import { AdminRole } from "../../models/Roles/AdminRole";
import { NonAdminRole } from "../../models/Roles/NonAdminRole";
import { IDropdownItem, DropdownItemBuilder } from "./DropdownItem";
import { DropdownFunc } from "../../models/UserTable/DropdownFunc";

let authService = new AuthorizeApi();

interface Props {
  record: string;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  inActiveTab: boolean;
  onDelete: (id: string) => void;
  onChange: (id: string, userRoles: string) => void;
  selectedUser: any;
  selectedUserRoles: Array<string>;
  currentUser: any;
  canView: boolean;
}

const { SubMenu } = Menu;

const DropDown = (props: Props) => {
  const {
    record,
    pageX,
    pageY,
    showDropdown,
    inActiveTab,
    onDelete,
    onChange,
    selectedUser,
    selectedUserRoles,
    currentUser,
    canView
  } = props;

  const [showEditModal, setShowEditModal] = useState(false);
  const [visibleModalDegree, setVisibleModalDegree] = useState<boolean>(false);
  const [showCityModal, setShowCityModal] = useState<boolean>(false);
  const [showRegionModal, setShowRegionModal] = useState<boolean>(false);
  const [showClubModal, setShowClubModal] = useState<boolean>(false);

  const [superAdmin, setSuperAdmin] = useState<boolean>(false);
  const [governingBodyHead, setGoverningBodyHead] = useState<boolean>(true);

  const [currentUserAdminRoles, setCurrentUserAdminRoles] = useState<Array<AdminRole>>([]);
  const [selectedUserAdminRoles, setSelectedUserAdminRoles] = useState<Array<AdminRole>>([]);

  const [canDelete, setCanDelete] = useState<boolean>(false);
  const [canChangeCityAdministration, setCanChangeCityAdministration] = useState<boolean>(false);
  const [canChangeClubAdministration, setCanChangeClubAdministration] = useState<boolean>(false);
  const [canChangeRegionAdministration, setCanChangeRegionAdministration] = useState<boolean>(false);
  const [canChangeGoverningBodyAdministration, setCanChangeGoverningBodyAdministration] = useState<boolean>(false);
  const [canChangeUserAccess, setCanChangeUserAccess] = useState<boolean>(false);
  const [canAddDegree, setCanAddDegree] = useState<boolean>(false);

  const [chainOfAccessibility, setChainOfAccessibility] = useState<IDropdownItem>();
  
  //Takes only those roles, which can access User Table and 
  //writes them in array in descending order (as in AdminRole enum)
  const setUserAdminRoles = (allUserRoles: Array<string>) => {

    const userAdminRoles: Array<AdminRole> = new Array<AdminRole>();

    if (allUserRoles?.includes(Roles.Admin)) {
      userAdminRoles.push(AdminRole.Admin);
    }
    if (allUserRoles?.includes(Roles.GoverningBodyHead)) {
      userAdminRoles.push(AdminRole.GoverningBodyHead);
    }
    if (allUserRoles?.includes(Roles.OkrugaHead)) {
      userAdminRoles.push(AdminRole.RegionHead);
    }
    if (allUserRoles?.includes(Roles.OkrugaHeadDeputy)) {
      userAdminRoles.push(AdminRole.RegionHeadDeputy);
    }  
    if (allUserRoles?.includes(Roles.CityHead)) {
      userAdminRoles.push(AdminRole.CityHead);
    }
    if (allUserRoles?.includes(Roles.CityHeadDeputy)) {
      userAdminRoles.push(AdminRole.CityHeadDeputy);
    }
    if (allUserRoles?.includes(Roles.KurinHead)) {
      userAdminRoles.push(AdminRole.ClubHead);
    }      
    if (allUserRoles?.includes(Roles.KurinHeadDeputy)) {
      userAdminRoles.push(AdminRole.ClubHeadDeputy);
    }

    return userAdminRoles;
  };

  //Takes user Plast role, writes them in array in descending order (as in NonAdminRole enum)
  const setUserNonAdminRoles = (allUserRoles: Array<string>) => {
    const userNonAdminRoles: Array<NonAdminRole> = new Array<NonAdminRole>();

    if (allUserRoles?.includes(Roles.FormerPlastMember)) {
      userNonAdminRoles.push(NonAdminRole.FormerPlastMember);
    }
    if (allUserRoles?.includes(Roles.PlastMember)) {
      userNonAdminRoles.push(NonAdminRole.PlastMember);
    }
    if (allUserRoles?.includes(Roles.Supporter)) {
      userNonAdminRoles.push(NonAdminRole.Supporter);
    }
    if (allUserRoles?.includes(Roles.RegisteredUser)) {
      userNonAdminRoles.push(NonAdminRole.Registered);
    }

    return userNonAdminRoles;
  };

  const roles = UserApi.getActiveUserRoles();

  useEffect(() => {
    const buildChain = async () => {
      const builder: DropdownItemBuilder = new DropdownItemBuilder();
      setChainOfAccessibility(builder.build());
    };
    buildChain();
  }, []);

  const lookThroughChain = async () => {

    chainOfAccessibility?.handle(currentUser, setUserAdminRoles(roles), selectedUser, 
      setUserAdminRoles(selectedUserRoles), setUserNonAdminRoles(selectedUserRoles));

    return chainOfAccessibility?.getHandlersResults() ?? null;
  }

  const fetchUser = async () => {

    const result: Map<DropdownFunc, any> | null = await lookThroughChain();

    setCanDelete(result?.get(DropdownFunc.Delete) ?? false);
    
    setCanChangeRegionAdministration(result?.get(DropdownFunc.EditRegion) ?? false);

    setCanChangeCityAdministration(result?.get(DropdownFunc.EditCity) ?? false);

    setCanChangeClubAdministration(result?.get(DropdownFunc.EditClub) ?? false);
      
    // setCanChangeGoverningBodyAdministration(result);

    setCanChangeUserAccess(result?.get(DropdownFunc.EditRole) ?? false);

    setCanAddDegree(result?.get(DropdownFunc.AddDegree) ?? false);

    setSuperAdmin(currentUserAdminRoles.includes(AdminRole.Admin));
    setGoverningBodyHead(currentUserAdminRoles.includes(AdminRole.GoverningBodyHead));
  };

  useEffect(() => {
    fetchUser();
  }, [selectedUser]);

  const handleItemClick = async (item: any) => {
    switch (item.key) {
      case "1":
        window.open(`/userpage/main/${record}`);
        break;
      case "2":
        await userDeleteCofirm(record, onDelete);
        break;
      case "3":
        await setShowRegionModal(true);
        break;
      case "4":
        await setShowCityModal(true);
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
      case "9":
        await authService.resendEmailForRegistering(record);
        break;
      default:
        break;
    }
    item.key = "0";
  };

  return (
    <>
      {canView ? <Menu
        theme="dark"
        className={classes.menu}
        onClick={handleItemClick}
        style={{
          top: pageY,
          left:
            window.innerWidth - (pageX + 223) < 0
              ? window.innerWidth - 266
              : pageX,
          display: showDropdown ? "block" : "none",
        }}
      >
        {props.inActiveTab === false && canView ? (
          <Menu.Item key="1">
            <FileSearchOutlined />
            Переглянути профіль
          </Menu.Item>
        ) : (
          <> </>
        )}
        {props.inActiveTab === false && canDelete ? (
          <Menu.Item key="2">
            <DeleteOutlined />
            Видалити
          </Menu.Item>
        ) : (
          <> </>
        )}
        {props.inActiveTab === false && canChangeRegionAdministration ? (
          <Menu.Item key="3">
            <EditOutlined />
            Провід округи
          </Menu.Item>
        ) : (
          <> </>
        )}
        {props.inActiveTab === false && canChangeCityAdministration ? (
          <Menu.Item key="4">
            <EditOutlined />
            Провід станиці
          </Menu.Item>
        ) : (
          <> </>
        )}
        {props.inActiveTab === false && canChangeClubAdministration ? (
          <Menu.Item key="5" >
            <EditOutlined />
            Провід куреня
          </Menu.Item>
        ) : (
          <> </>
        )}
        {props.inActiveTab === false && canChangeUserAccess ? (
          <Menu.Item key="6">
            <EditOutlined />
            Поточний стан користувача
          </Menu.Item>
        ) : (
          <> </>
        )}
        {props.inActiveTab === false && canAddDegree ? (
          <Menu.Item key="7">
            <PlusCircleOutlined />
            Додати ступінь
          </Menu.Item>
        ) : (
          <> </>
        )}
        {props.inActiveTab === false && superAdmin ? (
          <Menu.Item key="9">
            <MailOutlined />
            Активувати
          </Menu.Item>
        ) : (
          <> </>
        )}
        <ChangeUserRoleModal
          record={record}
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          onChange={onChange}
          user={selectedUser}
        />
        <ChangeUserCityModal
          record={record}
          showModal={showCityModal}
          setShowModal={setShowCityModal}
          user={selectedUser}
          onChange={onChange}
        />
        <ChangeUserRegionModal
          record={record}
          showModal={showRegionModal}
          setShowModal={setShowRegionModal}
          onChange={onChange}
          user={selectedUser}
        />
        <ChangeUserClubModal
          record={record}
          showModal={showClubModal}
          user={selectedUser}
          setShowModal={setShowClubModal}
          onChange={onChange}
        />
        <ModalAddPlastDegree
          handleAddDegree={() => { }}
          userId={record}
          visibleModal={visibleModalDegree}
          setVisibleModal={setVisibleModalDegree}
        />
      </Menu> : null}
    </>
  );
};

export default DropDown;
