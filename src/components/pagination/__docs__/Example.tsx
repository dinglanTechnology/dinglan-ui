import React, { FC, useState } from "react";
import Pagination, { PaginationParams } from "../pagination";

const Example: FC<PaginationParams> = ({
  page = 1,
  size = 10,
  total = 191,
  showTotalInfo = false,
}) => {
  const [current, setCurrent] = useState(page);
  const [pageSize, setPageSize] = useState(size);
  const onChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
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
        size={pageSize}
        page={current}
        total={total}
        onChangePage={onChange}
        showTotalInfo={showTotalInfo}
      />
    </div>
  );
};

export default Example;
