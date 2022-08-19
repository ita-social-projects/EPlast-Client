import { Avatar, Card, Spin, Tooltip } from "antd";
import Meta from "antd/lib/card/Meta";
import moment from "moment";
import React, { useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Roles } from "../../../models/Roles/Roles";
import { ApproversData, ApproveType, ConfirmedUser } from "../Interface/Interface";
import DeleteApproveButton from "./DeleteApproveButton";
import AddUser from "../../../assets/images/user_add.png";
import { PersonalDataContext } from "../personalData/PersonalData";


interface ApproversCardProps {
  title: string
  data: ApproversData
  confirmedUsers: ConfirmedUser[]
  activeUserRoles: string[]
  approveType: ApproveType
  onDeleteApprove: (id: number) => Promise<void>
  approveAsMemberLoading: boolean
  onApproveClick: (userId: string, approveType: ApproveType) => Promise<void>
  canApprove: boolean
  canDelete: boolean
}

const ApproversCard: React.FC<ApproversCardProps> = ({
  title,
  data,
  confirmedUsers,
  onDeleteApprove,
  activeUserRoles,
  approveType,
  approveAsMemberLoading,
  onApproveClick,
  canApprove,
  canDelete
}) => {
  const history = useHistory();
  const { userId } = useParams();

  const AccessToManage = (roles: string[]): boolean => {
    for (var i = 0; i < roles.length; i++) {
      if (Roles.PlastMember.includes(roles[i])) return true;
    }
    return false;
  };

  const {
    userProfile
  } = useContext(PersonalDataContext);

  return <>
    <h1 className="approversCard">{title}</h1>
    <div className="approversCard">
      {confirmedUsers?.map((p) =>
        <div key={p.id}>
          <Card
            key={p.id}
            hoverable
            className="cardStyles"
            cover={
              <Avatar
                alt="example"
                src={p.approver.user.imagePath}
                className="avatar"
              />
            }
          >
            <Tooltip
              title={
                p.approver.user.firstName +
                " " +
                p.approver.user.lastName
              }
            >
              <Link
                to={"/userpage/main/" + p.approver.userID}
                onClick={() =>
                  history.push(`/userpage/main/${p.approver.userID}`)
                }
              >
                <Meta
                  title={
                    p.approver.user.firstName +
                    " " +
                    p.approver.user.lastName
                  }
                  className="titleText"
                />
              </Link>
            </Tooltip>
            <Meta
              title={moment
                .utc(p.confirmDate)
                .local()
                .format("DD.MM.YYYY")}
              className="title-not-link"
            />
            {(canDelete || p.approver.userID == data?.currentUserId)
              && userProfile!.isUserPlastun === false ?
              (
                <DeleteApproveButton
                  approverId={p.id}
                  onDeleteApprove={onDeleteApprove}
                />
              )
              : <p className="cardP" />
            }
          </Card>
        </div>
      )}
      <div>
        {canApprove ? (
          <div>
            <Tooltip
              title="Поручитися за користувача"
              placement="rightBottom"
            >
              <Spin spinning={approveAsMemberLoading}>
                <Link to="#" onClick={() => onApproveClick(data?.user.id, approveType)}>
                  <Card
                    hoverable
                    className="cardStyles"
                    cover={
                      <Avatar
                        src={AddUser}
                        alt="example"
                        size={166}
                        className="avatarEmpty"
                        shape="square"
                      />
                    }
                  >
                    <p className="cardP" />
                    <p className="cardP" />
                  </Card>
                </Link>
              </Spin>
            </Tooltip>
          </div>
        ) : (
          <div
            hidden={
              confirmedUsers!.length != 0 ||
              (data?.canApprove &&
                AccessToManage(
                  activeUserRoles.filter(
                    (r) =>
                      r != Roles.Supporter &&
                      r != Roles.RegisteredUser &&
                      activeUserRoles.includes(Roles.Admin)
                  )
                ))
            }
          >
            <br />
            <br />
            На жаль, поруки відсутні
            <br />
            <br />
          </div>
        )}
      </div>
    </div>
  </>
}

export default ApproversCard;