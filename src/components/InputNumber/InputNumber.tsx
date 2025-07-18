import { InputNumber, InputNumberProps } from "antd";

type TDlInputNumberProps = InputNumberProps & {
  useType?: "money";
};

export default function DlInputNumber(props: TDlInputNumberProps) {
  const { useType, value, onChange, formatter, parser, ...restProps } = props;

  const moneyFormatter = (value: number | string | undefined): string => {
    if (value === null || value === undefined || value === "") {
      return "";
    }
    const str = value.toString();
    const [integerPart, decimalPart] = str.split(".");
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ",",
    );
    return decimalPart
      ? `${formattedIntegerPart}.${decimalPart}`
      : `${formattedIntegerPart}`;
  };
  const moneyParser = (displayValue: string | undefined) => {
    if (!displayValue) return "";
    return displayValue.replace(/,/g, "");
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
