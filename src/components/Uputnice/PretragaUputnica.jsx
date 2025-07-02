import { Fragment, useMemo, useEffect, useState, useRef } from "react";
import Popup from "../UI/Forms/Popup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useStore } from "../../store.js";
import { mcolumns } from "./setup.js";
import { uputnicaTransformer } from "../util/transformer.js";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ChecklistRtlTwoToneIcon from "@mui/icons-material/ChecklistRtlTwoTone";
import ApprovalTwoToneIcon from "@mui/icons-material/ApprovalTwoTone";
import RezultatModal from "../Modals/Rezultati/RezultatModal.jsx";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
//import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/sr";

const PretragaUputnica = ({ closePretragaUputnica, notifikacija }) => {
  const sesijaPodaci = useStore((store) => store.sesijaPodaci);
  const columnVisibilityPretraga = useStore((store) => store.columnVisibility);
  const globalFilterPretraga = useStore((store) => store.globalFilter);
  const [podaciPretrage, setPodaciPretrage] = useState([]);
  const [prRezModal, setPrRezModal] = useState(false);
  const [rezUputnice, setRezUputnice] = useState({});
  const [errors, setErrors] = useState({});
  const setPodaciUputnice = useStore((store) => store.setPodaciUputnice);
  const setOtvoriPrintOvjere = useStore((store) => store.setOtvoriPrintOvjere);
  const setOtvoriPrintUplatnice = useStore(
    (store) => store.setOtvoriPrintUplatnice
  );

  const queryClient = useQueryClient();

  const jmbgRef = useRef(null);
  const prezimeRef = useRef(null);
  const imeRef = useRef(null);

  const columns = useMemo(() => mcolumns, []);
  console.warn("podaciPretrage", podaciPretrage);
  const { data, refetch, isError, isFetching, error } = useQuery({
    queryKey: ["pretraga"],
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `../rpc/laboratorija.cfc?method=pretraga_uputnica&jmbg=${jmbgRef.current.value}&prezime=${prezimeRef.current.value}&ime=${imeRef.current.value}`,
        { method: "GET", signal: signal }
      );
      return response.json();
    },
    enabled: false,
  });

  const povuciRezultat = async (id) => {
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=rezultat&id=${id}`,
      { method: "get" }
    );
    return await response.json();
  };

  useEffect(() => {
    if (isError) {
      notifikacija(true, error.message);
    }
    if (data !== undefined) {
      uputnicaTransformer(data.lista, setPodaciPretrage);
    } // eslint-disable-next-line
  }, [data]);

  const handleClose = () => {
    queryClient.removeQueries({ queryKey: ["pretraga"] }); // obriši cache za ovaj query
    closePretragaUputnica();
  };

  const handleRezultat = (id) => {
    povuciRezultat(id).then((r) => {
      setRezUputnice(r.rezultat);
      setPrRezModal(true);
    });
  };

  const handlePretraga = () => {
    let temp = { ...errors };
    const jmbgRegex = /^\d{7,}$/;
    if (
      (jmbgRef.current?.value !== "" &&
        !jmbgRegex.test(jmbgRef.current?.value)) ||
      (prezimeRef.current?.value === "" &&
        jmbgRef.current?.value === "" &&
        imeRef.current?.value === "")
    ) {
      temp.jmbg = "Potrebno je unijeti min. 7 cifara za JMBG";
    } else if (Boolean(errors.jmbg) === true) {
      temp.jmbg = "";
    }
    const tekstRegex = /^[a-zA-ZščćžđŠČĆŽĐ ]+$/;
    if (
      (!tekstRegex.test(prezimeRef.current?.value) &&
        prezimeRef.current?.value !== "") ||
      (prezimeRef.current?.value === "" &&
        jmbgRef.current?.value === "" &&
        imeRef.current?.value === "")
    ) {
      temp.prezime = "Moguće unijeti samo tekst";
    } else if (Boolean(errors.prezime) === true) {
      temp.prezime = "";
    }
    if (
      (!tekstRegex.test(imeRef.current?.value) &&
        imeRef.current?.value !== "") ||
      (prezimeRef.current?.value === "" &&
        jmbgRef.current?.value === "" &&
        imeRef.current?.value === "")
    ) {
      temp.ime = "Moguće unijeti samo tekst";
    } else if (Boolean(temp.ime) === true) {
      temp.ime = "";
    }
    setErrors({ ...temp });
    if (
      !jmbgRef.current?.value &&
      !prezimeRef.current?.value &&
      !imeRef.current?.value
    ) {
      notifikacija(
        true,
        "Potrebno je unijeti bar u jedno polje podatke",
        "error",
        3000
      );
      return;
    }
    if (Object.values(temp).some((error) => error)) return;
    refetch();
  };

  const inputForma = (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: "center", height: "90px" }}
      >
        <TextField
          type="search"
          error={errors?.jmbg}
          label="JMBG"
          inputRef={jmbgRef}
          variant="standard"
          helperText={errors.jmbg ? errors.jmbg : ""}
        />
        <TextField
          type="search"
          error={errors?.prezime}
          label="Prezime"
          inputRef={prezimeRef}
          variant="standard"
          helperText={errors.prezime ? errors.prezime : ""}
        />
        <TextField
          type="search"
          error={errors?.ime}
          label="Ime"
          inputRef={imeRef}
          variant="standard"
          helperText={errors.ime ? errors.ime : ""}
        />
        <Button
          variant="contained"
          color="info"
          sx={{
            fontFamily: "Inter",
            fontSize: "clamp(0.75rem, calc(1vw - 0.15rem), 0.95rem)",
          }}
          onClick={() => handlePretraga()}
        >
          PRETRAŽI
        </Button>
      </Stack>
    </Box>
  );

  const table = useMaterialReactTable({
    columns,
    data: podaciPretrage,
    columnFilterDisplayMode: "popover",
    enableGrouping: true,
    enableColumnDragging: false,
    enableStickyHeader: true,
    enableRowVirtualization: true,
    enableColumnActions: true, // meni za kolonu (tri tacke kod naziva kolone)
    enableRowActions: true,
    positionActionsColumn: "first",
    enableFullScreenToggle: false,
    //enableColumnFilterModes={true}
    //sortDescFirst={true}
    state: {
      showSkeletons: isFetching,
      globalFilter: globalFilterPretraga,
      columnVisibility: columnVisibilityPretraga,
    },
    initialState: {
      pagination: { pageSize: 100, pageIndex: 0 },
      showColumnFilters: true,
      showGlobalFilter: true,
      density: "compact",
      sorting: [{ id: "id", desc: true }], //def sort po ovoj koloni opadajući
    },
    onColumnVisibilityChange: () =>
      useStore.setState({
        columnVisibility: {
          kreirano_korisnik: !columnVisibilityPretraga.kreirano_korisnik,
        },
      }),
    onGlobalFilterChange: (value) => useStore.setState({ globalFilter: value }),
    muiSearchTextFieldProps: {
      sx: { minWidth: "300px", fontFamily: "Inter" },
      size: "small",
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 10,
        muiTableHeadCellProps: {
          align: "center",
          sx: {
            padding: "0",
            fontFamily: "Inter",
            fontSize: "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem)",
            borderRight: "1px solid rgb(170, 170, 170)", //samo za prvu kolonu OPCIJE
          },
        },
        muiTableBodyCellProps: {
          sx: {
            padding: "0px",
            borderRight: "1px solid rgb(170, 170, 170)", //samo za prvu kolonu OPCIJE
            justifyContent: "center",
          },
        },
      },
    },
    muiTableContainerProps: {
      sx: { minHeight: "calc(100vh - 262px)", maxHeight: "9999px" }, //72.5vh  clamp(350px, -142px + 100vh, 9999px)
    },
    renderRowActionMenuItems: ({ closeMenu, row, table }) => [
      <>
        <p style={{ marginBlock: "0", marginInline: "0.5em" }}>
          {row.original.prezime + " " + row.original.ime}
        </p>
        <MenuItem
          onClick={(event) => {
            handleRezultat(row.original.id);
            event.stopPropagation();
            closeMenu();
          }}
          table={table}
          disabled={row.original.status !== 3}
        >
          <ChecklistRtlTwoToneIcon
            sx={{
              color: "#0e5959",
            }}
          />
          <p style={{ margin: "0.25em" }}>Rezultati</p>
        </MenuItem>
        <MenuItem
          onClick={(event) => {
            setPodaciUputnice(row.original);
            setOtvoriPrintOvjere(true);
            event.stopPropagation();
            closeMenu();
          }}
          table={table}
          disabled={row.original.status === 0 || row.original.status === 2}
        >
          <ApprovalTwoToneIcon
            sx={{
              color: "#004777",
            }}
          />
          <p style={{ margin: "0.25em" }}>Šifriranje</p>
        </MenuItem>
        <MenuItem
          onClick={(event) => {
            setPodaciUputnice(row.original);
            setTimeout(() => setOtvoriPrintUplatnice(true), 100);
            event.stopPropagation();
            closeMenu();
          }}
          table={table}
          disabled={row.original.status === 0 || row.original.status === 2}
        >
          <PaymentTwoToneIcon
            sx={{
              color: "#A7754D",
            }}
          />
          <p style={{ margin: "0.25em" }}>Uplatnica</p>
        </MenuItem>
      </>,
    ],
    muiTablePaginationProps: {
      rowsPerPageOptions: [1000, 2000],
      showFirstButton: false,
      showLastButton: false,
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: (theme) => ({
        cursor: row.original.status === 2 ? "not-allowed" : "pointer",
        backgroundColor:
          row.original.status === 2 ? theme.palette.grey["100"] : "inherit",
        "&:hover": {
          color: "#002884",
          border: "1px solid #002884",
        },
      }),
    }),
    muiTablePaperProps: {
      elevation: 5,
      sx: {
        borderRadius: "5px",
      },
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: (theme) => ({
        borderRight: "1px solid rgb(170, 170, 170)", //za one kolone koje nisu preko setupa kontrolisane
        fontFamily: "Inter !important",
        fontSize:
          "clamp(0.8125rem, -0.6414rem + 1.3158vw, 0.9375rem) !important" /* "0.9rem !important" */,
        color:
          row.original.status === 2 ? theme.palette.grey["400"] : "inherit",
      }),
    }),
    muiTableHeadCellProps: {
      // borderRight preko setup-a kontrolisano
      sx: {
        padding: "0.25em",
        fontFamily: "Inter !important",
      },
    },
    muiFilterTextFieldProps: {
      InputProps: {
        style: {
          fontFamily: "Inter !important",
          fontSize: "13px !important",
          width: "91% !important",
        },
      },
      sx: { margin: "0.5rem 0px 0.25rem 0px" },
      variant: "standard",
      size: "small",
    },

    localization: {
      actions: "Opcije",
      and: "i",
      cancel: "Ponisti",
      changeFilterMode: "Promjeni mod filtriranja",
      changeSearchMode: "Promjeni mod pretrage",
      clearFilter: "Ponisti filtere",
      clearSearch: "Poništi pretragu",
      clearSort: "Poništi sortiranja",
      clickToCopy: "Klikni da kopiraš",
      collapse: "Skupi",
      collapseAll: "Skupi sve",
      columnActions: "Column Actions",
      copiedToClipboard: "Kopirano u clipboard",
      dropToGroupBy: "Prevuci da grupišeš po {column}",
      edit: "Uredi",
      expand: "Raširi",
      expandAll: "Raširi sve",
      filterArrIncludes: "Uključuje",
      filterArrIncludesAll: "Uključuje sve",
      filterArrIncludesSome: "Uključuje",
      filterBetween: "Između",
      filterBetweenInclusive: "Između inkluzivnog",
      filterByColumn: "{column} filter",
      filterContains: "Sadrži",
      filterEmpty: "Prazno",
      filterEndsWith: "Završava sa",
      filterEquals: "Jednako",
      filterEqualsString: "Jednako",
      filterFuzzy: "Fuzzy",
      filterGreaterThan: "Veće od",
      filterGreaterThanOrEqualTo: "Veće ili jednako",
      filterInNumberRange: "Između",
      filterIncludesString: "Sadrži",
      filterIncludesStringSensitive: "Sadrži",
      filterLessThan: "Manje od",
      filterLessThanOrEqualTo: " Manje ili jednako",
      filterMode: "Filter mod: {filterType}",
      filterNotEmpty: "Nije prazno",
      filterNotEquals: "Nije jednako",
      filterStartsWith: "Počinje sa",
      filterWeakEquals: "Jednako",
      filteringByColumn: "Filtriraj po {column} - {filterType} {filterValue}",
      goToFirstPage: "Idi na prvu stranu",
      goToLastPage: "Idi na poslednju stranu",
      goToNextPage: "Idi na iduću stranu",
      goToPreviousPage: "Idi na prethodnu stranu",
      grab: "Uzmi",
      groupByColumn: "Grupiši po {column}",
      groupedBy: "Grupisano po ",
      hideAll: "Sakrij sve",
      hideColumn: "Sakrij {column} kolonu",
      max: "Max",
      min: "Min",
      move: "Pomjeri",
      noRecordsToDisplay: "Nema podataka o uputnicama",
      noResultsFound:
        !sesijaPodaci.lab_privilegije.includes(2) &&
        !sesijaPodaci.grupa_korisnika.includes("1")
          ? "Nemate pravo pristupa nalozima/uputnicama. Molimo vas obratite se načelniku odjeljenja!"
          : "Nema podataka o uputnicama za primjenjeni filter",
      of: "od",
      or: "ili",
      pinToLeft: "Zakači lijevo",
      pinToRight: "Zakači desno",
      resetColumnSize: "Resetuj veličinu kolone",
      resetOrder: "Resetuj redoslijed",
      rowActions: "Dodatne opcije",
      rowNumber: "#",
      rowNumbers: "Broj redova",
      rowsPerPage: "Redova po strani",
      save: "Sačuvaj",
      search: "Traži",
      selectedCountOfRowCountRowsSelected:
        "{selectedCount} od {rowCount} redova selektovano",
      select: "Izaberi",
      showAll: "Prikaži sve",
      showAllColumns: "Prikaži sve kolone",
      showHideColumns: "Prikaži/sakrij kolone",
      showHideFilters: "Prikaži/sakrij filtere",
      showHideSearch: "Prikaži/sakrij pretragu",
      sortByColumnAsc: "Sortiraj {column} A-Z",
      sortByColumnDesc: "Sortiraj {column} Z-A",
      sortedByColumnAsc: "Sortirano {column} A-Z",
      sortedByColumnDesc: "Sortirano {column} Z-A",
      thenBy: ", onda po ",
      toggleDensity: "Promjeni prored",
      toggleFullScreen: "Promjeni veličinu ekrana",
      toggleSelectAll: "Selektuj sve",
      toggleSelectRow: "Selektuj red",
      toggleVisibility: "Promjeni vidljivost",
      ungroupByColumn: "Odgrupiši po {column}",
      unpin: "Otkači",
      unpinAll: "Otkači sve",
      unsorted: "Poništi sortiranje",
    },
  });
  return (
    <Fragment>
      <Popup
        title={"PRETRAGA UPUTNICA PO PACIJENTU"}
        openPopup={true}
        setOpenPopup={handleClose}
        fullScreen={true}
        pretraga={true}
        //maxWidth={"none"}
      >
        {prRezModal && (
          <RezultatModal
            handleCloseRezultatModal={() => {
              setPrRezModal(false);
              setRezUputnice({});
            }}
            podaci={rezUputnice}
          />
        )}
        {inputForma}
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sr">
          <MaterialReactTable table={table} />
        </LocalizationProvider>
      </Popup>
    </Fragment>
  );
};

export default PretragaUputnica;
