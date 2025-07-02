import { Fragment, useState, useRef, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useStore } from "../../store.js";
import { mcolumns } from "./setup.js";
import { pripremaPodaci } from "../util/utility.js";
import useSlanjeBionet from "../util/useSlanjeBionet";
import { usePretragaUnos } from "../util/usePretragaUnos";
import StornoModal from "../Modals/StornoModal.jsx";
import ConfirmModal from "../Modals/ConfirmModal.jsx";
import RezultatModal from "../Modals/Rezultati/RezultatModal.jsx";
import Menu from "../UI/Controls/Menu.jsx";
import { styled } from "@mui/material/styles";
import "./ListaUputnice.css";
import {
  IconButton,
  Tooltip,
  Button,
  //Box,
  tooltipClasses,
  MenuItem,
} from "@mui/material";
import SettingsBackupRestoreTwoToneIcon from "@mui/icons-material/SettingsBackupRestoreTwoTone";
import ApprovalTwoToneIcon from "@mui/icons-material/ApprovalTwoTone";
import PaymentTwoToneIcon from "@mui/icons-material/PaymentTwoTone";
//import BrowserUpdatedTwoToneIcon from "@mui/icons-material/BrowserUpdatedTwoTone";
import RefreshTwoToneIcon from "@mui/icons-material/RefreshTwoTone";
import ChecklistRtlTwoToneIcon from "@mui/icons-material/ChecklistRtlTwoTone";
import Controls from "../UI/Controls/Controls.jsx";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/sr";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const ListaUputnica = ({
  uputnice,
  //setPodaciUputnice,
  //setPodaciZaOvjeru,
  otvoriPretrage,
  columnFilters,
  setColumnFilters,
  prikaziSveUputnice,
  setPrikaziSveUputnice,
  //korisnici,
  storniranjeUputnice,
  onOpenListaBolnickih,
  onOpenListaRezultata,
  onOpenListaElektronskih,
  onOpenNovaUputnica,
  onOpenPretragaUputnica,
  onOpenProvjeraCijene,
  onOsvjeziPodatke,
  imeKorisnika,
  //datumRange,
  naIzborDatuma,
  loading,
  setSorting,
  sorting,
  izmjenaStatusa,
  notifikacija,
}) => {
  //const store = useStore();
  const statusData = [],
    vrstaData = [],
    prioritetData = [];

  const sesijaPodaci = useStore((store) => store.sesijaPodaci);
  //const korisnik = useStore((store) => store.korisnik);
  const korisnik = sesijaPodaci.id_korisnika;
  const columnVisibility = useStore((store) => store.columnVisibility);
  const globalFilter = useStore((store) => store.globalFilter);
  const setPodaciUputnice = useStore((store) => store.setPodaciUputnice);
  const odabranePretrage = useStore((store) => store.odabranePretrage);
  const setOtvoriPrintOvjere = useStore((store) => store.setOtvoriPrintOvjere);
  const setOtvoriPrintUplatnice = useStore(
    (store) => store.setOtvoriPrintUplatnice
  );
  const setOpenLoader = useStore((store) => store.setOpenLoader);
  //const izbor = useStore((store) => store.izbor);
  const [potvrdiStorno, setPotvrdiStorno] = useState();
  const [data, setData] = useState([]);
  /* const odDat = useStore((store) => store.odDat);
  const setOdDat = useStore((store) => store.setOdDat);
  const doDat = useStore((store) => store.doDat);
  const setDoDat = useStore((store) => store.setDoDat); */
  const datum = useStore((store) => store.datum);
  const setDatum = useStore((store) => store.setDatum);
  const [bolnickiNaloziKorisnika, setBolnickiNaloziKorisnika] = useState([]);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  //const [openLoader, setOpenLoader] = useState(false);
  const [rezultatModal, setRezultatModal] = useState(false);
  const [rezultatUputnice, setRezultatUputnice] = useState({});
  const { slanjeBionet } = useSlanjeBionet();
  const { pretragaUnos } = usePretragaUnos();
  const queryClient = useQueryClient();
  //const [prikaziMeni, setPrikaziMeni] = useState(false);

  //const odDatuma = useRef();
  //const doDatuma = useRef();
  const isSlanjeBolnickih = useRef(false);

  const povuciRezultat = async (id) => {
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=rezultat&id=${id}`,
      { method: "get" }
    );
    return await response.json();
  };

  //console.log("uputnice", uputnice);
  //console.log("DATUMI od", odDat, "DATUMI do", doDat);
  useEffect(() => {
    /* const izmUputnice = [];
    for (const uputnica of uputnice) {
      const uputnicaData = { ...uputnica };
      let k = korisnici.filter(
        (korisnik) => korisnik.id === uputnica.kreirano_korisnik
      );
      //uputnicaData.korisnik_ime = `${k[0].ime} ${k[0].prezime}`;
      izmUputnice.push(uputnicaData);
    }
    setData(izmUputnice); */
    if (
      !sesijaPodaci.lab_privilegije.includes(2) &&
      !sesijaPodaci.grupa_korisnika.includes("1")
    ) {
      return;
    } else {
      setData(uputnice);
      let bolnickeKorisnika = uputnice.filter(
        (uputnica) =>
          //uputnica.kreirano_korisnik === korisnik &&
          uputnica.status === 0 &&
          (uputnica.vrsta === 2 || uputnica.vrsta === 3) &&
          !dayjs(uputnica.kreirano_datum).isBefore(dayjs().subtract(2, "hour")) //provjera da li je starije od dva sata
      );
      setBolnickiNaloziKorisnika(bolnickeKorisnika); //neposlane bolničke
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uputnice /* korisnici */]);

  const CustomActionBar = (props) => {
    return (
      <div className={`${props.className} calendar_action`}>
        <Button onClick={props.onSetToday}>
          {dayjs(new Date()).format("DD.MM.YYYY")}
        </Button>
        <Button onClick={props.onAccept}>OK.</Button>
      </div>
    );
  };

  const odaberiUputnicu = (uputnica) => {
    setPodaciUputnice(uputnica);
    otvoriPretrage();
  };

  const columns = useMemo(() => mcolumns, []);

  //POSTAVKE FILTERA PO OVIM KOLONAMA
  for (const uputnica of data) {
    if (statusData.indexOf(uputnica.naziv_statusa) === -1)
      statusData.push(uputnica.naziv_statusa);
    if (vrstaData.indexOf(uputnica.vrsta_naziv) === -1)
      vrstaData.push(uputnica.vrsta_naziv);
    if (prioritetData.indexOf(uputnica.prioritet_naziv) === -1)
      prioritetData.push(uputnica.prioritet_naziv);
  }

  columns[6] = {
    ...columns[6],
    filterSelectOptions: statusData,
  };

  columns[7] = {
    ...columns[7],
    filterSelectOptions: vrstaData,
  };

  columns[8] = {
    ...columns[8],
    filterSelectOptions: prioritetData,
  };

  const postaviFilter = (naziv) => {
    const filterMap = {
      naziv_statusa: statusData,
      vrsta_naziv: vrstaData,
      prioritet_naziv: prioritetData,
    };

    const filterData = filterMap[naziv];

    const currentStatusFilterIndex = columnFilters.findIndex(
      (filter) => filter.id === naziv
    );

    if (currentStatusFilterIndex === -1)
      columnFilters.push({ id: naziv, value: filterData[0] });
    else {
      const currentStatusIndex = filterData.indexOf(
        columnFilters[currentStatusFilterIndex].value
      );
      const nextStatusIndex = (currentStatusIndex + 1) % filterData.length;
      columnFilters[currentStatusFilterIndex].value =
        filterData[nextStatusIndex];
    }

    setColumnFilters([...columnFilters]);
  };

  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      fontSize: "1em",
    },
  });
  /*   console.log(
    "pretvaranje datuma",
    dayjs(new Date("2024-10-23 11:45:04")).format("YYYYMMDDHHmmss")
  ); */

  /*  const pretragaUnos = async (pretraga, id_uputnice) => {
    const newData = new URLSearchParams();
    newData.append("id_uputnice", id_uputnice);
    newData.append("pretraga_sifra", pretraga.lab_sifra);
    newData.append("pretraga_code", pretraga.pretraga_code);
    newData.append("usluga_sifra", pretraga.sifra_usluge);
    newData.append("korisnik", korisnik);
    newData.append("status", 1);
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=unos_pretraga_uputnice`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: newData,
      }
    );
    return await response.json();
  }; */

  const showConfirmModal = () => {
    setOpenConfirmModal(!openConfirmModal);
  };

  const handleInputChange = (e) => {
    if (e.target.value === "1") {
      queryClient.invalidateQueries({ queryKey: ["uputnice"] });
    }
    setPrikaziSveUputnice(+e.target.value);
    const jesteFiltriranIndex = columnFilters.findIndex(
      (filter) => filter.id === "kreirano_korisnik"
    );
    if (jesteFiltriranIndex !== -1)
      columnFilters.splice(jesteFiltriranIndex, 1);
    else columnFilters.push({ id: "kreirano_korisnik", value: `${korisnik}` });
    setColumnFilters([...columnFilters]);
  };

  const ocistiFiltere = () => {
    setColumnFilters([
      ...columnFilters.filter((filter) => filter.id === "kreirano_korisnik"),
    ]);
  };

  const posaljiBolnicke = async () => {
    if (isSlanjeBolnickih.current) return;
    isSlanjeBolnickih.current = true;
    setOpenLoader(true);

    try {
      for (const uputnica of bolnickiNaloziKorisnika) {
        const izabraniNalog = odabranePretrage.find(
          (nalog) => nalog.id === uputnica.id
        );

        let ukupna_cijena = 0;
        let ukupno_fond = 0;

        // Izračunavanje cijena
        if (
          uputnica.komerc_placanje === 0 &&
          uputnica.status_osiguranja === 1 &&
          uputnica.po_ugovoru === 0
        ) {
          ukupna_cijena = (izabraniNalog?.pretrage || uputnica.pretrage)
            .reduce((a, c) => a + Number(c.fond_participacija), 0)
            .toFixed(2);

          ukupno_fond = (izabraniNalog?.pretrage || uputnica.pretrage)
            .reduce((a, c) => a + Number(c.fond_cijena), 0)
            .toFixed(2);

          if (uputnica.vid_osiguranja === 6) {
            ukupno_fond = (Number(ukupno_fond) - Number(ukupna_cijena)).toFixed(
              2
            );
          }
          if (uputnica.vid_osiguranja === 1 || uputnica.vid_osiguranja === 0) {
            ukupna_cijena = 0;
          }
        } else if (uputnica.po_ugovoru === 1) {
          ukupna_cijena = 0;
          ukupno_fond = 0;
        } else {
          ukupna_cijena = (izabraniNalog?.pretrage || uputnica.pretrage)
            .reduce((a, c) => a + Number(c.mpc_cijena), 0) //KOD BOLNICKIH NAPLACUJEM PO KOMERCIJANIM AKO JE NEOSIGURAN
            .toFixed(2);
          ukupno_fond = 0;
        }

        const pretrage = izabraniNalog?.pretrage || uputnica.pretrage;
        const podaci = pripremaPodaci(pretrage, uputnica);

        try {
          // Unos pretraga ako postoji izabrani nalog
          if (izabraniNalog) {
            await Promise.all(
              pretrage.map((pretraga) =>
                pretragaUnos(
                  izabraniNalog.id,
                  pretraga,
                  pretraga.sifra_usluge,
                  korisnik
                )
              )
            );
          }

          // Slanje podataka putem slanjeBionet
          const res = await slanjeBionet(podaci);
          if (res.ok) {
            await izmjenaStatusa(
              uputnica.id,
              1,
              "",
              ukupna_cijena,
              ukupno_fond,
              true,
              false
            );
          } else {
            throw new Error(
              `Slanje uputnice ${uputnica.id} nije uspjelo, došlo je do greške!`
            );
          }
        } catch (error) {
          console.error(
            `Greška prilikom obrade-slanja uputnice ${uputnica.id}:`,
            error
          );
          notifikacija(
            true,
            `Greška prilikom obrade-slanja uputnice ${uputnica.id}: ${error.message}`,
            "error",
            3000
          );
        }
      }

      // Nakon što su sve uputnice obrađene
      queryClient.invalidateQueries({ queryKey: ["uputnice"] });
      notifikacija(
        true,
        "Slanje bolničkih uputnica završeno!",
        "success",
        3500
      );
    } catch (error) {
      console.error("Greška prilikom slanja bolničkih uputnica:", error);
      notifikacija(
        true,
        `Greška prilikom slanja bolničkih uputnica: ${error.message}`,
        "error",
        3000
      );
    } finally {
      isSlanjeBolnickih.current = false;
      setOpenLoader(false);
    }
  };

  /* const povuciPodatkeOvjere = async (id) => {
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=ovjera&id_epizode=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return await response.json();
  }; */

  /* const ovjeriUputnicu = (uputnica) => {
    povuciPodatkeOvjere(uputnica.id_epizode).then((r) => {
      const podaci = {
        ...uputnica,
        ...r.podaci[0],
      };
      //console.log("podaci za ovjeru", podaci);
      setPodaciZaOvjeru(podaci);
    });
    //setPodaciZaOvjeru(uputnica);
  }; */

  const handleRezultat = (id) => {
    povuciRezultat(id).then((r) => {
      setRezultatUputnice(r.rezultat);
      setRezultatModal(true);
    });
  };

  const handleOsvjeziPodatke = () => {
    if (dayjs(datum, "DD.MM.YYYY").isSame(dayjs().startOf("day"))) {
      queryClient.invalidateQueries({ queryKey: ["uputnice"] });
    } else {
      setDatum(dayjs(new Date()).format("DD.MM.YYYY"));
      onOsvjeziPodatke();
    }
    /*    if (
      dayjs(odDat, "DD.MM.YYYY").isSame(dayjs(doDat, "DD.MM.YYYY")) &&
      dayjs(odDat, "DD.MM.YYYY").isSame(dayjs().startOf("day")) &&
      dayjs(doDat, "DD.MM.YYYY").isSame(dayjs().startOf("day"))
    ) {
      queryClient.invalidateQueries({ queryKey: ["uputnice"] });
    } else {
      setOdDat(dayjs(new Date()).format("DD.MM.YYYY"));
      setDoDat(dayjs(new Date()).format("DD.MM.YYYY"));
      onOsvjeziPodatke();
    } */
  };
  // NIJE DIRANO DA SE NE MJENJA I BACKEND TE DOĐE DO PROBLEMA SA DATUMOM
  const handleDatum = (date) => {
    setDatum(dayjs(date).format("DD.MM.YYYY"));
    naIzborDatuma(
      dayjs(date).format("DD.MM.YYYY"),
      dayjs(date).format("DD.MM.YYYY")
    );
  };

  const table = useMaterialReactTable({
    columns,
    data,
    columnFilterDisplayMode: "popover",
    enableGrouping: true,
    enableColumnDragging: false,
    enableStickyHeader: true,
    enableRowVirtualization: true,
    enableColumnActions: true, // meni za kolonu (tri tacke kod naziva kolone)
    enableRowActions: true,
    positionActionsColumn: "first",
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    enableFullScreenToggle: false,
    //enableColumnFilterModes={true}
    //sortDescFirst={true}
    state: {
      columnFilters,
      showSkeletons: loading,
      columnVisibility: columnVisibility,
      globalFilter: globalFilter,
      sorting, //kontrolisano sortiranje
    },
    initialState: {
      pagination: { pageSize: 100, pageIndex: 0 },
      showColumnFilters: true,
      showGlobalFilter: true,
      density: "compact",
      //sorting: [{ id: "id", desc: true }], def sort po ovoj koloni opadajući
      /* columnVisibility: {kreirano_korisnik:false},*/
    },
    onColumnVisibilityChange: () =>
      useStore.setState({
        columnVisibility: {
          kreirano_korisnik: !columnVisibility.kreirano_korisnik,
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
      sx: { minHeight: "clamp(350px, -126px + 100vh, 9999px)" },
    },
    renderRowActionMenuItems: ({ closeMenu, row, table }) => [
      <>
        <p style={{ marginBlock: "0", marginInline: "0.5em" }}>
          {row.original.prezime + " " + row.original.ime}
        </p>
        <MenuItem
          onClick={(event) => {
            setPotvrdiStorno(row.original.id);
            event.stopPropagation();
            closeMenu();
          }}
          disabled={
            korisnik !== row.original.kreirano_korisnik ||
            row.original.status >= 2
          }
          table={table}
        >
          <SettingsBackupRestoreTwoToneIcon
            sx={(theme) => ({
              color:
                row.original.status !== 0 && row.original.status !== 1
                  ? theme.palette.grey["400"]
                  : theme.palette.error.dark,
            })}
          />
          <p style={{ margin: "0.25em" }}>Storniraj</p>
        </MenuItem>
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
      onClick: () => {
        row.original.status !== 2 ? odaberiUputnicu(row.original) : null;
        //console.log("birana uputnica", row.original);
      },
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
    renderTopToolbarCustomActions: () => {
      const aktivniFilteri = columnFilters.filter(
        (filter) => filter.id !== "kreirano_korisnik"
      );
      /* console.log(
        "vracanje stringa u dayjs objekt",
        dayjs(odDat, "DD.MM.YYYY")
      ); */
      const maxdate = dayjs();
      //const mindate = dayjs().subtract(7, "day");

      return (
        <div
          className="top_toolbar"
          /* style={{
            display: "flex",
            "& > *:nth-child(n+3)": {
              marginLeft: "1rem",
            },
          }} */
        >
          <Menu title={"UPUTNICE"} />
          <CustomTooltip arrow title={"Provjera pacijenta i unos uputnice"}>
            <Button
              variant="outlined"
              onClick={() => {
                onOpenNovaUputnica();
              }}
              sx={{
                fontSize:
                  "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem)" /* "0.75vw" */,
                fontFamily: "Inter",
                lineHeight: "normal",
                margin: "0",
                borderRadius: "0px",
                borderLeft: "none",
                borderTop: "none",
                borderBottom: "none",
                padding: "0.21vw 0.63vw",
                cursor: "pointer",
                backgroundColor: "#e2f1fc",
                color: "var(--color-labos-550)",
                "&:hover": {
                  backgroundColor: "var(--color-labos-500)",
                  color: "var(--color-labos-250)",
                },
              }}
            >
              NOVA
              <br />
              UPUTNICA
            </Button>
          </CustomTooltip>
          {(sesijaPodaci.lab_privilegije.includes(2) ||
            sesijaPodaci.grupa_korisnika.includes("1")) && (
            <CustomTooltip arrow title={"Preuzmi bolničke uputnice"}>
              <Button
                variant="outlined"
                sx={{
                  fontSize:
                    "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem)" /* "0.75vw" */,
                  fontFamily: "Inter",
                  lineHeight: "normal",
                  margin: "0",
                  borderRadius: "0",
                  borderLeft: "none",
                  borderTop: "none",
                  borderBottom: "none",
                  padding: "0.21vw 0.63vw",
                  cursor: "pointer",
                  backgroundColor: "#e2f1fc",
                  color: "var(--color-labos-550)",
                  "&:hover": {
                    backgroundColor: "var(--color-labos-550)",
                    color: "#80cdf9",
                  },
                }}
                onClick={() => onOpenListaBolnickih()}
              >
                BOLNIČKE
                <br />
                UPUTNICE
              </Button>
            </CustomTooltip>
          )}
          {(sesijaPodaci.lab_privilegije.includes(2) ||
            sesijaPodaci.grupa_korisnika.includes("1")) && (
            <CustomTooltip arrow title={"Rezultati lab. analiza"}>
              <Button
                variant="outlined"
                sx={{
                  fontSize:
                    "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem)" /* "0.75vw" */,
                  fontFamily: "Inter",
                  lineHeight: "normal",
                  margin: "0",
                  borderRadius: "0",
                  borderLeft: "none",
                  borderTop: "none",
                  borderBottom: "none",
                  padding: "0.21vw 0.63vw",
                  cursor: "pointer",
                  backgroundColor: "#e2f1fc",
                  color: "var(--color-labos-550)",
                  "&:hover": {
                    backgroundColor: "var(--color-labos-550)",
                    color: "var(--color-primary-150)",
                  },
                }}
                onClick={() => onOpenListaRezultata()}
              >
                REZULTATI
                <br />
                ANALIZA
              </Button>
            </CustomTooltip>
          )}
          {(sesijaPodaci.lab_privilegije.includes(2) ||
            sesijaPodaci.grupa_korisnika.includes("1")) && (
            <CustomTooltip arrow title={"Preuzmi Elektronsku uputnicu"}>
              <Button
                variant="outlined"
                sx={{
                  fontSize:
                    "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem)" /* "0.75vw" */,
                  fontFamily: "Inter",
                  lineHeight: "normal",
                  margin: "0",
                  borderRadius: "0",
                  borderLeft: "none",
                  borderTop: "none",
                  borderBottom: "none",
                  padding: "0.21vw 0.63vw",
                  cursor: "pointer",
                  backgroundColor: "#e2f1fc",
                  color: "var(--color-labos-550)",
                  "&:hover": {
                    backgroundColor: "var(--color-primary-600)",
                    color: "var(--color-error-180)",
                  },
                }}
                onClick={() => onOpenListaElektronskih()}
              >
                ELEKTRONSKE
                <br />
                UPUTNICE
              </Button>
            </CustomTooltip>
          )}
          {(sesijaPodaci.lab_privilegije.includes(2) ||
            sesijaPodaci.grupa_korisnika.includes("1")) && (
            <CustomTooltip
              arrow
              title={"Pretraga uputnica po JMBG, prezime i ime"}
            >
              <Button
                variant="outlined"
                sx={{
                  fontSize:
                    "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem)" /* "0.75vw" */,
                  fontFamily: "Inter",
                  lineHeight: "normal",
                  margin: "0",
                  borderRadius: "0",
                  borderLeft: "none",
                  borderTop: "none",
                  borderBottom: "none",
                  padding: "0.21vw 0.63vw",
                  cursor: "pointer",
                  backgroundColor: "#e2f1fc",
                  color: "var(--color-labos-550)",
                  "&:hover": {
                    backgroundColor: "var(--color-primary-950)",
                    color: "var(--color-error-500)",
                  },
                }}
                onClick={() => onOpenPretragaUputnica()}
              >
                PRETRAGA
                <br />
                UPUTNICA
              </Button>
            </CustomTooltip>
          )}
          {(sesijaPodaci.lab_privilegije.includes(2) ||
            sesijaPodaci.grupa_korisnika.includes("1")) && (
            <CustomTooltip arrow title={"Provjera cijene pretraga"}>
              <Button
                variant="outlined"
                sx={{
                  fontSize:
                    "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem)" /* "0.75vw" */,
                  fontFamily: "Inter",
                  lineHeight: "normal",
                  margin: "0",
                  borderRadius: "0",
                  borderLeft: "none",
                  borderTop: "none",
                  borderBottom: "none",
                  padding: "0.21vw 0.63vw",
                  cursor: "pointer",
                  backgroundColor: "#e2f1fc",
                  color: "var(--color-labos-550)",
                  "&:hover": {
                    backgroundColor: "#545454",
                    color: "#FFBA49",
                  },
                }}
                onClick={() => onOpenProvjeraCijene()}
              >
                PROVJERA
                <br />
                CIJENE
              </Button>
            </CustomTooltip>
          )}
          <CustomTooltip
            arrow
            title={"POŠALJI SVE NEPOSLANE BOLNIČKE UPUTNICE"}
          >
            <Button
              //variant="outlined"
              disabled={bolnickiNaloziKorisnika.length === 0}
              onClick={showConfirmModal}
              sx={{
                fontSize:
                  "clamp(0.75rem, -0.7039rem + 1.3158vw, 0.875rem)" /* "0.75vw" */ /*"14px"*/,
                fontFamily: "Inter",
                lineHeight: "normal",
                margin: "0",
                borderRadius: "0 0 5px 0",
                //borderLeft: "none",
                //borderTop: "none",
                //borderBottom: "none",
                padding: "0.21vw 0.63vw" /*"4px 12px"*/,
                cursor: "pointer",
                backgroundColor: "#e2f1fc",
                color: "var(--color-labos-550)",
                "&:hover": {
                  backgroundColor: "#951c45",
                  color: "#f7aab9",
                },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(0, 0, 0, 0.12)",
                  color: "rgba(0, 0, 0, 0.26)",
                },
              }}
            >
              ŠALJI SVE
              <br />
              BOLNIČKE
            </Button>
          </CustomTooltip>
          <CustomTooltip arrow title={"Filtriraj po statusu"}>
            <Button
              size="small"
              variant="outlined"
              sx={(theme) => ({
                fontFamily: "Inter",
                fontSize:
                  "clamp(0.6875rem, -0.7664rem + 1.3158vw, 0.8125rem)" /* "0.68vw" */ /*"0.8125rem"*/,
                lineHeight: "normal",
                marginBlock: "0.25em",
                padding: "0.21vw 0.42vw" /*"4px 8px"*/,
                cursor: "pointer",
                color: theme.palette.primary.dark,
              })}
              onClick={() => postaviFilter("naziv_statusa")}
            >
              FILTER
              <br />
              STATUS
            </Button>
          </CustomTooltip>
          <CustomTooltip arrow title={"Filtriraj po vrsti"}>
            <Button
              size="small"
              variant="outlined"
              sx={(theme) => ({
                fontFamily: "Inter",
                fontSize:
                  "clamp(0.6875rem, -0.7664rem + 1.3158vw, 0.8125rem)" /* "0.68vw" */,
                lineHeight: "normal",
                marginBlock: "0.25em",
                padding: "0.21vw 0.42vw",
                cursor: "pointer",
                color: theme.palette.primary.dark,
              })}
              onClick={() => postaviFilter("vrsta_naziv")}
            >
              FILTER
              <br />
              VRSTA
            </Button>
          </CustomTooltip>
          <CustomTooltip arrow title={"Filtriraj po prioritetu"}>
            <Button
              size="small"
              variant="outlined"
              sx={(theme) => ({
                fontFamily: "Inter",
                fontSize:
                  "clamp(0.6875rem, -0.7664rem + 1.3158vw, 0.8125rem)" /* "0.68vw" */,
                lineHeight: "normal",
                marginBlock: "0.25em",
                padding: "0.21vw 0.42vw",
                cursor: "pointer",
                color: theme.palette.primary.dark,
              })}
              onClick={() => postaviFilter("prioritet_naziv")}
            >
              FILTER
              <br />
              PRIORITET
            </Button>
          </CustomTooltip>
          <CustomTooltip arrow title={"Poništi sve filtere"}>
            <Button
              size="small"
              variant="outlined"
              disabled={aktivniFilteri.length === 0}
              sx={(theme) => ({
                fontFamily: "Inter",
                fontSize:
                  "clamp(0.6875rem, -0.7664rem + 1.3158vw, 0.8125rem)" /* "0.68vw" */,
                lineHeight: "normal",
                marginBlock: "0.25em",
                padding: "0.21vw 0.42vw",
                cursor: "pointer",
                borderColor: theme.palette.error.main,
                color: theme.palette.error.dark,
                "&:hover": {
                  borderColor: theme.palette.error.dark,
                },
              })}
              onClick={aktivniFilteri.length > 0 ? ocistiFiltere : () => {}}
            >
              PONIŠTI
              <br />
              FILTERE
            </Button>
          </CustomTooltip>
          <CustomTooltip arrow title={"Osvježi podatke na današnji datum"}>
            <IconButton onClick={handleOsvjeziPodatke}>
              <RefreshTwoToneIcon
                fontSize={"large"}
                sx={{
                  color: "#ab003c",
                  cursor: "pointer",
                  filter: "drop-shadow(5px 5px 5px rgba(0,0,0,0.3))",
                  "&:hover": {
                    color: "#ff285f",
                  },
                }}
              />
            </IconButton>
          </CustomTooltip>
          <div
            style={{
              display: "flex",
              gap: "0.25em",
              alignItems: "center",
              paddingTop: "0.5em",
            }}
          >
            <DatePicker
              //label="Od datuma"
              label="DATUM"
              format="DD.MM.YYYY"
              value={dayjs(datum, "DD.MM.YYYY")}
              views={["year", "month", "day"]}
              maxDate={maxdate}
              //minDate={mindate}
              sx={{ width: "150px" /* minWidth: "140px", maxWidth: "180px" */ }}
              size="medium"
              //inputRef={odDatuma}
              slots={{
                actionBar: CustomActionBar,
              }}
              onChange={(date) => handleDatum(date)}
              //onChange={(date) => setOdDat(dayjs(date).format("DD.MM.YYYY"))}
              /* slotProps={{
                actionBar: {
                  actions: ["today", "accept"],
                  localeText: {
                    todayButtonLabel: "Danas",
                  },
                  //onSetToday: () => {},
                }, 
              }}*/
              /* onChange={(newValue, context) => {
                      if (context.validationError == null) {
                        //setValue1(newValue);
                        filterDatuma(newValue, "od");
                      }
                    }} */
            />
            {/* <DatePicker
              label="Do datuma"
              format="DD.MM.YYYY"
              value={dayjs(doDat, "DD.MM.YYYY")}
              views={["year", "month", "day"]}
              sx={{ width: "150px"}}
              size="medium"
              maxDate={maxdate}
              minDate={mindate}
              inputRef={doDatuma}
              slots={{
                actionBar: CustomActionBar,
              }}
              onChange={(date) => setDoDat(dayjs(date).format("DD.MM.YYYY"))}
              // onChange={(newValue) =>
              //  useStore.setState({
              //    datumRange: {
              //      ...datumRange.datumOd,
              //      datumDo: dayjs(newValue).format("DD.MM.YYYY"),
              //    },
              //  })
              //} 
            /> */}
          </div>
          {/* <CustomTooltip
            arrow
            title={"POVUCI UPUTNICE ZA ODABRANI RASPON DATUMA"}
          >
            <IconButton
              onClick={() =>
                naIzborDatuma(odDatuma.current.value, doDatuma.current.value)
              }
              disabled={
                new Date(dayjs(odDat, "DD.MM.YYYY")).getTime() >
                new Date(dayjs(doDat, "DD.MM.YYYY")).getTime()
              }
            >
              <BrowserUpdatedTwoToneIcon
                fontSize={"large"}
                sx={{
                  color:
                    new Date(dayjs(odDat, "DD.MM.YYYY")).getTime() >
                    new Date(dayjs(doDat, "DD.MM.YYYY")).getTime()
                      ? "#737373"
                      : "#d8315b",
                  cursor:
                    new Date(dayjs(odDat, "DD.MM.YYYY")).getTime() >
                    new Date(dayjs(doDat, "DD.MM.YYYY")).getTime()
                      ? "wait"
                      : "pointer",
                  filter: "drop-shadow(5px 5px 5px rgba(0,0,0,0.3))",
                  marginTop: "0.15em",
                  "&:hover": {
                    color:
                      new Date(dayjs(odDat, "DD.MM.YYYY")).getTime() >
                      new Date(dayjs(doDat, "DD.MM.YYYY")).getTime()
                        ? "#737373"
                        : "#971a41",
                  },
                }}
              />
            </IconButton>
          </CustomTooltip> */}
        </div>
      );
    },
    renderBottomToolbarCustomActions: () => {
      return (
        <Controls.RadioGroup
          name="prikazi_sve_pacijente"
          value={prikaziSveUputnice}
          onChange={handleInputChange}
          items={[
            { id: 0, title: `${imeKorisnika}` },
            { id: 1, title: "Svi Pacijenti" },
          ]}
        />
      );
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
      {openConfirmModal && (
        <ConfirmModal
          onConfirm={() => posaljiBolnicke()}
          handleCloseConfirmModal={showConfirmModal}
          title={"Grupno slanje naloga/uputnice u LIS"}
          text={"Sigurni ste da želite poslati sve uputnice?"}
          yesBtn={"Šalji"}
          noBtn={"Odustani"}
        />
      )}
      {potvrdiStorno !== undefined && (
        <StornoModal
          onConfirm={(razlog_storno) =>
            storniranjeUputnice(potvrdiStorno, 2, razlog_storno)
          }
          handleCloseConfirmModal={() => setPotvrdiStorno(undefined)}
          text={"Da li ste sigurni da želite stornirati ovu uputnicu?"}
          title={"Storniranje uputnice"}
          yesBtn={"Storniraj"}
          noBtn={"Otkaži"}
        />
      )}
      {rezultatModal && (
        <RezultatModal
          handleCloseRezultatModal={() => {
            setRezultatModal(false);
            setRezultatUputnice({});
          }}
          podaci={rezultatUputnice}
        />
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sr">
        <MaterialReactTable table={table} />
      </LocalizationProvider>
    </Fragment>
  );
};

export default ListaUputnica;
