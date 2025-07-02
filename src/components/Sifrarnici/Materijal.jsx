import { useMemo } from "react";
import Tabela from "./Tabela";

const Materijal = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "materijal_sif",
        header: "ŠIFRA",
        size: 30,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "materijal_naz",
        header: "NAZIV",
        size: 150,
        muiTableHeadCellProps: {
          align: "left",
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
      sorting={[{ id: "materijal_sif", desc: false }]}
    />
  );
};

export default Materijal;
