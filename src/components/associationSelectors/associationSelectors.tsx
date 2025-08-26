import { Select, SelectProps } from "antd";

export interface AssociationSelectorsParams
  extends Omit<SelectProps, "options"> {
  options: {
    name: string;
    code: string | number | boolean;
  }[];
  onChange: (value: string | number | boolean) => void;
}

const associationSelectors = ({
  options,
  onChange,
  ...restProps
}: AssociationSelectorsParams) => {
  return (
    <Select
      fieldNames={{ label: "name", value: "code" }}
      options={options}
      onChange={onChange}
      {...restProps}
    />
  );
};

export default associationSelectors;
