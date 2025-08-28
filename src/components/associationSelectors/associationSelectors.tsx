import { useBoolean, useRequest, useUpdateEffect, useDebounceFn } from "ahooks";
import { Form, FormInstance, Select, SelectProps } from "antd";

// 基础选项类型
type OptionItem = {
  name: string;
  code: string | number | boolean;
};

/**
 * 关联选择器
 * @param form 表单实例
 * @param name 字段名
 * @param getOptions 获取选项的函数
 * @param waitTime 等待时间，默认0ms
 * @param parentField 父级字段
 * @param parentParams 父级参数
 */
interface AssociationSelectorsParams extends SelectProps {
  parentField?: string;
  parentParams?: string[];
  form: FormInstance;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOptions: (value?: any) => Promise<OptionItem[]>;
  waitTime?: number;
}

const AssociationSelectors = ({
  parentField,
  parentParams,
  form,
  name,
  getOptions,
  waitTime = 0,
  ...restProps
}: AssociationSelectorsParams) => {
  // 依赖值
  const dependenciesVal = Form.useWatch(parentField, form);
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
      if (!parentField) {
        return getOptionsList();
      }

      // 依赖值是否为数组
      const isArray = Array.isArray(dependenciesVal);

      // 存在上级依赖且上级依赖值为空
      if (
        !!parentField &&
        (isArray ? !dependenciesVal.length : !dependenciesVal)
      ) {
        return clearFn();
      }

      // 存在上级依赖且上级依赖值不为空
      if (!!parentField && dependenciesVal) {
        // 如果是首次加载，则不清空
        if (isFirstLoad) {
          setFalse();
        } else {
          clearFn();
        }
        // 如果存在父级参数，则将从form中获取父级参数,并且为对象格式，key为父级参数，value为父级依赖值
        if (parentParams && parentParams.length) {
          const formParams = form.getFieldsValue(true);
          const params = parentParams.reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (acc: Record<string, any>, item) => {
              acc[item] = formParams[item];
              return acc;
            },
            {},
          );
          getOptionsList(params);
        } else {
          getOptionsList(dependenciesVal);
        }
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
      style={{ width: "100%", ...restProps.style }}
      {...restProps}
    />
  );
};

AssociationSelectors.displayName = "DinglanUI.AssociationSelectors";

export default AssociationSelectors;
