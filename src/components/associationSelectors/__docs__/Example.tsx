import React from "react";
import { Button, Form } from "antd";
import AssociationSelectors from "../AssociationSelectors";

// 基础选项类型
type OptionItem = {
  name: string;
  code: string | number | boolean;
};

const Example = () => {
  const [form] = Form.useForm();

  // 模拟项目接口请求
  const getProjectOptions = async (): Promise<OptionItem[]> => {
    return [
      { name: "鹿溪源", code: "鹿溪源" },
      { name: "龙栖海岸", code: "龙栖海岸" },
      { name: "龙栖海岸2期", code: "龙栖海岸2期" },
    ];
  };
  // 模拟期数接口请求
  const getProjectPhaseOptions = async (
    value?: string | number | boolean,
  ): Promise<OptionItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { name: `${value}1期`, code: `${value}1期` },
          { name: `${value}2期`, code: `${value}2期` },
          { name: `${value}3期`, code: `${value}3期` },
        ]);
      }, 3000);
    });
  };
  // 模拟批次接口请求
  const getProjectBatchOptions = async (
    value?: string | number | boolean,
  ): Promise<OptionItem[]> => {
    return [
      { name: `${value}1批次`, code: `${value}1批次` },
      { name: `${value}2批次`, code: `${value}2批次` },
      { name: `${value}3批次`, code: `${value}3批次` },
    ];
  };

  // 点击确定
  const onOk = async () => {
    const res = await form.validateFields();
    console.log("res", res);
  };

  return (
    <>
      <Form
        form={form}
        layout="horizontal"
        size="middle"
        labelAlign="right"
        initialValues={{
          projectId: "鹿溪源",
          projectPhaseId: "鹿溪源1期",
          projectBatchId: "鹿溪源1期1批次",
        }}
        clearOnDestroy={true}
        preserve={false}
        style={{ display: "flex", gap: "40px", width: "100%" }}
      >
        <Form.Item
          key={"projectId"}
          label={"项目"}
          name={"projectId"}
          style={{ flex: 1 }}
        >
          <AssociationSelectors
            form={form}
            name={"projectId"}
            allowClear={true}
            getOptions={getProjectOptions}
          />
        </Form.Item>
        <Form.Item
          key={"projectPhaseId"}
          label={"期数"}
          name={"projectPhaseId"}
          style={{ flex: 1 }}
        >
          <AssociationSelectors
            dependencies={"projectId"}
            form={form}
            name={"projectPhaseId"}
            allowClear={true}
            suffixIcon={<div>期</div>}
            getOptions={getProjectPhaseOptions}
          />
        </Form.Item>
        <Form.Item
          key={"projectBatchId"}
          label={"批次"}
          name={"projectBatchId"}
          style={{ flex: 1 }}
        >
          <AssociationSelectors
            dependencies={"projectPhaseId"}
            form={form}
            name={"projectBatchId"}
            allowClear={true}
            suffixIcon={<div>批次</div>}
            waitTime={0}
            getOptions={getProjectBatchOptions}
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
