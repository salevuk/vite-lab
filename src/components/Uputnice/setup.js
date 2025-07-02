//import { format } from "date-fns";
import dayjs from "dayjs";

//const options = { dateStyle: "medium" };
//enableColumnActions: false,
//enableColumnFilters: false,
//enableSorting: false

export const mcolumns = [
  // 0
  {
    accessorKey: "id",
    header: "Lab br.",
    size: 60,
    enableHiding: false,
    enableGrouping: false,
    //enableSorting: false,
    muiTableHeadCellProps: {
      align: "center",
      sx: {
        borderRight: "1px solid rgb(170, 170, 170)",
        fontFamily: "Inter !important",
        fontSize: "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem) !important",
      },
    },
    muiTableBodyCellProps: {
      align: "right",
    },
    muiFilterTextFieldProps: {
      placeholder: "LAB br. filter",
    },
  },
  // 1
  {
    accessorKey: "lis_broj",
    header: "LIS br.",
    size: 55,
    enableHiding: false,
    enableSorting: false,
    enableGrouping: false,
    muiTableHeadCellProps: {
      align: "center",
      sx: {
        borderRight: "1px solid rgb(170, 170, 170)",
        fontFamily: "Inter !important",
        fontSize: "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem) !important",
      },
    },
    muiTableBodyCellProps: {
      align: "left",
    },
    muiFilterTextFieldProps: {
      placeholder: "LIS br. filter",
    },
  },
  // 2
  {
    accessorKey: "broj",
    header: "Protokol",
    size: 62,
    enableHiding: false,
    enableSorting: false,
    enableGrouping: false,
    muiTableHeadCellProps: {
      align: "center",
      sx: {
        borderRight: "1px solid rgb(170, 170, 170)",
        fontFamily: "Inter !important",
        fontSize: "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem) !important",
      },
    },
    muiTableBodyCellProps: {
      align: "right",
    },
    muiFilterTextFieldProps: {
      placeholder: "Protokol filter",
    },
  },
  // 3
  {
    accessorKey: "broj_protokola",
    header: "KIS br.",
    size: 70,
    enableHiding: false,
    enableSorting: false,
    muiTableHeadCellProps: {
      align: "center",
      sx: {
        borderRight: "1px solid rgb(170, 170, 170)",
        fontFamily: "Inter !important",
        fontSize: "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem) !important",
      },
    },
    muiTableBodyCellProps: {
      align: "right",
    },
    muiFilterTextFieldProps: {
      placeholder: "KISS br. filter",
    },
  },
  // 4
  {
    accessorKey: "jmbg",
    header: "JMBG",
    size: 75,
    enableHiding: false,
    enableSorting: false,
    muiTableHeadCellProps: {
      align: "center",
      sx: {
        borderRight: "1px solid rgb(170, 170, 170)",
        fontFamily: "Inter !important",
        fontSize: "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem) !important",
      },
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    muiFilterTextFieldProps: {
      placeholder: "JMBG filter",
    },
  },
  // 5
  {
    accessorKey: "ime_prezime",
    accessorFn: (row) =>
      `${row["prezime"].toUpperCase()} ${
        row["ime_roditelja"] !== ""
          ? `(${row["ime_roditelja"].toUpperCase()})`
          : ""
      } ${row["ime"].toUpperCase()} ${
        row["datum_rodjenja"]
          ? dayjs(row["datum_rodjenja"]).format("DD.MM.YYYY") //format(new Date(row["datum_rodjenja"]), "dd.MM.yyyy")
          : ""
      }`,
    header: "Pacijent",
    size: 150,
    enableHiding: false,
    enableSorting: false,
    enableGrouping: false,
    enableColumnFilter: false,
    enableColumnActions: false,
    muiTableHeadCellProps: {
      align: "center",
      sx: {
        borderRight: "1px solid rgb(170, 170, 170)",
        fontFamily: "Inter !important",
        fontSize: "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem) !important",
      },
    },
    muiTableBodyCellProps: {
      align: "left",
    },
    muiFilterTextFieldProps: {
      placeholder: "Pacijent filter",
    },
  },
  // 6
  {
    accessorKey: "kreirano_datum",
    header: "Datum",
    size: 80,
    enableHiding: false,
    enableSorting: false,
    enableGrouping: false,
    enableColumnFilter: false,
    enableColumnActions: false,
    //filterVariant: "date-range",
    //Cell: ({ cell }) => cell.getValue().toLocaleDateString("sr", options), //opcija formatiranja datuma preko sr locale
    //filterFn: "betweenInclusive",
    //columnFilterModeOptions: ["between", "betweenInclusive"],
    //enableSorting: false,
    sortingFn: "datetime",
    accessorFn: (row) =>
      `${
        row["kreirano_datum"]
          ? dayjs(row["kreirano_datum"]).format("DD.MM.YYYY HH:mm:ss")
          : ""
      }`, //new Date(row["datum_uputnice"]), // U SARADNJI SA CELL
    muiTableHeadCellProps: {
      align: "center",
      sx: {
        borderRight: "1px solid rgb(170, 170, 170)",
        fontFamily: "Inter !important",
        fontSize: "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem) !important",
      },
    },
    muiTableBodyCellProps: {
      align: "left",
    },
    type: "string",
    /* muiFilterTextFieldProps: {
      //placeholder: "Datum filter",
      InputProps: {
        style: {
          fontFamily: "Inter !important",
          fontSize: "13px !important",
          width: "91% ! important",
        },
      },
    }, */
    /*     muiFilterDatePickerProps: {
      slotProps: {
        inputAdornment: {
          position: "start",
          //marginLeft: "0",
        },
        openPickerButton: {
          //padding: "8px 8px 8px 0",
          color: "primary",
        },
      },
    }, */
  },
  // 7
  {
    accessorKey: "naziv_statusa",
    header: "Status",
    size: 55,
    enableHiding: false,
    enableSorting: false,
    enableGrouping: false,
    enableColumnFilter: false,
    enableColumnActions: false,
    //filterVariant: "select",
    //filterSelectOptions: ["Novi nalaz", "Poslano u lab.", "Stornirano"],
    muiTableHeadCellProps: {
      align: "center",
      sx: {
        borderRight: "1px solid rgb(170, 170, 170)",
        fontFamily: "Inter !important",
        fontSize: "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem) !important",
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        align: "left",
        color: row.original.status === 2 ? "#ef5350" : "inherit",
        fontWeight: row.original.status === 2 ? "bold" : "normal",
        fontFamily: "Inter !important",
        fontSize:
          "clamp(0.8125rem, -0.6414rem + 1.3158vw, 0.9375rem) !important" /* "0.9rem !important" */,
        backgroundColor:
          row.original.status === 1
            ? "#fff176"
            : row.original.status === 3
            ? "#84dcc6"
            : "inherit",
        borderRight: "1px solid rgb(170, 170, 170)",
      },
    }),
    muiFilterTextFieldProps: {
      placeholder: "Status filter",
    },
  },
  // 8
  {
    accessorKey: "vrsta_naziv",
    header: "Vrsta",
    size: 50,
    enableHiding: false,
    enableSorting: false,
    enableGrouping: false,
    enableColumnFilter: false,
    enableColumnActions: false,
    //filterVariant: "select",
    //filterSelectOptions: ["Ambulantni", "Bolnički"],
    muiTableHeadCellProps: {
      align: "center",
      sx: {
        borderRight: "1px solid rgb(170, 170, 170)",
        fontFamily: "Inter !important",
        fontSize: "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem) !important",
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        align: "left",
        fontFamily: "Inter !important",
        fontSize:
          "clamp(0.8125rem, -0.6414rem + 1.3158vw, 0.9375rem) !important" /* "0.9rem !important" */,
        backgroundColor:
          row.original.status === 2
            ? "inherit"
            : row.original.vrsta === 1
            ? "#ffb74d"
            : "inherit",
        color: row.original.status === 2 ? "#bdbdbd" : "inherit",
        borderRight: "1px solid rgb(170, 170, 170)",
      },
    }),
    muiFilterTextFieldProps: {
      placeholder: "Vrsta filter",
    },
  },
  // 9
  {
    accessorKey: "prioritet_naziv",
    header: "Prioritet",
    size: 50,
    enableHiding: false,
    enableSorting: false,
    enableGrouping: false,
    enableColumnFilter: false,
    enableColumnActions: false,
    //filterVariant: "select",
    //filterSelectOptions: ["Redovno", "Hitno"],
    muiTableHeadCellProps: {
      align: "center",
      sx: {
        borderRight: "1px solid rgb(170, 170, 170)",
        fontFamily: "Inter !important",
        fontSize: "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem) !important",
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      align: "center",
      sx: {
        color:
          row.original.prioritet === 1
            ? "#011532"
            : row.original.status === 2
            ? "#bdbdbd"
            : "#3f51b5",
        backgroundColor: row.original.prioritet === 1 ? "#fa7c91" : "inherit",
        fontWeight: row.original.prioritet === 1 ? "bold" : "normal",
        borderRight: "1px solid rgb(170, 170, 170)",
        fontFamily: "Inter !important",
        fontSize:
          "clamp(0.8125rem, -0.6414rem + 1.3158vw, 0.9375rem) !important" /* "0.9rem !important" */,
      },
    }),
    muiFilterTextFieldProps: {
      placeholder: "Prioritet filter",
    },
  },
  // 10
  {
    accessorKey: "napomena",
    header: "Napomena",
    size: 70,
    enableHiding: false,
    enableSorting: false,
    enableGrouping: false,
    enableColumnFilter: false,
    enableColumnActions: false,
    muiTableHeadCellProps: {
      align: "center",
      sx: {
        borderRight: "1px solid #f2f2f2",
        fontFamily: "Inter !important",
        fontSize: "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem) !important",
      },
    },
    muiTableBodyCellProps: {
      align: "left",
      sx: {
        borderRight: "1px solid #f2f2f2",
        fontFamily: "Inter !important",
        fontSize:
          "clamp(0.8125rem, -0.6414rem + 1.3158vw, 0.9375rem) !important" /* "0.9rem !important" */,
      },
    },
    muiFilterTextFieldProps: {
      placeholder: "Napomena filter",
    },
  },
  // 11
  {
    accessorKey: "kreirano_korisnik",
    header: "Korisnik",
    Cell: ({ row }) =>
      `${row.original.prezime_personala} ${row.original.ime_personala}`,
    size: 70,
    enableHiding: true,
    enableSorting: false,
    enableGrouping: false,
    enableColumnFilter: false,
    enableColumnActions: false,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "left",
    },
  },
];
