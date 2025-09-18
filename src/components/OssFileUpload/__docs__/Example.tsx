import React from "react";
import { Button, Form } from "antd";
import OssFileUpload from "../OssFileUpload";

const Example = () => {
  const [form] = Form.useForm();

  const generateOss = async () => {
    await setTimeout(() => {}, 2000);

    return Promise.resolve({
      params: {
        expire: "1758249899",
        policy:
          "eyJleHBpcmF0aW9uIjoiMjAyNS0wOS0xOVQwMjo0NDo1OS4zMjNaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==",
        signature: "fYz8x/StmnIgGtU9pKfCAU95Cbk=",
        accessid: "LTAI5tMCpHgpcdTpEMUXaoZQ",
        host: "https://assets-resource-1.oss-cn-chengdu.aliyuncs.com",
        bucket: "assets-resource-1",
      },
    });
  };

  // 点击确定
  const onOk = async () => {
    const res = await form.getFieldsValue(true);
    console.log("res", res);
  };

  return (
    <>
      <Form form={form} layout="vertical">
        <Form.Item label="图片上传" name="imageUpload">
          <OssFileUpload
            filePath="assets/images/"
            generateOss={generateOss}
            listType="picture-card"
            form={form}
            nameField="imageUpload"
            maxCount={3}
            fileTypes={["image/*"]}
            maxFileSize={5}
          />
        </Form.Item>

        <Form.Item
          label="文档上传（PDF, Word, Excel，10MB限制）"
          name="documentUpload"
        >
          <OssFileUpload
            filePath="assets/documents/"
            generateOss={generateOss}
            listType="text"
            form={form}
            nameField="documentUpload"
            maxCount={5}
            fileTypes={["application/pdf"]}
            maxFileSize={10}
          />
        </Form.Item>

        <Form.Item label="任意格式文件上传（20MB限制）" name="anyFileUpload">
          <OssFileUpload
            filePath="assets/files/"
            generateOss={generateOss}
            listType="text"
            form={form}
            nameField="anyFileUpload"
            maxCount={1}
            fileTypes={["*"]}
            maxFileSize={20}
          />
        </Form.Item>
      </Form>
      <Button
        className="!bg-[#5492F1] mx-10 w-100"
        key="submit"
        type="primary"
        onClick={onOk}
      >
        确定
      </Button>
    </>
  );
};

export default Example;
