import { useMemo } from "react";
import Tabela from "./Tabela";

const StarosneGrupe = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "grupa",
        header: "GRUPA",
        size: 50,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "od_god",
        header: "OD GODINE",
        size: 150,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "do_god",
        header: "DO GODINE",
        size: 150,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "naziv",
        header: "NAZIV",
        size: 150,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ],
    []
  );
  return (
    <Tabela
      columns={columns}
      data={data}
      loading={loading}
      sorting={[{ id: "grupa", desc: false }]}
    />
  );
};

export default StarosneGrupe;
