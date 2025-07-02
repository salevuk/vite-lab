import { useMemo } from "react";
import Tabela from "./Tabela";

const LabPretrage = ({ data, loading }) => {
  //console.log("loading", loading, new Date());
  const columns = useMemo(
    () => [
      {
        accessorKey: "pretraga_sif",
        header: "ŠIFRA",
        size: 20,
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "pretraga_code",
        header: "CODE",
        size: 20,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "pretraga_naz",
        header: "NAZIV",
        size: 60,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "pretraga_naz_graf",
        header: "NAZIV GRAF",
        size: 70,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "pretraga_tip",
        header: "TIP",
        size: 10,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "ref",
        header: "Ref",
        size: 40,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "jm",
        header: "JM",
        size: 30,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "vrsta",
        header: "VRSTA",
        size: 10,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "usluga_sif",
        header: "ŠIF. USLUGE",
        size: 50,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "komerc_sif",
        header: "KOM. ŠIF.",
        size: 50,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "materijal_sif",
        header: "ŠIF. MATER.",
        size: 40,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "fond",
        header: "FOND",
        size: 10,
        enableHiding: false,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        Cell: ({ row }) => (row.original.fond === 1 ? "DA" : "NE"),
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: ({ row }) => ({
          sx: {
            justifyContent: "center",
            fontFamily: "Inter",
            fontSize: "1em",
            color: row.original.fond === 1 ? "#0077b6" : "inherit",
          },
        }),
      },
    ],
    []
  );
  return (
    <Tabela
      columns={columns}
      data={data}
      loading={loading}
      sorting={[{ id: "pretraga_sif", desc: false }]}
      lab={true}
    />
  );
};

export default LabPretrage;
