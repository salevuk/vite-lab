import { useMemo } from "react";
import Tabela from "./Tabela";

const Odjeli = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ŠIFRA",
        size: 60,
      },
      {
        accessorKey: "naziv",
        header: "NAZIV ODJELA",
        size: 200,
      },
      {
        accessorKey: "id_grupe",
        header: "ŠIFRA KLINIKE",
        size: 60,
      },
      {
        accessorKey: "naziv_klinike",
        header: "NAZIV KLINIKE",
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
      sorting={[{ id: "sifra", desc: false }]}
    />
  );
};

export default Odjeli;
