import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import notificationLogic from "../../../components/Notifications/Notification";
import {
  getDocumentByUserId,
  removeDocument,
  getFile,
  getAllAchievementDocumentsByUserId,
  openBiographyFile,
  getExtractFromUPUByUserId,
  removeExtractFromUPUDocument,
  getExtractFromUPUFile,
  openExtractFromUPUFile,
  openGenerationFile,
} from "../../../api/blankApi";
import { Badge, Button, Col, Form, Popconfirm, Skeleton, Tooltip } from "antd";
import classes from "./Blanks.module.css";
import Title from "antd/lib/typography/Title";
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import AddBiographyModal from "./UserBiography/AddBiographyModal";
import BlankDocument from "../../../models/Blank/BlankDocument";
import Paragraph from "antd/lib/typography/Paragraph";
import AddAchievementsModal from "./UserAchievements/AddAchievementsModal";
import AuthLocalStorage from "../../../AuthLocalStorage";
import jwt from "jwt-decode";
import ListOfAchievementsModal from "./UserAchievements/ListOfAchievementsModal";
import AddExtractFromUPUModal from "./UserExtractFromUPU/AddExtractFromUPUModal";
import { successfulDeleteAction } from "../../../components/Notifications/Messages";
import AvatarAndProgressStatic from "../personalData/AvatarAndProgressStatic";
import { Roles } from "../../../models/Roles/Roles";
import { PersonalDataContext } from "../personalData/PersonalData";
import { StickyContainer } from "react-sticky";
const userGenders = ["Чоловік", "Жінка", "Інша"];
const fileNameMaxLength = 50;

