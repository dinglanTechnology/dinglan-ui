import React from "react";
import {
  DatePicker,
  TimePicker,
  DatePickerProps,
  TimePickerProps,
  ConfigProvider,
} from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/zh-cn";
import zhCN from "antd/locale/zh_CN";

dayjs.locale("zh-cn");

const { RangePicker: DateRangePicker } = DatePicker;
// const { RangePicker: TimeRangePicker } = TimePicker;

type TDateProps = {
  pickerType?: "date" | "dateRange" | "time" | "timeRange";
  valueRange?: boolean;

  value?: string | string[];
  onChange?: (value: string | string[] | null) => void;
} & (
  | Omit<DatePickerProps, "value" | "onChange">
  | Omit<TimePickerProps, "value" | "onChange">
);
// | Omit<RangePickerProps, "value" | "onChange">

const SmartPicker: React.FC<TDateProps> = (props) => {
  const {
    pickerType = "date",
    valueRange,

    value,
    onChange,
    ...restProps
  } = props;

  const parseValue = (val: string | string[] | undefined | null) => {
    if (pickerType === "date" || pickerType === "time") {
      if (!val) return null;
      const temp = typeof val === "string" ? val : val[1] || val[0]; // val[1]是结束时间, day为1天末尾，time为当前值
      return dayjs(temp);
    } else {
      if (!val) return [];
      return Array.isArray(val)
        ? (val as string[]).map((v) => (v ? dayjs(v) : null))
        : [];
    }
  };

  const handleChangeSingle = (dates: Dayjs) => {
    if (!onChange) return;
    let isoValue = null;
    if (!dates) {
      isoValue = null;
    } else {
      isoValue = valueRange
        ? [
            dates.startOf("day").toISOString(),
            pickerType === "time"
              ? dates.toISOString()
              : dates.endOf("day").toISOString(),
          ]
        : dates.toISOString();
    }
    onChange(isoValue);
    console.log(isoValue, "--------isoValue--------------");
  };

  // const handleChangeRange = () =>
  //   // dates: NoUndefinedRangeValueType<Dayjs> | null,
  //   // dateStrings: string[],
  //   {
  //     if (!onChange) return;
  //     const isoValue = null;
  //     // if (pickerType === "date") {
  //     //   if (!dates) return null;
  //     //   isoValue = valueRange
  //     //     ? [dates.startOf("day").toISOString(), dates.endOf("day").toISOString()]
  //     //     : dates.toISOString();
  //     // } else if (pickerType === "time") {
  //     //   if (!dates) return null;
  //     //   isoValue = valueRange
  //     //     ? [dates.startOf("day").toISOString(), dates.toISOString()]
  //     //     : dates.toISOString();
  //     // }
  //     onChange(isoValue);
  //     console.log(isoValue, "--------isoValue--------------");
  //   };

  let pickerComponent = null;
  switch (pickerType) {
    case "date":
      pickerComponent = (
        <DatePicker
          {...restProps}
          value={parseValue(value) as Dayjs}
          onChange={handleChangeSingle}
        />
      );
      break;
    // case "dateRange":
    //   pickerComponent = (
    //     <DateRangePicker
    //       {...restProps}
    //       value={parseValue(value) as [Dayjs, Dayjs]}
    //       onChange={handleChangeRange}
    //     />
    //   );
    //   break;
    case "time":
      pickerComponent = (
        <TimePicker
          {...restProps}
          value={parseValue(value) as Dayjs}
          onChange={handleChangeSingle}
        />
      );
      break;
    // case "timeRange":
    //   pickerComponent = (
    //     <TimeRangePicker
    //       {...restProps}
    //       value={parseValue(value as [string, string]) as [Dayjs, Dayjs]}
    //       onChange={handleChange}
    //     />
    //   );
    //   break;
    default:
      pickerComponent = null;
  }

  return <ConfigProvider locale={zhCN}>{pickerComponent}</ConfigProvider>;
};

export default SmartPicker;
