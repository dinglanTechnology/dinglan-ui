import React, { useCallback, useMemo } from "react";
import {
  ConfigProvider,
  DatePicker,
  TimePicker,
  DatePickerProps,
  TimePickerProps,
} from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import type { Locale } from "antd/es/locale";

import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/zh-cn";
import zhCN from "antd/locale/zh_CN";

dayjs.locale("zh-cn");

type NoUndefinedRangeValueType<DateType> = [
  start: DateType | null,
  end: DateType | null,
];
type DatePickerRestProps = Omit<DatePickerProps, "value" | "onChange">;
type TimePickerRestProps = Omit<TimePickerProps, "value" | "onChange">;
type RangePickerRestProps = Omit<RangePickerProps, "value" | "onChange">;

type TSmartPickerProps = {
  pickerType?: "date" | "dateRange" | "time" | "timeRange";
  valueRange?: boolean;
  locale?: Locale;

  value?: string | (string | null)[] | null;
  onChange?: (value: string | (string | null)[] | null) => void;
} & (DatePickerRestProps | TimePickerRestProps | RangePickerRestProps);

const { RangePicker: DateRangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;

const SmartPicker: React.FC<TSmartPickerProps> = (props) => {
  const {
    pickerType = "date",
    valueRange,
    locale = zhCN,

    value,
    onChange,
    ...restProps
  } = props;

  const parsedValue = useMemo(() => {
    // 辅助函数：验证并解析日期字符串
    const parseDateString = (dateStr: string | null): Dayjs | null => {
      if (!dateStr || typeof dateStr !== "string") return null;
      const parsed = dayjs(dateStr);
      return parsed.isValid() ? parsed : null;
    };

    if (pickerType === "date" || pickerType === "time") {
      if (!value) return null;
      if (Array.isArray(value)) {
        // 对于单个日期/时间选择器，取最后一个有效值（因为可能到当天任何一个时刻，默认末尾）
        const lastValidValue = value
          .filter((v) => v && typeof v === "string")
          .pop();
        return parseDateString(lastValidValue || null);
      }
      return parseDateString(value);
    } else {
      // 修复：允许value为null或undefined，与单个选择器保持一致
      if (!value) return [null, null] as NoUndefinedRangeValueType<Dayjs>;
      if (!Array.isArray(value)) {
        throw new Error("value值必须为数组");
      }
      return (value as (string | null)[]).map((v) =>
        parseDateString(v),
      ) as NoUndefinedRangeValueType<Dayjs>;
    }
  }, [pickerType, value]);

  const handleChange = useCallback(
    (dates: Dayjs | NoUndefinedRangeValueType<Dayjs> | null) => {
      if (!onChange) return;

      // 处理单个日期/时间
      if (pickerType === "date" || pickerType === "time") {
        const singleDate = dates as Dayjs | null;
        let isoValue = null;
        if (!singleDate) {
          isoValue = null;
        } else {
          isoValue = valueRange
            ? [
                singleDate.startOf("day").toISOString(),
                (restProps as DatePickerRestProps).showTime ||
                pickerType === "time"
                  ? singleDate.toISOString()
                  : singleDate.endOf("day").toISOString(),
              ]
            : singleDate.toISOString();
        }
        onChange(isoValue);
      } else {
        // 处理日期/时间范围
        const dateRange = dates as NoUndefinedRangeValueType<Dayjs> | null;
        let isoValue: (string | null)[] | null = null;
        if (!dateRange) {
          isoValue = null;
        } else {
          isoValue =
            (restProps as RangePickerRestProps).showTime ||
            pickerType === "timeRange"
              ? [
                  dateRange[0]?.toISOString() || null,
                  dateRange[1]?.toISOString() || null,
                ]
              : [
                  dateRange[0]?.startOf("day").toISOString() || null,
                  dateRange[1]?.endOf("day").toISOString() || null,
                ];
        }
        onChange(isoValue);
      }
    },
    [onChange, pickerType, valueRange, restProps],
  );

  let pickerComponent = null;
  switch (pickerType) {
    case "date":
      pickerComponent = (
        <DatePicker
          {...(restProps as DatePickerRestProps)}
          value={parsedValue as Dayjs | null}
          onChange={handleChange}
        />
      );
      break;
    case "dateRange":
      pickerComponent = (
        <DateRangePicker
          {...(restProps as RangePickerRestProps)}
          value={parsedValue as NoUndefinedRangeValueType<Dayjs>}
          onChange={handleChange}
        />
      );
      break;
    case "time":
      pickerComponent = (
        <TimePicker
          {...(restProps as TimePickerRestProps)}
          value={parsedValue as Dayjs | null}
          onChange={handleChange}
        />
      );
      break;
    case "timeRange":
      pickerComponent = (
        <TimeRangePicker
          {...(restProps as RangePickerRestProps)}
          value={parsedValue as NoUndefinedRangeValueType<Dayjs>}
          onChange={handleChange}
        />
      );
      break;
    default:
      pickerComponent = null;
      throw new Error("pickerType值类型错误");
  }

  return <ConfigProvider locale={locale}>{pickerComponent}</ConfigProvider>;
};

export default SmartPicker;
