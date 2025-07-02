import { useMemo } from "react";
import Tabela from "./Tabela";

const OsnoveOslobadjanja = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "fond_sifra",
        header: "ŠIFRA FONDA",
        size: 60,
      },
      {
        accessorKey: "kategorija",
        header: "KATEGORIJA",
        size: 150,
      },
      {
        accessorKey: "naziv",
        header: "NAZIV",
        size: 200,
      },
      {
        accessorKey: "opis",
        header: "OPIS",
        size: 300,
      },
    ],
    []
  );
  return (
    <Tabela
      columns={columns}
      data={data}
      loading={loading}
      sorting={[{ id: "fond_sifra", desc: false }]}
    />
  );
};

export default OsnoveOslobadjanja;
