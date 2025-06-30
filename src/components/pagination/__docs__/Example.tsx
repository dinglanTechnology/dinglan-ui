import React, { FC, useState } from "react";
import Pagination, { PaginationParams } from "../pagination";

const Example: FC<PaginationParams> = ({
  page = 1,
  size = 10,
  total = 191,
}) => {
  const [current, setCurrent] = useState(page);
  const onChange = (page: number, size: number) => {
    setCurrent(page);
    console.log(size);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Pagination
        size={size}
        page={current}
        total={total}
        onChangePage={onChange}
      />
    </div>
  );
};

export default Example;
