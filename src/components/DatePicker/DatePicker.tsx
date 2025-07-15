import React from "react";
import {
  ConfigProvider,
  DatePicker,
  TimePicker,
  DatePickerProps,
  TimePickerProps,
} from "antd";
import { RangePickerProps } from "antd/es/date-picker";

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

  value?: string | (string | null)[] | null;
  onChange?: (value: string | (string | null)[] | null) => void;
} & (DatePickerRestProps | TimePickerRestProps | RangePickerRestProps);

const { RangePicker: DateRangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;

const SmartPicker: React.FC<TSmartPickerProps> = (props) => {
  const {
    pickerType = "date",
    valueRange,

    value,
    onChange,
    ...restProps
  } = props;

  const parseValue = (
    val: string | (string | null)[] | undefined | null,
  ): Dayjs | null | NoUndefinedRangeValueType<Dayjs> => {
    if (pickerType === "date" || pickerType === "time") {
      if (!val) return null;
      // val[1]是结束时间, day为1天末尾，time为当前值
      const temp = typeof val === "string" ? val : val[1] || val[0];
      return dayjs(temp);
    } else {
      if (!val) return [null, null];
      return Array.isArray(val)
        ? ((val as string[]).map((v) =>
            v ? dayjs(v) : null,
          ) as NoUndefinedRangeValueType<Dayjs>)
        : [null, null];
    }
  };

  const handleChange = (
    dates: Dayjs | NoUndefinedRangeValueType<Dayjs> | null,
  ) => {
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
              pickerType === "time"
                ? singleDate.toISOString()
                : singleDate.endOf("day").toISOString(),
            ]
          : singleDate.toISOString();
      }
      onChange(isoValue);
    }
    // 处理日期/时间范围
    else {
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
  };

  const parsedValue = parseValue(value);

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
  }

  return <ConfigProvider locale={zhCN}>{pickerComponent}</ConfigProvider>;
};

export default SmartPicker;
