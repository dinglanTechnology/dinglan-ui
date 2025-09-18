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
      <Form form={form}>
        <Form.Item label="OssFileUpload" name="ossFileUpload">
          <OssFileUpload
            filePath="assets/ossFileUpload/"
            generateOss={generateOss}
            listType="picture-card"
            form={form}
            nameField="ossFileUpload"
            maxCount={3}
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
