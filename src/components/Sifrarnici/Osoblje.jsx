import { useMemo } from "react";
import Tabela from "./Tabela";

const Osoblje = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
      },
      {
        accessorKey: "klinika",
        header: "KLINIKA",
        size: 60,
      },
      {
        accessorKey: "odjel",
        header: "ODJEL",
        size: 60,
      },
      {
        accessorKey: "ime",
        header: "IME",
        size: 100,
      },
      {
        accessorKey: "prezime",
        header: "PREZIME",
        size: 120,
      },
      {
        accessorKey: "titula",
        header: "TITULA",
        size: 200,
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
      osoblje={true}
    />
  );
};

export default Osoblje;
