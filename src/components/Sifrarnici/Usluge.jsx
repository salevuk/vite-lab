import { useMemo } from "react";
import Tabela from "./Tabela";

const Usluge = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "RED BR.",
        size: 10,
        muiTableHeadCellProps: {
          sx: (/* theme */) => ({
            paddingLeft: "1.5em",
            borderRight: "1px solid rgb(170, 170, 170)",
          }),
        },
      },

      {
        accessorKey: "sifra",
        header: "ŠIFRA",
        size: 30,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "naziv",
        header: "NAZIV",
        size: 200,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "fond_cijena",
        header: "FOND CIJENA",
        size: 30,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        Cell: ({ row }) => `${row.original.fond_cijena.toFixed(2)} KM`,
      },
      {
        accessorKey: "fond_participacija",
        header: "PARTICIPACIJA",
        size: 30,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        Cell: ({ row }) => `${row.original.fond_participacija.toFixed(2)} KM`,
      },
      {
        accessorKey: "fond_procenat_participacije",
        header: "PART. PROCENAT",
        size: 40,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ row }) => `${row.original.fond_procenat_participacije} %`,
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

export default Usluge;