export const Blanks = () => {
  const { userId } = useParams<{ userId: string }>();
  const {
    fullUserProfile,
    activeUserRoles,
    userProfileAccess,
    userBlankAccess,
    loading,
  } = useContext(PersonalDataContext);
  const [document, setDocument] = useState<BlankDocument>(new BlankDocument());
  const [achievementDoc, setAchievementDoc] = useState<BlankDocument[]>([]);
  const [extractUPU, setExtractUPU] = useState<BlankDocument>(
    new BlankDocument()
  );
  const [visibleModal, setVisibleModal] = useState(false);
  const [
    visibleListAchievementModal,
    setVisibleListAchievementModal,
  ] = useState(false);
  const [visibleExtractFromUPUModal, setVisibleExtractFromUPUModal] = useState(
    false
  );
  const [visibleAchievementModal, setvisibleAchievementModal] = useState(false);
  const [loadingBlanks, setLoadingBlanks] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [userToken, setUserToken] = useState<any>([
    {
      nameid: "",
    },
  ]);

  const [documentFormat, setDocumentFormat] = useState<string | undefined>();
  const [extractUPUFormat, setExtractUPUFormat] = useState<
    string | undefined
  >();

  const fetchData = async () => {
    const token = AuthLocalStorage.getToken() as string;
    setUserToken(jwt(token));
    setCanEdit(activeUserRoles.includes(Roles.Admin));
  };

  const getAppropriateToGenderVerb = () => {
    if (userGenders[0] === fullUserProfile?.user.gender?.name) return "додав";
    if (userGenders[1] === fullUserProfile?.user.gender?.name) return "додала";
    return "додав(ла)";
  };

  const getDocument = async () => {
    const response = await getDocumentByUserId(userId);
    setDocument(response.data);
    setDocumentFormat(getFormat(response.data.fileName));
  };
  const getAchievementDocumentsByUserId = async () => {
    const response = await getAllAchievementDocumentsByUserId(userId);
    setAchievementDoc(response.data);
  };
  const getExtractFromUPU = async () => {
    const response = await getExtractFromUPUByUserId(userId);
    setExtractUPU(response.data);
    setExtractUPUFormat(getFormat(response.data.fileName));
  };
  const getPdf = async () => {
    const pdfLink = await openGenerationFile(userId);
    window.open(pdfLink);
  };
  const removeDocumentById = async (documentId: number) => {
    await removeDocument(documentId);
    notificationLogic("success", successfulDeleteAction("Файл"));
    await getDocument();
  };
  const removeExtractDocument = async (documentId: number) => {
    await removeExtractFromUPUDocument(documentId);
    notificationLogic("success", successfulDeleteAction("Файл"));
    await getExtractFromUPU();
  };
  const downloadExtractDocument = async (
    fileBlob: string,
    fileName: string
  ) => {
    await getExtractFromUPUFile(fileBlob, fileName);
  };
  const downloadDocument = async (fileBlob: string, fileName: string) => {
    await getFile(fileBlob, fileName);
  };
  const openDocument = async (fileBlob: string, fileName: string) => {
    await openBiographyFile(fileBlob, fileName);
  };
  const openExtractFromUPUDocument = async (
    fileBlob: string,
    fileName: string
  ) => {
    await openExtractFromUPUFile(fileBlob, fileName);
  };
  const getFormat = (fileName: string) => {
    if (fileName != undefined) return fileName.split(".").pop()!;
  };
  useEffect(() => {
    fetchData();
    getDocument();
    getAchievementDocumentsByUserId();
    getExtractFromUPU();
    setLoadingBlanks(true);
  }, [
    visibleModal,
    visibleAchievementModal,
    visibleExtractFromUPUModal,
    visibleListAchievementModal
  ]);

  return (loading && loadingBlanks) === false ? (
    <div className="kadraWrapper">
      <Skeleton.Avatar
        size={220}
        active={true}
        shape="circle"
        className="img"
      />
    </div>
  ) : (
    <>
      <Form name="basic" className="formContainer">
        <div className="wrapperContainer">
          <div className="avatarWrapperUserFields">
            <StickyContainer className="kadraWrapper">
              <AvatarAndProgressStatic
                time={fullUserProfile?.timeToJoinPlast}
                firstName={fullUserProfile?.user.firstName}
                lastName={fullUserProfile?.user.lastName}
                isUserPlastun={true}
                pseudo={fullUserProfile?.user.pseudo}
                governingBody={fullUserProfile?.user.governingBody}
                region={fullUserProfile?.user.region}
                city={fullUserProfile?.user.city}
                club={fullUserProfile?.user.club}
                governingBodyId={fullUserProfile?.user.governingBodyId}
                regionId={fullUserProfile?.user.regionId}
                cityId={fullUserProfile?.user.cityId}
                clubId={fullUserProfile?.user.clubId}
                cityMemberIsApproved={
                  fullUserProfile?.user.cityMemberIsApproved
                }
                clubMemberIsApproved={
                  fullUserProfile?.user.clubMemberIsApproved
                }
                showPrecautions={fullUserProfile?.shortUser === null}
              />
            </StickyContainer>
          </div>
        </div>
        <div className="allFields">
          <div className={classes.wrapper}>
            <div className={classes.wrapper2}>
              <Title level={2}>Життєпис</Title>
              {document.userId === userId ? (
                <Col
                  className={classes.colBlank}
                  xs={18}
                  sm={18}
                  key={document.id}
                >
                  <div>
                    {document.blobName.split(".").pop()! === "pdf" && (
                      <FilePdfOutlined className={classes.documentIcon} />
                    )}
                    {"jpg, jpeg, png".includes(
                      document.blobName.split(".").pop()!
                    ) && <FileImageOutlined className={classes.documentIcon} />}
                    {"docx, doc".includes(document.blobName.split(".").pop()!) && (
                      <FileTextOutlined className={classes.documentIcon} />
                    )}
                    {document.fileName?.length > fileNameMaxLength ? (
                      <Tooltip
                        className={classes.antTooltipInner}
                        title={document.fileName}
                      >
                        <Paragraph ellipsis={{ rows: 2, suffix: " " }}>
                          {document.fileName.slice(0, fileNameMaxLength - 1) +
                            "..."}
                        </Paragraph>
                      </Tooltip>
                    ) : (
                      <Paragraph ellipsis={{ rows: 2, suffix: " " }}>
                        {document.fileName}
                      </Paragraph>
                    )}
                  </div>
                  {userBlankAccess["CanDownloadBiography"] && (
                    <Tooltip title="Завантажити">
                      <DownloadOutlined
                        className={classes.downloadIcon}
                        key="download"
                        onClick={() =>
                          downloadDocument(document.blobName, document.fileName)
                        }
                      />
                    </Tooltip>
                  )}

                  {userBlankAccess["CanViewBiography"] &&
                  documentFormat !== "doc" &&
                  documentFormat !== "docx" ? (
                    <Tooltip title="Переглянути">
                      <EyeOutlined
                        className={classes.reviewIcon}
                        key="review"
                        onClick={() =>
                          openDocument(document.blobName, document.fileName)
                        }
                      />
                    </Tooltip>
                  ) : null}
                  {userBlankAccess["CanDeleteBiography"] ? (
                    <Tooltip title="Видалити">
                      <Popconfirm
                        title="Видалити цей документ?"
                        placement="bottom"
                        icon={false}
                        onConfirm={() => removeDocumentById(document.id)}
                        okText="Так"
                        cancelText="Ні"
                      >
                        <DeleteOutlined
                          className={classes.deleteIcon}
                          key="close"
                        />
                      </Popconfirm>
                    </Tooltip>
                  ) : null}
                </Col>
              ) : (
                <Col className={classes.colBlank}>
                  {userToken.nameid === userId && (
                    <h2>Ви ще не додали Життєпис</h2>
                  )}
                  {userToken.nameid !== userId && (
                    <h2>
                      {fullUserProfile?.user.firstName} ще не{" "}
                      {getAppropriateToGenderVerb()} Життєпис
                    </h2>
                  )}
                  {userBlankAccess["CanAddBiography"] && (
                    <div>
                      <Button
                        type="primary"
                        className={classes.addIcon}
                        onClick={() => setVisibleModal(true)}
                      >
                        Додати Життєпис
                      </Button>
                    </div>
                  )}
                </Col>
              )}
            </div>

            <div className={classes.wrapper3}>
              <Title level={2}>Виписка з УПЮ</Title>
              {extractUPU.userId == userId ? (
                <Col
                  className={classes.colBlank}
                  xs={18}
                  sm={18}
                  key={document.id}
                >
                  <div>
                    {extractUPU.blobName.split(".").pop()! === "pdf" && (
                      <FilePdfOutlined className={classes.documentIcon} />
                    )}
                    {"jpg, jpeg, png".includes(
                      extractUPU.blobName.split(".").pop()!
                    ) && <FileImageOutlined className={classes.documentIcon} />}
                    {"docx, doc".includes(
                      extractUPU.blobName.split(".").pop()!
                    ) && <FileTextOutlined className={classes.documentIcon} />}
                    {extractUPU.fileName?.length > fileNameMaxLength ? (
                      <Tooltip
                        className={classes.antTooltipInner}
                        title={extractUPU.fileName}
                      >
                        <Paragraph ellipsis={{ rows: 2, suffix: " " }}>
                          {extractUPU.fileName.slice(0, fileNameMaxLength - 1) +
                            "..."}
                        </Paragraph>
                      </Tooltip>
                    ) : (
                      <Paragraph ellipsis={{ rows: 2, suffix: " " }}>
                        {extractUPU.fileName}
                      </Paragraph>
                    )}
                  </div>
                  <Tooltip title="Завантажити">
                    <DownloadOutlined
                      hidden={
                        !(userBlankAccess["CanViewAddDownloadDeleteExtractUPU"])
                      }
                      className={classes.downloadIcon}
                      key="download"
                      onClick={() =>
                        downloadExtractDocument(
                          extractUPU.blobName,
                          extractUPU.fileName
                        )
                      }
                    />
                  </Tooltip>
                  {userBlankAccess["CanViewAddDownloadDeleteExtractUPU"] &&
                  extractUPUFormat !== "doc" &&
                  extractUPUFormat !== "docx" ? (
                    <Tooltip title="Переглянути">
                      <EyeOutlined
                        className={classes.reviewIcon}
                        key="review"
                        onClick={() =>
                          openExtractFromUPUDocument(
                            extractUPU.blobName,
                            extractUPU.fileName
                          )
                        }
                      />
                    </Tooltip>
                  ) : null}
                  <Tooltip title="Видалити">
                    <Popconfirm
                      title="Видалити цей документ?"
                      placement="bottom"
                      icon={false}
                      onConfirm={() => removeExtractDocument(extractUPU.id)}
                      okText="Так"
                      cancelText="Ні"
                    >
                      <DeleteOutlined
                        hidden={
                          !(
                            userBlankAccess["CanViewAddDownloadDeleteExtractUPU"]
                          )
                        }
                        className={classes.deleteIcon}
                        key="close"
                      />
                    </Popconfirm>
                  </Tooltip>
                </Col>
              ) : (
                <Col className={classes.colBlank}>
                  {userToken.nameid === userId && (
                    <h2>Ви ще не додали Виписку</h2>
                  )}
                  {userToken.nameid !== userId && (
                    <h2>
                      {fullUserProfile?.user.firstName} ще не{" "}
                      {getAppropriateToGenderVerb()} Виписку
                    </h2>
                  )}
                  <div>
                    <Button
                      type="primary"
                      hidden={
                        !(
                          userBlankAccess["CanViewAddDownloadDeleteExtractUPU"]
                        )
                      }
                      className={classes.addIcon}
                      onClick={() => setVisibleExtractFromUPUModal(true)}
                    >
                      Додати Виписку
                    </Button>
                  </div>
                </Col>
              )}
            </div>
          </div>

          <div className={classes.wrapper}>
            <div className={classes.wrapper4}>
              <Title level={2}>Досягнення</Title>
              {achievementDoc.length !== 0 ? (
                <div>
                  <Col>
                    <Badge
                      count={achievementDoc.length}
                      style={{ backgroundColor: "#3c5438" }}
                    />
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      className={classes.listButton}
                      onClick={() => setVisibleListAchievementModal(true)}
                    >
                      Список
                    </Button>
                  </Col>
                </div>
              ) : (
                <Col>
                  {userToken.nameid === userId && (
                    <h2>Ви ще не додали жодного Досягнення</h2>
                  )}
                  {userToken.nameid !== userId && (
                    <h2>
                      {fullUserProfile?.user.firstName} ще не{" "}
                      {getAppropriateToGenderVerb()} жодного Досягнення
                    </h2>
                  )}
                </Col>
              )}
              <Col>
                <div>
                  <Button
                    type="primary"
                    hidden={
                      !(
                        userBlankAccess["CanAddAchievement"]
                      )
                    }
                    className={classes.addIcon}
                    onClick={() => setvisibleAchievementModal(true)}
                  >
                    Додати Досягнення
                  </Button>
                </div>
              </Col>
            </div>

            <div className={classes.wrapper5}>
              <Title level={2}>Заява для вступу</Title>
              <FileTextOutlined className={classes.documentIcon} />
              <Button
                hidden={
                  !(
                    userBlankAccess["CanGenerateFile"]
                  )
                }
                className={classes.addIcon}
                type="primary"
                onClick={() => getPdf()}
              >
                Згенерувати файл
              </Button>
            </div>
          </div>
        </div>
      </Form>

      <ListOfAchievementsModal
        userToken={userToken}
        visibleModal={visibleListAchievementModal}
        setVisibleModal={setVisibleListAchievementModal}
        hasAccessToSee={
          userBlankAccess["CanViewListOfAchievements"]
        }
        hasAccessToDownload={
          userBlankAccess["CanDownloadAchievement"]
        }
        hasAccessToDelete={
          userBlankAccess["CanDeleteAchievement"]
        }
      />

      <AddAchievementsModal
        userId={fullUserProfile?.user.id}
        visibleModal={visibleAchievementModal}
        setVisibleModal={setvisibleAchievementModal}
      />

      <AddBiographyModal
        userId={fullUserProfile?.user.id}
        document={document}
        setDocument={setDocument}
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
      />

      <AddExtractFromUPUModal
        userId={fullUserProfile?.user.id}
        document={extractUPU}
        setDocument={setExtractUPU}
        visibleModal={visibleExtractFromUPUModal}
        setVisibleModal={setVisibleExtractFromUPUModal}
      />
    </>
  );
};
