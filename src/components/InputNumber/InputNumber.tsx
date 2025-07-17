import { InputNumber, InputNumberProps } from "antd";

type TDlInputNumberProps = InputNumberProps & {
  useType?: "money";
};

export default function DlInputNumber(props: TDlInputNumberProps) {
  const { useType, value, onChange, formatter, parser, ...restProps } = props;

  const moneyFormatter = (value: number | string | undefined) => {
    if (!value) return "";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return `${numValue.toLocaleString("zh-CN")}`;
  };

  const moneyParser = (displayValue: string | undefined) => {
    if (!displayValue) return "";
    return displayValue.replace(/,/g, "");
  };

  return (
    <InputNumber
      {...restProps}
      formatter={useType ? moneyFormatter : formatter}
      parser={useType === "money" ? moneyParser : parser}
      controls={false}
      value={value}
      onChange={onChange}
    />
  );
}
