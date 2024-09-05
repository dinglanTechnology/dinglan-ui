import React, { FC } from "react";
import AddressSelect, { AddressSelectProps } from "../AddressSelect";

const Example: FC<AddressSelectProps> = ({ value, onChange }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <AddressSelect value={value} onChange={onChange} />
    </div>
  );
};

export default Example;
