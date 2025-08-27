import { useBoolean, useRequest, useUpdateEffect, useDebounceFn } from "ahooks";
import { Form, FormInstance, Select, SelectProps } from "antd";
import { useEffect, useState } from "react";

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

// 检查是否在浏览器环境
const isBrowser = typeof window !== "undefined";

const AssociationSelectors = ({
  dependencies,
  form,
  name,
  getOptions,
  waitTime = 1000,
  ...restProps
}: AssociationSelectorsParams) => {
  // 客户端渲染标识
  const [isClient, setIsClient] = useState(false);

  // 依赖值 - 只在客户端获取
  const dependenciesVal = Form.useWatch(dependencies, form);

  // 当前字段值 - 只在客户端获取
  const currentValue = Form.useWatch(dependencies, form);

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

  // 客户端 hydration 检测
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 清空函数
  const clearFn = () => {
    if (!isBrowser) return;

    // 清空所选值
    form.setFieldValue(name, undefined);
    // 清空options列表
    mutate([]);
  };

  // 防抖处理依赖值变化
  const { run: dependenciesChangeFn } = useDebounceFn(
    () => {
      // 只在客户端执行
      if (!isBrowser || !isClient) return;

      // 不存在依赖值，直接调用getOptions
      if (!dependencies) {
        return getOptionsList();
      }

      // 依赖值是否为数组
      const isArray = Array.isArray(dependenciesVal);

      // 存在上级依赖且上级依赖值为空
      if (
        !!dependencies &&
        (isArray ? !dependenciesVal?.length : !dependenciesVal)
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

  // 只在客户端监听依赖值变化
  useUpdateEffect(() => {
    if (isClient) {
      dependenciesChangeFn();
    }
  }, [dependenciesVal, isClient]);

  // 获取显示的选项数据
  const displayOptions = (() => {
    // 服务端渲染时使用回退数据
    if (!isBrowser || !isClient) {
      return [];
    }

    // 客户端渲染时使用实际数据
    return optionsList || [];
  })();

  // 获取加载状态
  const displayLoading = isBrowser && isClient ? loading : false;

  return (
    <Select
      fieldNames={{ label: "name", value: "code" }}
      options={displayOptions}
      loading={displayLoading}
      {...restProps}
    />
  );
};

AssociationSelectors.displayName = "DinglanUI.AssociationSelectors";

export default AssociationSelectors;
