import { useMemo } from "react";
import Tabela from "./Tabela";

const KategorijeOsiguranja = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
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
        accessorKey: "naziv_osnove",
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
      sorting={[{ id: "id", desc: false }]}
    />
  );
};

export default KategorijeOsiguranja;
