import React, { FC } from "react";
import { Form } from "antd";
import DatePicker from "../DatePicker";

// import dayjs from "dayjs";

const Example: FC = () => {
  const [form] = Form.useForm();
  // form.setFieldsValue({
  //   date: "2015-01-01",
  // });

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
          <DatePicker
          // valueRange
          // pickerType="time"
          />
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
