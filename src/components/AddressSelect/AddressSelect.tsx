import { Select, Space } from "antd";
import type { DefaultOptionType } from "antd/es/select";

export interface AddressSelectProps {
  value?: DefaultOptionType;
  onChange?: (value: DefaultOptionType) => void;
}

const AddressSelect = (props: AddressSelectProps) => {
  return (
    <Space wrap>
      <Select
        style={{ width: 120 }}
        options={[{ label: "1", value: "1" }]}
        placeholder="请选择省份"
        {...props}
      />
    </Space>
  );
};

export default AddressSelect;
