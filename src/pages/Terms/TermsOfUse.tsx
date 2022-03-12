import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Button, Layout, Collapse } from "antd";
import { DatePicker } from "antd";
import Spinner from "../Spinner/Spinner";
import termsApi from "../../api/termsApi";
import { EditOutlined } from "@ant-design/icons";
import "./TermsOfUse.less";
import React from "react";
import { Markup } from "interweave";
import moment from "moment";
import UserApi from "../../api/UserApi";
import { Roles } from "../../models/Roles/Roles";
import TermsOfUseModel from "../../models/TermsOfUse/TermsOfUseModel";

const { Content } = Layout;
const { Panel } = Collapse;

const TermsOfUse = () => {
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const dateFormat = "DD-MM-YYYY";
  const [terms, setTerms] = useState<TermsOfUseModel>({
    termsId: 0,
    termsTitle: "Немає даних",
    termsText: "Немає даних",
    datePublication: new Date(),
  });

  const fetchTermsData = async () => {
    setLoading(true);
    const termsData: TermsOfUseModel = await termsApi.getTerms();
    setTerms(termsData);
    setLoading(false);
  };

  const fetchUser = () => {
    let roles = UserApi.getActiveUserRoles();
    setCanEdit(roles.includes(Roles.Admin));
  };

  useEffect(() => {
    fetchTermsData();
    fetchUser();
  }, []);

  function handleClick() {
    history.push("/terms/edit");
  }

  return !loading ? (
    <Layout.Content className="terms">
      <h1 className="termstitle">{terms.termsTitle}</h1>
      <div className="dateAndEdit">
        <div>
          <DatePicker
            value={moment(terms.datePublication)}
            format={dateFormat}
            disabled
          />
        </div>
        <div className="buttonEditdiv">
          {canEdit ? (
            <Button onClick={handleClick}>{<EditOutlined />}</Button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="textTerms">
        {<Markup className="markupText" content={terms.termsText} />}
      </div>
    </Layout.Content>
  ) : (
    <Spinner />
  );
};
export default TermsOfUse;
