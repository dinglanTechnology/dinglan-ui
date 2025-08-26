import React, { useState } from "react";
import { Button, Form } from "antd";
// import { Rule } from "antd/es/form";
import AssociationSelectors from "../associationSelectors";

const Example = () => {
  const [form] = Form.useForm();

  // 项目发生改变
  const onChangeProjectId = (value: string | number | boolean) => {
    console.log("projectId", value);
    form.setFieldsValue({
      projectPhaseId: undefined,
      projectBatchId: undefined,
    });
    // 获取期数选项
    getProjectPhaseOptions(value).then((res) => {
      setProjectPhaseOptions(res);
    });
  };

  // 期数发生改变
  const onChangeProjectPhaseId = (value: string | number | boolean) => {
    console.log("projectPhaseId", value);
    form.setFieldValue("projectBatchId", "");
    // 获取批次选项
    getProjectBatchOptions(value).then((res) => {
      setProjectBatchOptions(res);
    });
  };

  // 期数选项列表
  const [projectPhaseOptions, setProjectPhaseOptions] = useState<
    { name: string; code: string }[]
  >([]);

  // 期数选项,模拟接口获取
  const getProjectPhaseOptions = (
    value: string | number | boolean | undefined,
  ) => {
    if (!value) return Promise.resolve([]);
    return new Promise<{ name: string; code: string }[]>((resolve) => {
      setTimeout(() => {
        resolve([
          { name: `${value}1期`, code: `${value}1期` },
          { name: `${value}2期`, code: `${value}2期` },
          { name: `${value}3期`, code: `${value}3期` },
          { name: `${value}4期`, code: `${value}4期` },
        ]);
      }, 1000);
    });
  };

  // 批次选项列表
  const [projectBatchOptions, setProjectBatchOptions] = useState<
    { name: string; code: string }[]
  >([]);

  // 批次选项,模拟接口获取
  const getProjectBatchOptions = (
    value: string | number | boolean | undefined,
  ) => {
    if (!value) return Promise.resolve([]);
    return new Promise<{ name: string; code: string }[]>((resolve) => {
      setTimeout(() => {
        resolve([
          { name: `${value}1批次`, code: "1" },
          { name: `${value}2批次`, code: "2" },
          { name: `${value}3批次`, code: "3" },
          { name: `${value}4批次`, code: "4" },
        ]);
      }, 1000);
    });
  };

  // 批次发生改变
  const onChangeProjectBatchId = (value: string | number | boolean) => {
    console.log("projectBatchId", value);
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
            options={[
              { name: "鹿溪源", code: "鹿溪源" },
              { name: "龙栖海岸", code: "龙栖海岸" },
            ]}
            onChange={onChangeProjectId}
            allowClear={true}
          />
        </Form.Item>
        <Form.Item
          key={"projectPhaseId"}
          label={"期数"}
          name={"projectPhaseId"}
          style={{ flex: 1 }}
        >
          <AssociationSelectors
            options={projectPhaseOptions}
            onChange={onChangeProjectPhaseId}
            allowClear={true}
            suffixIcon={<div>期</div>}
          />
        </Form.Item>
        <Form.Item
          key={"projectBatchId"}
          label={"批次"}
          name={"projectBatchId"}
          style={{ flex: 1 }}
        >
          <AssociationSelectors
            options={projectBatchOptions}
            onChange={onChangeProjectBatchId}
            allowClear={true}
            suffixIcon={<div>批次</div>}
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
