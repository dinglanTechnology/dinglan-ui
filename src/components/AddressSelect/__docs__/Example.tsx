import React, { FC } from "react";
import { Form } from "antd";
import AddressSelect from "../AddressSelect";

const Example: FC = () => {
  const [form] = Form.useForm();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Form form={form}>
        <Form.Item label="省市区" name="address">
          <AddressSelect />
        </Form.Item>
        <Form.Item>
          <button onClick={() => console.log(form.getFieldsValue())}>
            提交
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Example;
