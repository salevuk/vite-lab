export const rcolumns = [
  // 0
  {
    accessorKey: "jmbg",
    header: "JMBG",
    size: 50,
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
    accessorKey: "lab_br",
    header: "LAB br.",
    size: 45,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    muiFilterTextFieldProps: {
      placeholder: "LAB br. filter",
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
    accessorKey: "datum_pocetak",
    header: "DATUM POČETAK",
    size: 65,
    enableSorting: false,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "left",
    },
    type: "string",
    muiFilterTextFieldProps: {
      placeholder: "Dat. početak filter",
    },
  },
  // 6
  {
    accessorKey: "datum_kraj",
    header: "DATUM KRAJ",
    size: 60,
    enableSorting: false,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "left",
    },
    type: "string",
    muiFilterTextFieldProps: {
      placeholder: "Dat. kraj filter",
    },
  },
  // 7
  {
    accessorKey: "klinika_narucioca",
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
    accessorKey: "odjel_narucioca",
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
  // 9
  {
    accessorKey: "prioritet",
    header: "PRIORITET",
    size: 50,
    muiTableHeadCellProps: {
      align: "center",
    },
    enableSorting: false,
    filterVariant: "select",
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        align: "center",
        justifyContent: "center",
        color: row.original.prioritet === "Hitno" ? "#011532" : "#3f51b5",
        backgroundColor:
          row.original.prioritet === "Hitno" ? "#fa7c91" : "inherit",
        fontWeight: row.original.prioritet === "Hitno" ? "bold" : "normal",
        borderRight: "1px solid rgb(170, 170, 170)",
      },
    }),
    muiFilterTextFieldProps: {
      placeholder: "Prioritet filter",
    },
  },
  // 10
  {
    accessorKey: "vrsta",
    header: "VRSTA",
    size: 30,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    muiFilterTextFieldProps: {
      placeholder: "Storno filter",
    },
  },
  /*  {
    accessorKey: "storno",
    header: "STORNO",
    size: 30,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    muiFilterTextFieldProps: {
      placeholder: "Storno filter",
    },
  }, */
  // 11
  {
    accessorKey: "napomena",
    header: "NAPOMENA",
    size: 65,
    enableSorting: false,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "left",
    },
    type: "string",
    muiFilterTextFieldProps: {
      placeholder: "Napomena filter",
    },
  },
];
