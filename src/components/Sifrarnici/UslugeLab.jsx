import { useMemo } from "react";
import Tabela from "./Tabela";

const UslugeLab = ({ data, loading }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "pretraga_sif",
        header: "ŠIFRA PRETRAGE",
        size: 40,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          height: "100% !important",
          align: "center",
        },
      },
      {
        accessorKey: "pretraga_naz",
        header: "NAZIV PRETRAGE",
        size: 100,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "center",
          height: "100%",
        },
      },
      {
        accessorKey: "usluga_sif",
        header: "ŠIFRA USLUGE",
        size: 30,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          height: "100% !important",
          align: "center",
        },
      },
      /* {
        accessorKey: "komusluga_sif",
        header: "KOMERC. ŠIFRA USLUGE",
        size: 30,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          height: "100% !important",
          align: "center",
        },
      },*/
      {
        accessorKey: "usluga_naz",
        header: "NAZIV USLUGE",
        size: 100,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "center",
          height: "100%",
        },
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
          align: "center",
          height: "100%",
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
          align: "center",
          height: "100%",
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
          align: "center",
          height: "100%",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ row }) => `${row.original.fond_procenat_participacije} %`,
      },
      /*{
        accessorKey: "vpc",
        header: "VELEP. CIJENA",
        size: 30,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "center",
          height: "100%",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        Cell: ({ row }) => `${row.original.vpc.toFixed(2)} KM`,
      }, */
      {
        accessorKey: "mpc",
        header: "MPC",
        size: 60,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "center",
          height: "100%",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        Cell: ({ row }) => `${row.original.mpc.toFixed(2)} KM`,
      },
      /* {
        accessorKey: "pdv",
        header: "PDV",
        size: 20,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "center",
          height: "100%",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ row }) => `${row.original.pdv} %`,
      }, */
    ],
    []
  );
  return (
    <Tabela
      columns={columns}
      data={data}
      loading={loading}
      sorting={[{ pretraga_sif: "pretraga_sif", desc: false }]}
      uslugelab={true}
    />
  );
};

export default UslugeLab;
