import { Table } from "antd";
import PropTypes from "prop-types";
//import { useLayoutEffect, useState } from "react";

const AntTable = ({
  columns,
  dataSource,
  scroll,
  pagination = false, // Default to false
  rowSelection,
  onSelect,
  onRow,
  rowKey,
  loading,
  size = "small", // Default to 'small'
  bordered = true, // Default to true
  onChange,
  rowClassName,
  expandable,
  virtual,
  tableLayout,
}) => {
  const paginationProps =
    pagination === false
      ? false
      : {
          ...pagination,
          pageSizeOptions: [5, 10, 20, 50, 100],
          showSizeChanger: true,
        };

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      scroll={scroll}
      pagination={paginationProps}
      rowSelection={rowSelection}
      onSelect={onSelect}
      onRow={onRow}
      rowKey={rowKey}
      loading={loading}
      size={size}
      bordered={bordered}
      onChange={onChange}
      rowClassName={rowClassName}
      expandable={expandable}
      virtual={virtual}
      tableLayout={tableLayout}
    />
  );
};

AntTable.propTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  scroll: PropTypes.object,
  pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  rowSelection: PropTypes.object,
  onRow: PropTypes.func,
  rowKey: PropTypes.string,
  loading: PropTypes.bool,
  size: PropTypes.string,
  bordered: PropTypes.bool,
  onChange: PropTypes.func,
  rowClassName: PropTypes.func,
  expandable: PropTypes.object,
  onSelect: PropTypes.func,
  virtual: PropTypes.bool,
  tableLayout: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default AntTable;
