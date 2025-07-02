import { useMemo } from "react";
import Tabela from "./Tabela";

const Ordinacije = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "fond_sifra_ustanove",
        header: "ŠIFRA USTANOVE",
        size: 70,
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
        accessorKey: "org_jed",
        header: "ORG. JEDINICA",
        size: 150,
      },
      {
        accessorKey: "zdr_ustanova",
        header: "ZDRAVSTVENA USTANOVA",
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
      sorting={[{ id: "fond_sifra_ustanove", desc: false }]}
    />
  );
};

export default Ordinacije;
