//import { format } from "date-fns";
import dayjs from "dayjs";

//const options = { dateStyle: "medium" };

export const bcolumns = [
  // 0
  {
    accessorKey: "jmbg",
    header: "JMBG",
    size: 55,
    enableSorting: false,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "left",
    },
    muiFilterTextFieldProps: {
      placeholder: "JMBG filter",
    },
  },
  // 1
  {
    accessorKey: "prezime",
    header: "PREZIME",
    size: 45,
    enableSorting: false,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "left",
    },
    muiFilterTextFieldProps: {
      placeholder: "Prezime filter",
    },
  },
  // 2
  {
    accessorKey: "ime",
    header: "IME",
    size: 45,
    enableSorting: false,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "left",
    },
    muiFilterTextFieldProps: {
      placeholder: "Ime filter",
    },
  },
  // 3
  {
    accessorKey: "datum_rodjenja",
    header: "ROĐEN",
    size: 45,
    enableSorting: false,
    accessorFn: (row) =>
      `${
        row["datum_rodjenja"]
          ? dayjs(row["datum_rodjenja"]).format("DD.MM.YYYY")
          : ""
      }`,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    muiFilterTextFieldProps: {
      placeholder: "Rođen filter",
    },
  },
  // 4
  {
    accessorKey: "broj_protokola",
    header: "PROTOKOL",
    size: 55,
    enableSorting: false,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "left",
    },
    muiFilterTextFieldProps: {
      placeholder: "Protokol filter",
    },
  },
  // 5
  {
    accessorKey: "kreirano_datum",
    header: "DATUM",
    size: 60,
    accessorFn: (row) =>
      `${
        row["kreirano_datum"]
          ? dayjs(row["kreirano_datum"]).format("DD.MM.YYYY HH:mm:ss")
          : ""
      }`,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "left",
    },
    type: "string",
    muiFilterTextFieldProps: {
      placeholder: "Datum filter",
    },
  },
  // 6
  {
    accessorKey: "prioritet_naziv",
    header: "PRIORITET",
    size: 55,
    muiTableHeadCellProps: {
      align: "center",
    },
    enableSorting: false,
    filterVariant: "select",
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        align: "center",
        justifyContent: "center",
        color: row.original.prioritet === 1 ? "#011532" : "#3f51b5",
        backgroundColor: row.original.prioritet === 1 ? "#fa7c91" : "inherit",
        fontWeight: row.original.prioritet === 1 ? "bold" : "normal",
        borderRight: "1px solid rgb(170, 170, 170)",
      },
    }),
    muiFilterTextFieldProps: {
      placeholder: "Prioritet filter",
    },
  },

  // 7
  {
    accessorKey: "skladiste_grupa",
    header: "KLINIKA",
    size: 45,
    muiTableHeadCellProps: {
      align: "center",
    },
    enableSorting: false,
    filterVariant: "select",
    muiTableBodyCellProps: {
      align: "right",
    },
    muiFilterTextFieldProps: {
      placeholder: "Klinika filter",
    },
  },
  // 8
  {
    accessorKey: "skladiste_grupa_naz",
    header: "KLINIKA NAZIV",
    size: 90,
    muiTableHeadCellProps: {
      align: "center",
    },
    enableSorting: false,
    filterVariant: "select",
    muiTableBodyCellProps: ({ row }) => ({
      align: "left",
      title: row.original.skladiste_grupa_naz,
    }),
    muiFilterTextFieldProps: {
      placeholder: "Klinika naziv filter",
    },
  },
  // 9
  {
    accessorKey: "skladiste",
    header: "ODJEL",
    size: 35,
    enableSorting: false,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "right",
    },
    muiFilterTextFieldProps: {
      placeholder: "Odjel filter",
    },
  },
  // 10
  {
    accessorKey: "skladiste_naz",
    header: "ODJEL NAZIV",
    size: 90,
    enableSorting: false,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: ({ row }) => ({
      align: "left",
      title: row.original.skladiste_naz,
    }),
    muiFilterTextFieldProps: {
      placeholder: "Odjel naziv filter",
    },
  },
];
