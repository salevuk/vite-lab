import { useMemo } from "react";
import Tabela from "./Tabela";

const ZdravstvenaUstanova = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "REDNI br.",
        size: 60,
      },
      {
        accessorKey: "sifra",
        header: "Šifra",
        size: 90,
      },
      {
        accessorKey: "naziv",
        header: "NAZIV",
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
    />
  );
};

export default ZdravstvenaUstanova;
