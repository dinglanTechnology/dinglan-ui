import { FormItemProps, Select, Space } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { json } from "./district.json";
import { useRef, useState } from "react";
import MUNICIPALITIES from "../../constants/index";

type Result = {
  province?: DefaultOptionType | undefined;
  city?: DefaultOptionType | undefined;
  district?: DefaultOptionType | undefined;
};
export interface AddressSelectProps extends FormItemProps {
  value?: Result;
  onChange?: (value: Result) => void;
  width?: number;
}

const [provinces, cities, districts] = json;

const AddressSelect = (props: AddressSelectProps) => {
  const [result, setResult] = useState<Result>(); // 最终选中的地址
  const [cityOptions, setCityOptions] = useState<DefaultOptionType[]>([]); // 市级option数据
  const [districtOptions, setDistrictOptions] = useState<DefaultOptionType[]>(); // 区县option数据
  const isMunicipality = useRef<boolean>(false); // 是否是直辖市
  // 选择省份
  const onProvinceChange = (option: DefaultOptionType) => {
    // 判断是否是直辖市
    isMunicipality.current = MUNICIPALITIES.includes(option?.label as string);
    setResult({ province: option, city: undefined, district: undefined });
    // 设置省份
    props.onChange?.({
      province: option,
      city: undefined,
      district: undefined,
    });
    if (isMunicipality.current) {
      // 如果是直辖市，则直接设置市列表选项为空
      setCityOptions([option]);
      return;
    }
    // 根据省份ID获取市列表
    const cityList = cities.reduce((acc: DefaultOptionType[], item) => {
      if (item.id.substring(0, 2) === option?.key?.substring(0, 2)) {
        acc.push({
          label: item.fullname,
          value: item.id,
        });
      }
      return acc;
    }, []);
    // 设置市列表选项
    setCityOptions(cityList);
  };

  // 选择市
  const onCityChange = (option: DefaultOptionType) => {
    setResult({ ...result, city: option, district: undefined });
    // 设置市
    props.onChange?.({ ...result, city: option, district: undefined });
    // 如果是直辖市
    const filterData = isMunicipality.current ? cities : districts;
    const districtList = filterData.reduce((acc: DefaultOptionType[], item) => {
      if (
        item.id.substring(0, isMunicipality.current ? 2 : 4) ===
        option?.key?.substring(0, isMunicipality.current ? 2 : 4)
      ) {
        acc.push({
          label: item.fullname,
          value: item.id,
        });
      }
      return acc;
    }, []);
    setDistrictOptions(districtList);
  };

  // 选择区县
  const onDistrictChange = (option: DefaultOptionType) => {
    setResult({ ...result, district: option });
    // 设置区县
    props.onChange?.({ ...result, district: option });
  };

  return (
    <Space wrap>
      <Select
        {...props}
        labelInValue
        style={{ width: props?.width ?? 120 }}
        options={provinces.map((item) => ({
          label: item.fullname,
          value: item.id,
        }))}
        value={result?.province}
        onChange={onProvinceChange}
        placeholder="请选择省份/直辖市"
      />
      <Select
        {...props}
        labelInValue
        onChange={onCityChange}
        style={{ width: props?.width ?? 120 }}
        options={cityOptions}
        placeholder="请选择市"
        value={result?.city}
      />
      <Select
        {...props}
        labelInValue
        onChange={onDistrictChange}
        style={{ width: props?.width ?? 120 }}
        options={districtOptions}
        placeholder="请选择区县"
        value={result?.district}
      />
    </Space>
  );
};

export default AddressSelect;
