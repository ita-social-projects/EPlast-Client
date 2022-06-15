/* eslint-disable eqeqeq */
/* eslint-disable prefer-destructuring */
import React, { useState, useEffect } from "react";
import { Form, Button, Upload, Select, Checkbox } from "antd";
import ReactQuill from "react-quill";
import { UploadFile } from "antd/lib/upload/interface";
import formclasses from "./Form.module.css";
import { emptyInput } from "../../../../components/Notifications/Messages";
import { GoverningBody } from "../../../../api/decisionsApi";
import SectorProfile from "../../../../models/GoverningBody/Sector/SectorProfile";
import { getGoverningBodiesList } from "../../../../api/governingBodiesApi";
import { getSectorsListByGoverningBodyId } from "../../../../api/governingBodySectorsApi";
import ButtonCollapse from "../../../../components/ButtonCollapse/ButtonCollapse";
import { descriptionValidation } from "../../../../models/GllobalValidations/DescriptionValidation";

type FormAddAnnouncementProps = {
  governingBodyId: number;
  sectorId: number;
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: (
    title: string,
    text: string,
    images: string[],
    isPined: boolean,
    gvbId: number,
    sectorId: number
  ) => void;
};

const FormAddAnnouncement: React.FC<FormAddAnnouncementProps> = (
  props: any
) => {
  const { setVisibleModal, onAdd, sectorId, governingBodyId } = props;
  const [form] = Form.useForm();
  const [photos, setPhotos] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [gvbLoading, setGvbLoading] = useState<boolean>(false);
  const [governingBodies, setGoverningBodies] = useState<GoverningBody[]>([]);
  const [sectorsLoading, setSectorsLoading] = useState<boolean>(false);
  const [sectors, setSectors] = useState<SectorProfile[]>([]);
  const [selectSectorId, setSelectSectorId] = useState<any>();
  const [selectGoverningBodyId, setSelectGoverningBodyId] = useState<number>();
  const [isPined, setIsPined] = useState<boolean>(false);

  const handleCancel = () => {
    form.resetFields();
    setIsPined(false);
    setFileList([]);
    setVisibleModal(false);
  };

  const handleClose = () => {
    setVisibleModal(false);
  };

  const handleSubmit = (values: any) => {
    setVisibleModal(false);
    onAdd(
      values.title,
      values.text,
      photos,
      isPined,
      selectGoverningBodyId,
      selectSectorId
    );
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
      const { id } = JSON.parse(value.toString());
      setSelectGoverningBodyId(id);
      governingBodyChange(id);
    } finally {
      setSectorsLoading(false);
    }
  };

  const onSectorSelect = async (value: any) => {
    try {
      const { id } = JSON.parse(value.toString());
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
    <>
      <ButtonCollapse handleClose={handleClose} />
      <Form
        name="basic"
        onFinish={handleSubmit}
        form={form}
        id="area"
        style={{ position: "relative" }}
      >
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
        <Form.Item
          className={formclasses.formField}
          initialValue=""
          label="Тема оголошення"
          labelCol={{ span: 24 }}
          name="title"
          rules={descriptionValidation.Announcements}
        >
          <ReactQuill theme="snow" placeholder="Введіть текст..." />
        </Form.Item>
        <Form.Item
          className={formclasses.formField}
          initialValue=""
          label="Текст оголошення"
          labelCol={{ span: 24 }}
          name="text"
          rules={descriptionValidation.Announcements}
        >
          <ReactQuill theme="snow" placeholder="Введіть текст..." />
        </Form.Item>
        <Upload
          listType="picture-card"
          accept=".jpeg,.jpg,.png"
          fileList={fileList}
          onChange={handleUpload}
          beforeUpload={() => false}
        >
          Upload
        </Upload>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox onChange={(e) => setIsPined(e.target.checked)}>
            Закріпити оголошення
          </Checkbox>
        </Form.Item>
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
      </Form>
    </>
  );
};

export default FormAddAnnouncement;
