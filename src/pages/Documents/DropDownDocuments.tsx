import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import AuthStore from "../../stores/AuthStore";
import jwt_decode from "jwt-decode";
import classes from "./Table.module.css";
import deleteConfirm from "./DeleteConfirm";
import documentsApi from "../../api/documentsApi";
import { destroyFns } from "antd/lib/modal/Modal";
import { DocumentPost } from "../../models/Documents/DocumentPost";
import { Roles } from "../../models/Roles/Roles";

interface Props {
  record: number;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  onDelete: (id: number) => void;
  onEdit: (id: number, name: string, description: string) => void;
}

const DropDown = (props: Props) => {
  const { record, pageX, pageY, showDropdown, onDelete, onEdit } = props;
  const [showEditModal, setShowEditModal] = useState(false);
  const [regionAdm, setRegionAdm] = useState(false);
  const [cityAdm, setCityAdm] = useState(false);
  const [clubAdm, setClubAdm] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [supporter, setSupporter] = useState(false);
  const [plastMember, setPlastMember] = useState(false);
  const [userRole, setUserRole] = useState<string[]>();

  const [data, setData] = useState<DocumentPost>({
    id: 0,
    name: "",
    governingBody: {
      id: 0,
      description: "",
      phoneNumber: "",
      email: "",
      governingBodyName: "",
      logo: "",
    },
    type: 0,
    description: "",
    date: "",
    fileName: null,
  });
 
  const EditModal = () => setShowEditModal(true);

  useEffect(() => {
    const fetchData = async () => {
      let jwt = AuthStore.getToken() as string;
      let decodedJwt = jwt_decode(jwt) as any;
      let roles = decodedJwt[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] as string[];
      const res: Document[] = await documentsApi.getAll();
      setData(data);
      setUserRole(roles);
      setCanEdit(roles.includes(Roles.Admin));
      setRegionAdm(roles.includes(Roles.OkrugaHead));
      setCityAdm(roles.includes(Roles.CityHead));
      setClubAdm(roles.includes(Roles.KurinHead));
      setCanEdit(roles.includes(Roles.Admin) || roles.includes(Roles.GoverningBodyAdmin));
      setSupporter(roles.includes(Roles.Supporter));
      setPlastMember(roles.includes(Roles.PlastMember));
    };
    fetchData();
  }, []);

  /* eslint no-param-reassign: "error" */
  const handleItemClick = async (item: any) => {
    switch (item.key) {
      case "1":
        deleteConfirm(record, onDelete);
        break;
      case "2": {
        const pdf = await documentsApi.getPdf(record);
        window.open(pdf);
        break;
      }
    }
    item.key = "0";
  };

  return (
    <>
      <Menu
        theme="dark"
        onClick={handleItemClick}
        className={classes.menu}
        style={{
          top: pageY,
          left:
            window.innerWidth - (pageX + 184) < 0
              ? window.innerWidth - 227
              : pageX,
          display: showDropdown ? "block" : "none",
        }}
      >
        {canEdit == true ? (
          <Menu.Item key="1">
            <DeleteOutlined />
            Видалити
          </Menu.Item>
        ) : (
          <> </>
        )}

        <Menu.Item key="2">
          <FilePdfOutlined />
          Переглянути в PDF
        </Menu.Item>
      </Menu>
    </>
  );
};

export default DropDown;
