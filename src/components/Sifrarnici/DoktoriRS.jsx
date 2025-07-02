import { useMemo } from "react";
import Tabela from "./Tabela";

const DoktoriRS = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "fond_sifra_ustanove",
        header: "ŠIFRA USTANOVE",
        size: 70,
      },
      {
        accessorKey: "fond_sifra_ljekara",
        header: "ŠIFRA LJEKARA",
        size: 60,
      },
      {
        accessorKey: "ime",
        header: "IME",
        size: 90,
      },
      {
        accessorKey: "prezime",
        header: "PREZIME",
        size: 110,
      },
      {
        accessorKey: "org_jed",
        header: "ORG. JEDINICA",
        size: 140,
      },
      {
        accessorKey: "zdr_ustanova",
        header: "ZDRAVSTVENA USTANOVA",
        size: 140,
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

export default DoktoriRS;
