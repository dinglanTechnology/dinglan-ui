import { Pagination } from "antd";
import { PaginationProps } from "rc-pagination/lib/interface";

export interface PaginationParams extends PaginationProps {
  page: number;
  size: number;
  total: number;
  onChangePage: (page: number, size: number) => void;
}

const pagination = ({
  page = 1,
  size = 10,
  total,
  align = "end",
  onChangePage,
  showQuickJumper,
  ...restProps
}: PaginationParams) => {
  return (
    <Pagination
      {...restProps}
      onChange={onChangePage}
      total={total}
      align={align}
      current={page}
      showTotal={(total) =>
        `共有${total}条记录 第${page}/${Math.ceil(total! / size)}页`
      }
      showQuickJumper={showQuickJumper}
    />
  );
};

export default pagination;
