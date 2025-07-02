import { useMemo } from "react";
import Tabela from "./Tabela";

const Klinike = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "sifra",
        header: "ŠIFRA",
        size: 60,
        muiTableBodyCellProps: {
          sx: (theme) => ({
            paddingLeft: "1.5em",
            fontSize: "1rem",
            fontFamily: "Inter",
          }),
        },
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
      sorting={[{ id: "sifra", desc: false }]}
    />
  );
};

export default Klinike;
