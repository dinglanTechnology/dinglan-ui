import { Pagination } from "antd";
import { PaginationProps } from "rc-pagination/lib/interface";

export interface PaginationParams extends PaginationProps {
  page: number;
  size: number;
  total: number;
  onChangePage: (page: number, size: number) => void;
  showTotalInfo?:
    | boolean
    | ((total: number, range: [number, number]) => React.ReactNode);
}

const pagination = ({
  page = 1,
  size = 10,
  total,
  align = "end",
  onChangePage,
  showQuickJumper,
  showTotalInfo,
  ...restProps
}: PaginationParams) => {
  const defaultShowTotal = (total: number) =>
    `共有${total}条记录 第${page}/${Math.ceil(total! / size)}页`;
  const showTotal = (total: number, range: [number, number]) => {
    if (typeof showTotalInfo === "boolean" && !!showTotalInfo) {
      return defaultShowTotal(total);
    } else if (typeof showTotalInfo === "function") {
      return showTotalInfo(total, range);
    }
    return undefined;
  };
  return (
    <Pagination
      {...restProps}
      onChange={onChangePage}
      total={total}
      align={align}
      current={page}
      showTotal={showTotal}
      showQuickJumper={showQuickJumper}
    />
  );
};

pagination.displayName = "DinglanUI.Pagination";

export default pagination;
