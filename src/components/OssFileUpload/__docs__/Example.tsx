import React from "react";
import { Button, Form } from "antd";
import OssFileUpload from "../OssFileUpload";

const Example = () => {
  const [form] = Form.useForm();

  const generateOss = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return Promise.resolve({
      params: {
        expire: "1758590879",
        policy:
          "eyJleHBpcmF0aW9uIjoiMjAyNS0wOS0yM1QwMToyNzo1OS42NDZaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==",
        signature: "gVaQjSfLWlb0oWs6rQ3npMzGbyU=",
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
            maxCount={5}
            fileTypes={["application/xlsx"]}
            maxFileSize={10}
          />
        </Form.Item>

        <Form.Item label="任意格式文件上传（20MB限制）" name="anyFileUpload">
          <OssFileUpload
            filePath="assets/files/"
            generateOss={generateOss}
            listType="text"
            maxCount={3}
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
