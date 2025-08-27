import { useBoolean, useRequest, useUpdateEffect } from "ahooks";
import { Form, FormInstance, Select, SelectProps } from "antd";

// 基础选项类型
type OptionItem = {
  name: string;
  code: string | number | boolean;
};

// 有依赖的组件参数
interface AssociationSelectorsParams extends SelectProps {
  dependencies?: string | number | boolean | undefined | null;
  form: FormInstance;
  name: string;
  getOptions: (value?: string | number | boolean) => Promise<OptionItem[]>;
}

const AssociationSelectors = ({
  dependencies,
  form,
  name,
  getOptions,
  ...restProps
}: AssociationSelectorsParams) => {
  // 依赖值
  const dependenciesVal = Form.useWatch(dependencies, form);
  // 当前字段值
  const currentValue = Form.useWatch(name, form);
  // 是否是首次加载
  const [isFirstLoad, { setFalse }] = useBoolean(true);

  // options列表请求
  const {
    run: getOptionsList,
    data: optionsList,
    mutate,
  } = useRequest(getOptions, {
    manual: true,
  });

  useUpdateEffect(() => {
    // 不存在依赖值，直接调用getOptions
    if (!dependencies) {
      return getOptionsList();
    }

    // 依赖值是否为数组
    const isArray = Array.isArray(dependenciesVal);

    // 存在上级依赖且上级依赖值为空
    if (
      !!dependencies &&
      (isArray ? !dependenciesVal.length : !dependenciesVal)
    ) {
      // 清空所选值
      form.setFieldValue(name, undefined);
      // 清空options列表
      mutate([]);
      return;
    }

    // 存在上级依赖且上级依赖值不为空
    if (!!dependencies && dependenciesVal) {
      // 如果当前字段有初始值，且是首次加载，则不清空
      if (currentValue && isFirstLoad) {
        setFalse();
      } else {
        form.setFieldValue(name, undefined);
      }
      getOptionsList(isArray ? dependenciesVal.join(",") : dependenciesVal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependenciesVal]);

  return (
    <Select
      fieldNames={{ label: "name", value: "code" }}
      options={optionsList}
      {...restProps}
    />
  );
};

AssociationSelectors.displayName = "DinglanUI.AssociationSelectors";

export default AssociationSelectors;
