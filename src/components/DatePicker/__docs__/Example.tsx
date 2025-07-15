import React, { FC } from "react";
import { Form } from "antd";
import DatePicker from "../DatePicker";

const Example: FC = (props) => {
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
        <Form.Item label="日期选择" name="date">
          <DatePicker {...props} />
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
