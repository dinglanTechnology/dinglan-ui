import { useBoolean, useRequest, useUpdateEffect, useDebounceFn } from "ahooks";
import { Form, FormInstance, Select, SelectProps } from "antd";

// 基础选项类型
type OptionItem = {
  name: string;
  code: string | number | boolean;
};

/**
 * 关联选择器
 * @param dependencies 依赖值
 * @param form 表单实例
 * @param name 字段名
 * @param getOptions 获取选项的函数
 * @param waitTime 等待时间，默认1000ms
 */
interface AssociationSelectorsParams extends SelectProps {
  dependencies?: string | undefined;
  form: FormInstance;
  name: string;
  getOptions: (value?: string | number | boolean) => Promise<OptionItem[]>;
  waitTime?: number;
}

const AssociationSelectors = ({
  dependencies,
  form,
  name,
  getOptions,
  waitTime = 1000,
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
    loading,
  } = useRequest(getOptions, {
    manual: true,
  });

  // 清空
  const clearFn = () => {
    // 清空所选值
    form.setFieldValue(name, undefined);
    // 清空options列表
    mutate([]);
  };

  const { run: dependenciesChangeFn } = useDebounceFn(
    () => {
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
        return clearFn();
      }

      // 存在上级依赖且上级依赖值不为空
      if (!!dependencies && dependenciesVal) {
        // 如果当前字段有初始值，且是首次加载，则不清空
        if (currentValue && isFirstLoad) {
          setFalse();
        } else {
          clearFn();
        }
        getOptionsList(isArray ? dependenciesVal.join(",") : dependenciesVal);
      }
    },
    { wait: waitTime },
  );

  useUpdateEffect(() => {
    dependenciesChangeFn();
  }, [dependenciesVal]);

  return (
    <Select
      fieldNames={{ label: "name", value: "code" }}
      options={optionsList}
      loading={loading}
      {...restProps}
    />
  );
};

AssociationSelectors.displayName = "DinglanUI.AssociationSelectors";

export default AssociationSelectors;
