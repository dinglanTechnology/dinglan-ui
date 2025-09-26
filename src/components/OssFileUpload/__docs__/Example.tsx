import React from "react";
import { Button, Form } from "antd";
import OssFileUpload from "../OssFileUpload";

const Example = () => {
  const [form] = Form.useForm();

  const generateOss = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return Promise.resolve({
      params: {
        expire: "1758936168",
        policy:
          "eyJleHBpcmF0aW9uIjoiMjAyNS0wOS0yN1QwMToyMjo0OC4xMDdaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==",
        signature: "qXm7+JfTfRvV1yJmi0u1Lpj1/0Q=",
        accessid: "LTAI5tMCpHgpcdTpEMUXaoZQ",
        host: "https://assets-resource-1.oss-cn-chengdu.aliyuncs.com",
        bucket: "assets-resource-1",
      },
    });
  };

  // 点击确定
  const onOk = async () => {
    const res = await form.getFieldsValue(true);
    console.log("表单参数", res);
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          imageUpload: [
            "https://assets-resource-1.oss-cn-chengdu.aliyuncs.com/assets/images/custom-image-1.jpg",
          ],
        }}
      >
        <Form.Item label="图片上传" name="imageUpload">
          <OssFileUpload
            filePath="assets/images/"
            generateOss={generateOss}
            listType="picture-card"
            maxCount={3}
            fileTypes={["image/*"]}
            fileName={["custom-image-1", "custom-image-2", "custom-image-3"]}
            maxFileSize={5}
            retryCount={2}
            onProgress={(percent, file) => {
              console.log(`${file.name} 上传进度: ${percent}%`);
            }}
            onSuccess={(url, file) => {
              console.log(`${file.name} 上传成功:`, url);
            }}
            onError={(error, file) => {
              console.error(`${file.name} 上传失败:`, error.message);
            }}
            appendTimestamp
          />
        </Form.Item>

        <Form.Item
          label="excel文档上传（圆形进度条样式）"
          name="documentUpload"
        >
          <OssFileUpload
            filePath="assets/documents/"
            generateOss={generateOss}
            listType="text"
            fileTypes={[
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ]}
            fileName={["report-1", "report-2"]}
            maxFileSize={10}
            retryCount={3}
            progress={{
              strokeColor: "#1890ff",
              size: 8,
              showInfo: true,
              format: (percent) => `${percent}%`,
            }}
            onProgress={(percent, file) => {
              console.log(`文档 ${file.name} 上传进度: ${percent}%`);
            }}
            onSuccess={(url, file) => {
              console.log(`文档 ${file.name} 上传成功:`, url);
            }}
            onError={(error, file) => {
              console.error(`文档 ${file.name} 上传失败:`, error.message);
            }}
          >
            <Button>上传</Button>
          </OssFileUpload>
        </Form.Item>

        <Form.Item
          label="任意格式文件上传（20MB限制，不重试）"
          name="anyFileUpload"
        >
          <OssFileUpload
            filePath="assets/files/"
            generateOss={generateOss}
            listType="text"
            maxCount={3}
            fileTypes={["*"]}
            maxFileSize={20}
            retryCount={0}
            onProgress={(percent, file) => {
              console.log(`文件 ${file.name} 上传进度: ${percent}%`);
            }}
            onSuccess={(url, file) => {
              console.log(`文件 ${file.name} 上传成功:`, url);
            }}
            onError={(error, file) => {
              console.error(`文件 ${file.name} 上传失败:`, error.message);
            }}
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
