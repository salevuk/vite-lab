import { useMemo } from "react";
import Tabela from "./Tabela";

const DoktoriUKC = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "ime",
        header: "IME",
        size: 70,
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "prezime",
        header: "PREZIME",
        size: 100,
      },
      {
        accessorKey: "potpis",
        header: "POTPIS",
        size: 200,
      },
      {
        accessorKey: "klinika",
        header: "ŠIFRA KLINIKE",
        size: 50,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "naziv_klinike",
        header: "NAZIV KLINIKE",
        size: 100,
        muiTableHeadCellProps: {
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
      sorting={[{ id: "klinika", desc: false }]}
    />
  );
};

export default DoktoriUKC;
