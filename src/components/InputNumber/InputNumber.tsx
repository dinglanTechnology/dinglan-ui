import { InputNumber, InputNumberProps } from "antd";

type TDlInputNumberProps = InputNumberProps & {
  useType?: "money";
};

export default function DlInputNumber(props: TDlInputNumberProps) {
  const { useType, value, onChange, formatter, parser, ...restProps } = props;

  const moneyFormatter = (value: number | string | undefined) => {
    if (value === undefined || value === null) return "";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const moneyParser = (displayValue: string | undefined) => {
    if (!displayValue) return "";
    const value = displayValue.replace(/¥\s?|(,*)/g, "");
    return parseFloat(value) || "";
  };

  return (
    <InputNumber
      {...restProps}
      formatter={useType === "money" ? moneyFormatter : formatter}
      parser={useType === "money" ? moneyParser : parser}
      controls={false}
      value={value}
      onChange={onChange}
    />
  );
}
