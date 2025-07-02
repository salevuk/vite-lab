import { useMemo } from "react";
import Tabela from "./Tabela";

const StatusPacijenta = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "status_pacijenta",
        header: "STATUS",
        size: 100,
      },
      {
        accessorKey: "naziv",
        header: "NAZIV",
        size: 90,
      },
    ],
    []
  );
  return (
    <Tabela
      columns={columns}
      data={data}
      loading={loading}
      sorting={[{ id: "status_pacijenta", desc: false }]}
    />
  );
};

export default StatusPacijenta;
