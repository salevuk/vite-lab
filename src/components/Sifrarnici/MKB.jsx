import { useMemo } from "react";
import Tabela from "./Tabela";

const MKB = ({ data, loading }) => {
  //console.log("loading", loading, new Date());
  const columns = useMemo(
    () => [
      {
        accessorKey: "fond_sifra",
        header: "ŠIFRA FONDA",
        size: 60,
      },
      {
        accessorKey: "oznaka",
        header: "ŠIFRA MKB",
        size: 60,
      },
      {
        accessorKey: "latinski_naziv",
        header: "LATINSKI NAZIV",
        size: 200,
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
      sorting={[{ id: "fond_sifra", desc: false }]}
    />
  );
};

export default MKB;
