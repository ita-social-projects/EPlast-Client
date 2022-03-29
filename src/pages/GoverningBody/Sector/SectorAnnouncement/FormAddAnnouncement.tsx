import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Upload, Select } from "antd";
import formclasses from "./Form.module.css";
import {
  emptyInput,
  maxLength,
} from "../../../../components/Notifications/Messages";
import ReactQuill from "react-quill";
import { UploadFile } from "antd/lib/upload/interface";
import { GoverningBody } from "../../../../api/decisionsApi";
import SectorProfile from "../../../../models/GoverningBody/Sector/SectorProfile";
import { getGoverningBodiesList } from "../../../../api/governingBodiesApi";
import { getSectorsListByGoverningBodyId } from "../../../../api/governingBodySectorsApi";

type FormAddAnnouncementProps = {
  governingBodyId: number;
  sectorId: number;
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: (
    title: string,
    text: string,
    images: string[],
    gvbId: number,
    sectorId: number
  ) => void;
};

const FormAddAnnouncement: React.FC<FormAddAnnouncementProps> = (
  props: any
) => {
  const { setVisibleModal, onAdd, sectorId, governingBodyId } = props;
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [gvbLoading, setGvbLoading] = useState<boolean>(false);
  const [governingBodies, setGoverningBodies] = useState<GoverningBody[]>([]);
  const [sectorsLoading, setSectorsLoading] = useState<boolean>(false);
  const [sectors, setSectors] = useState<SectorProfile[]>([]);
  const [selectSectorId, setSelectSectorId] = useState<any>();
  const [selectGoverningBodyId, setSelectGoverningBodyId] = useState<number>();

  const handleCancel = () => {
    form.resetFields();
    setVisibleModal(false);
  };

  const handleSubmit = (values: any) => {
    setSubmitLoading(true);
    setVisibleModal(false);
    form.resetFields();
    onAdd(
      values.title,
      values.text,
      photos,
      selectGoverningBodyId,
      selectSectorId
    );
    setSubmitLoading(false);
  };

  const getBase64 = (img: Blob, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleUpload = (images: any) => {
    setFileList(images.fileList);
    if (images.fileList.length === 0) return;
    getBase64(images.file, (base64: string) => {
      setPhotos([...photos, base64]);
    });
  };

  const fetchData = async () => {
    setGvbLoading(true);
    try {
      const governingBodiesList = await getGoverningBodiesList();
      setGoverningBodies(governingBodiesList);
      form.setFieldsValue({
        selectGoverningBody: governingBodiesList.find(
          (x: GoverningBody) => x.id == governingBodyId
        )?.governingBodyName,
      });
      setSelectGoverningBodyId(governingBodyId);
      const sectorsList = await getSectorsListByGoverningBodyId(
        governingBodyId
      );
      setSectors(sectorsList);
      form.setFieldsValue({
        selectSector: sectorsList.find((x: any) => x.id == sectorId)?.name,
      });
      setSelectSectorId(sectorId);
    } finally {
      setGvbLoading(false);
    }
  };

  const governingBodyChange = async (id: number) => {
    const response = await getSectorsListByGoverningBodyId(id);
    setSectors(response);
  };

  const onGvbSelect = async (value: any) => {
    setSectorsLoading(true);
    try {
      form.setFieldsValue({ selectSector: undefined });
      const id: number = JSON.parse(value.toString()).id;
      setSelectGoverningBodyId(id);
      governingBodyChange(id);
    } finally {
      setSectorsLoading(false);
    }
  };

  const onSectorSelect = async (value: any) => {
    try {
      const id: number = JSON.parse(value.toString()).id;
      setSelectSectorId(id);
    } catch {
      setSelectSectorId(null);
    }
  };

  useEffect(() => {
    fetchData();
    if (props.visibleModal) {
      form.resetFields();
    }
  }, [props]);

  return (
    <Form
      name="basic"
      onFinish={handleSubmit}
      form={form}
      id="area"
      style={{ position: "relative" }}
    >
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            label="Орган"
            labelCol={{ span: 24 }}
            name="selectGoverningBody"
            rules={[
              {
                required: true,
                message: emptyInput(),
              },
            ]}
          >
            <Select
              showSearch
              loading={gvbLoading}
              onChange={(value) => onGvbSelect(value)}
            >
              {governingBodies?.map((o) => (
                <Select.Option key={o.id} value={JSON.stringify(o)}>
                  {o.governingBodyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            label="Напрям"
            labelCol={{ span: 24 }}
            name="selectSector"
            rules={[
              {
                message: emptyInput(),
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              loading={sectorsLoading}
              onChange={(value) => onSectorSelect(value)}
            >
              {sectors?.map((o) => (
                <Select.Option key={o.id} value={JSON.stringify(o)}>
                  {o.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            initialValue={""}
            label="Тема оголошення"
            labelCol={{ span: 24 }}
            name="title"
            rules={[
              { required: true, message: emptyInput() },
              {
                max: 1000,
                message: maxLength(1000),
              },
            ]}
          >
            <ReactQuill theme="snow" placeholder="Введіть текст..." />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            initialValue={""}
            label="Текст оголошення"
            labelCol={{ span: 24 }}
            name="text"
            rules={[
              { required: true, message: emptyInput() },
              {
                max: 1000,
                message: maxLength(1000),
              },
            ]}
          >
            <ReactQuill theme="snow" placeholder="Введіть текст..." />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Upload
          listType="picture-card"
          accept=".jpeg,.jpg,.png"
          fileList={fileList}
          onChange={handleUpload}
          beforeUpload={() => false}
        >
          {"Upload"}
        </Upload>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item>
            <div className={formclasses.cardButton}>
              <Button
                key="back"
                onClick={handleCancel}
                className={formclasses.buttons}
              >
                Відмінити
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className={formclasses.buttons}
              >
                Опублікувати
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FormAddAnnouncement;
