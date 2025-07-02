import {
  Fragment,
  useEffect,
  useState,
  useRef,
  /* useCallback, */ useMemo,
} from "react";
import { useStore } from "../../../store";
import { pripremaPodaci } from "../../util/utility";
import useSlanjeBionet from "../../util/useSlanjeBionet";
import { usePretragaUnos } from "../../util/usePretragaUnos";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Popup from "../../UI/Forms/Popup";
import {
  useMaterialReactTable,
  MaterialReactTable,
  //getMRT_RowSelectionHandler,
  MRT_ToolbarAlertBanner,
} from "material-react-table";
import {
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import RefreshTwoToneIcon from "@mui/icons-material/RefreshTwoTone";
import "./ListaBolnickih.css";
import { bcolumns } from "./setupBolnickih";
import { bolnickaUputnicaTransformer } from "../../util/transformer";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CircularProgress from "@mui/material/CircularProgress";
import randn from "randn";
import dayjs from "dayjs";
import "dayjs/locale/sr";

const ListaBolnickih = ({
  closeListaBolnickih,
  izmjenaStatusa,
  pretrageSve,
  notifikacija,
  updateQuerie,
}) => {
  //const korisnik = useStore((store) => store.korisnik);
  const sesijaPodaci = useStore((store) => store.sesijaPodaci);
  const [biraniDatum, setBiraniDatum] = useState(new Date());
  const [bolnickeData, setBolnickeData] = useState([]);
  const [izabranaUputnica, setIzabranaUputnica] = useState([]);
  const [povuceneBolnicke, setPovuceneBolnicke] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPreuzmi, setLoadingPreuzmi] = useState(false);
  const [loadingPosalji, setLoadingPosalji] = useState(false);
  const [ukupnaBCijena, setUkupnaBCijena] = useState(0);
  const [ukupnoBFond, setUkupnoBFond] = useState(0);
  const { slanjeBionet } = useSlanjeBionet();
  const { pretragaUnos } = usePretragaUnos();

  const queryClient = useQueryClient();
  const isProcessing = useRef(false);

  const bolnickeParams = {
    datumOd: dayjs(biraniDatum).format("DD.MM.YYYY 00:00:00"),
    datumDo: dayjs(biraniDatum).format("DD.MM.YYYY 23:59:59"),
  };

  const {
    data: bolnicke_uputnice_data,
    isError: bolnickeIsError,
    isPending: ucitavanje_bolnickih,
    error: bolnickeError,
  } = useQuery({
    queryKey: ["bolnicke_uputnice", bolnickeParams],
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `../rpc/laboratorija.cfc?method=bolnicke_uputnice&uputnice_od=${bolnickeParams.datumOd}&uputnice_do=${bolnickeParams.datumDo}`,
        { method: "GET", signal: signal }
      );
      return response.json();
    },
    refetchOnWindowFocus: true,
    refetchInterval: 180000, // 3 min u milisekundama
  });

  useEffect(() => {
    if (bolnickeIsError) {
      notifikacija(true, bolnickeError.message);
    }
    if (bolnicke_uputnice_data !== undefined) {
      bolnickaUputnicaTransformer(
        bolnicke_uputnice_data.lista_bolnickih_uputnica,
        setBolnickeData
      );
    } // eslint-disable-next-line
  }, [bolnicke_uputnice_data]);

  useEffect(() => {
    if (povuceneBolnicke.length === 0) return;
    let filtriraneBolnicke = bolnickeData.filter(
      (uputnica) => !povuceneBolnicke.includes(uputnica.id)
    );
    setBolnickeData(filtriraneBolnicke);
    setIzabranaUputnica([]);
    setRowSelection({}); //eslint-disable-next-line
  }, [povuceneBolnicke]);

  useEffect(() => {
    setIsLoading(ucitavanje_bolnickih);
  }, [ucitavanje_bolnickih]);

  console.log("izabranaUputnica bolnicke", izabranaUputnica);
  //console.log("isLoading", isLoading);
  const CustomActionBar = (props) => {
    return (
      <div className={`${props.className} calendar_action`}>
        <Button onClick={props.onSetToday}>
          {dayjs(new Date()).format("DD.MM.YYYY")}
        </Button>
      </div>
    );
  };

  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      fontSize: "1em",
    },
  });

  const columns = useMemo(() => bcolumns, []);

  const prenesiUputnicu = async (uputnica, klijent_token) => {
    //console.log("klijent_token u prenesiUputnicu", klijent_token);
    const newData = new URLSearchParams();
    newData.append("id_pacijenta", uputnica.id_pacijenta);
    newData.append("id_epizode", uputnica.id_epizode);
    newData.append("vrsta", uputnica.epizoda_vrsta_id);
    newData.append("prioritet", uputnica.prioritet ?? 0);
    newData.append("broj_protokola", uputnica.broj_protokola);
    newData.append(
      "datum_uputnice",
      dayjs(uputnica.kreirano_datum).format("DD.MM.YYYY HH:mm:ss") ===
        "Invalid Date"
        ? ""
        : dayjs().format("DD.MM.YYYY HH:mm:ss")
    );
    newData.append(
      "datum_uzorak",
      dayjs(uputnica.datum_uzorak).format("DD.MM.YYYY HH:mm:ss") ===
        "Invalid Date"
        ? dayjs().format("DD.MM.YYYY HH:mm:ss")
        : dayjs(uputnica.datum_uzorak).format("DD.MM.YYYY HH:mm:ss")
    );
    newData.append("dijagnoza_sifra", uputnica.dijagnoza_sifra ?? "");
    newData.append("dijagnoza_opis", uputnica.dijagnoza_opis ?? "");
    newData.append("dijagnoza_id", uputnica.dijagnoza_id ?? "");
    newData.append("jmbg", uputnica.jmbg);
    newData.append("jmbg_majka", uputnica.jmbg_majka ?? "");
    newData.append("tezina", uputnica.tezina_pacijenta ?? "");
    newData.append("visina", uputnica.visina_pacijenta ?? "");
    newData.append("diureza", uputnica.diureza ?? "");
    newData.append("prezime", uputnica.prezime);
    newData.append("ime", uputnica.ime);
    newData.append(
      "datum_rodjenja",
      dayjs(uputnica.datum_rodjenja).format("DD.MM.YYYY") === "Invalid Date"
        ? ""
        : dayjs(uputnica.datum_rodjenja).format("DD.MM.YYYY")
    );
    newData.append("pol", uputnica.pol);
    newData.append("skladiste_grupa", uputnica.skladiste_grupa);
    newData.append("skladiste", uputnica.skladiste);
    newData.append("uputio", uputnica.uputio);
    newData.append("vid_osiguranja", uputnica.vid_osiguranja);
    newData.append(
      "status_osiguranja",
      uputnica.status_osiguranja === "0" ? "" : uputnica.status_osiguranja
    );
    newData.append(
      "kategorija_osiguranja",
      uputnica.kategorija_osiguranja === "0"
        ? ""
        : uputnica.kategorija_osiguranja
    );
    newData.append(
      "naziv_kategorije_osig",
      uputnica.naziv_kategorije_osig === "0"
        ? ""
        : uputnica.naziv_kategorije_osig
    );
    newData.append("id_dokumenta", uputnica.id);
    newData.append("id_korisnika", uputnica.id_korisnika);
    newData.append("napomena", uputnica.napomena ?? "");
    newData.append("klijent_token", klijent_token);
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=prenos_uputnice2`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: newData,
      }
    );
    if (response.status === 200) {
      notifikacija(true, "Uputnica uspješno prenesena", "success", 2000);
    } else {
      notifikacija(
        true,
        "Uputnica nije prenesena, došlo je do greške",
        "error",
        3000
      );
      setLoadingPreuzmi(false);
      setLoadingPosalji(false);
    }
    return await response.json();
  };

  const zabiljeziPrenos = async (id, id_uputnice) => {
    const newData = new URLSearchParams();
    newData.append("id", id);
    newData.append("id_uputnice", id_uputnice);
    newData.append("korisnik", sesijaPodaci.id_korisnika);
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=zabiljezi_prenos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: newData,
      }
    );
    return await response.json();
  };

  /*   const pretragaPoUputnici = async (pretraga, id) => {
    const newData = new URLSearchParams();
    newData.append("id_uputnice", id);
    newData.append("pretraga_sifra", pretraga.pretraga_sif);
    newData.append("pretraga_code", pretraga.pretraga_code);
    newData.append("usluga_sifra", pretraga.usluga_sifra);
    newData.append("korisnik", sesijaPodaci.id_korisnika);
    newData.append("status", 0);
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

  useEffect(() => {
    if (Object.keys(rowSelection).length === 0 && izabranaUputnica.length === 0)
      return;
    if (Object.keys(rowSelection).length > 0) setRowSelection({});
    if (izabranaUputnica.length > 0) setIzabranaUputnica([]);
    // eslint-disable-next-line
  }, [biraniDatum]);

  const handleDateChange = (date) => {
    setBiraniDatum(date.$d);
  };

  /* function debounce(func, timeout) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  } */

  useEffect(() => {
    if (izabranaUputnica.length === 0) return;
    if (izabranaUputnica[0].pretrage.length > 0) {
      let odabranePretrage = izabranaUputnica[0].pretrage;
      console.log("odabranePretrage u bolnickoj uputnici", odabranePretrage);
      let izabranePretrage = pretrageSve.filter((u) => {
        return odabranePretrage.some((e) => e.lab_sifra === u.labmedic_sifra);
      }); // U OVOM FILTERU JE PROBLEM
      console.log("izabranePretrage u bolnickoj uputnici", izabranePretrage);
      let ukupna_participacija = izabranePretrage
        .reduce(function (a, c) {
          return a + Number(c.fond_participacija);
        }, 0)
        .toFixed(2);
      let ukupno_fond = izabranePretrage
        .reduce(function (a, c) {
          return a + Number(c.fond_cijena);
        }, 0)
        .toFixed(2);
      console.warn(
        "ukupno_fond",
        ukupno_fond,
        "ukupna_participacija",
        ukupna_participacija
      );
      //PODRAZUMJEVANO SU BOLNIČKE VRSTA 2 ILI 3
      if (izabranaUputnica[0].status_osiguranja === "0") {
        let ukupna_mpc_cijena = izabranePretrage
          .reduce(function (a, c) {
            return a + Number(c.mpc_cijena); //KOD BOLNICKIH NAPLACUJEM PO KOMERCIJANIM AKO JE NEOSIGURAN
          }, 0)
          .toFixed(2);
        setUkupnaBCijena(ukupna_mpc_cijena);
        setUkupnoBFond(0);
      } else if (izabranaUputnica[0].status_osiguranja === "1") {
        if (izabranaUputnica[0].vid_osiguranja === 6 /*OZ*/) {
          setUkupnoBFond(Number(ukupno_fond) - Number(ukupna_participacija));
          setUkupnaBCijena(ukupna_participacija);
        }
        if (
          izabranaUputnica[0].vid_osiguranja === 1 /*OB*/ ||
          izabranaUputnica[0].vid_osiguranja === 0
        ) {
          setUkupnoBFond(ukupno_fond);
          setUkupnaBCijena(0);
        }
      } else {
        setUkupnaBCijena(0);
        setUkupnoBFond(0);
      }
    }
  }, [pretrageSve, izabranaUputnica]);

  const handleOsvjeziBolnicke = () => {
    setIsLoading(true);
    queryClient
      .invalidateQueries({ queryKey: ["bolnicke_uputnice"] })
      .then(() => {
        setIsLoading(false);
      });
  };

  const provjeraPreuzimanja = async (id) => {
    const newData = new URLSearchParams();
    newData.append("id_dokumenta", id);
    const response = await fetch(
      "../rpc/laboratorija.cfc?method=provjera_preuzimanja",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: newData,
      }
    );
    return await response.json();
  };

  const preuzmi = async () => {
    setLoadingPreuzmi(true);
    if (izabranaUputnica[0].diureza !== null) {
      let diureza = izabranaUputnica[0].diureza.replace(/[^0-9.]/g, "");
      izabranaUputnica[0].diureza = diureza;
    }
    if (izabranaUputnica[0].tezina_pacijenta !== null) {
      let tezina = izabranaUputnica[0].tezina_pacijenta.replace(
        /[^0-9.]*/g,
        ""
      );
      izabranaUputnica[0].tezina_pacijenta = tezina;
    }
    if (izabranaUputnica[0].visina_pacijenta !== null) {
      let visina = izabranaUputnica[0].visina_pacijenta.replace(
        /[^0-9.]*/g,
        ""
      );
      izabranaUputnica[0].visina_pacijenta = visina;
    }
    const token = randn(18);
    const r = await prenesiUputnicu(izabranaUputnica[0], token);
    if (r.poruka === 0) {
      let promises = [];
      izabranaUputnica[0].pretrage.map((p) => {
        let promise = pretragaUnos(
          r.id,
          p,
          p.sifra_usluge,
          sesijaPodaci.id_korisnika
        );
        promises.push(promise);
      });
      await Promise.all(promises);
      updateQuerie(r.id);
      setPovuceneBolnicke([...povuceneBolnicke, izabranaUputnica[0].id]);
      await zabiljeziPrenos(izabranaUputnica[0].id, r.id);
    }
    setLoadingPreuzmi(false);
  };

  const posalji = async () => {
    setLoadingPosalji(true);
    if (izabranaUputnica[0].diureza !== null) {
      let diureza = izabranaUputnica[0].diureza.replace(/[^0-9.]*/g, "");
      izabranaUputnica[0].diureza = diureza;
    }
    if (izabranaUputnica[0].tezina_pacijenta !== null) {
      let tezina = izabranaUputnica[0].tezina_pacijenta.replace(
        /[^0-9.]*/g,
        ""
      );
      izabranaUputnica[0].tezina_pacijenta = tezina;
    }
    if (izabranaUputnica[0].visina_pacijenta !== null) {
      let visina = izabranaUputnica[0].visina_pacijenta.replace(
        /[^0-9.]*/g,
        ""
      );
      izabranaUputnica[0].visina_pacijenta = visina;
    }
    let token = randn(18);
    const r = await prenesiUputnicu(izabranaUputnica[0], token);
    if (r.poruka === 0) {
      const promises = izabranaUputnica[0].pretrage.map(async (p) => {
        await pretragaUnos(r.id, p, p.sifra_usluge, sesijaPodaci.id_korisnika);
      });
      await Promise.all(promises);
      setPovuceneBolnicke([...povuceneBolnicke, izabranaUputnica[0].id]);
      await zabiljeziPrenos(izabranaUputnica[0].id, r.id);
      //let podaci = pripremljeniPodaci(r.id);
      let podaci = pripremaPodaci(
        izabranaUputnica[0].pretrage,
        izabranaUputnica[0],
        r.id,
        sesijaPodaci.ime_korisnika,
        sesijaPodaci.id_korisnika
      );
      slanjeBionet(podaci).then((res) => {
        console.error(
          "PODACI DIREKTNO BOLNIČKA U SLANJU LISTA BOLNICKIH",
          podaci,
          "r.id",
          r.id,
          ukupnaBCijena,
          ukupnoBFond
        );
        if (res.ok) {
          izmjenaStatusa(r.id, 1, "", ukupnaBCijena, ukupnoBFond, false, true);
        }
        if (!res.ok) {
          notifikacija(
            false,
            "Slanje nije uspjelo, došlo je do greške!",
            "error",
            3500
          );
        }
      });
    }
    setLoadingPosalji(false);
  };

  const handlePreuzmi = (type) => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    provjeraPreuzimanja(izabranaUputnica[0].id).then((res) => {
      if (res.poruka === 0) {
        if (type === "preuzimanje") {
          preuzmi().finally(() => {
            isProcessing.current = false;
          });
        } else if (type === "slanje") {
          posalji().finally(() => {
            isProcessing.current = false;
          });
        }
      } else {
        notifikacija(
          true,
          "UPUTNICA JE VEĆ PREUZETA OD STRANE DRUGOG LABORANTA!",
          "warning",
          3500
        );
      }
    });
  };

  //const maxdate = dayjs();
  //const mindate = dayjs().subtract(3, "day"); //3 DANA PRIJE DANAŠNJEG DATUMA ZA BOLNIČKE

  const izborDatuma = (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sr">
      <DatePicker
        label="Datum:"
        value={dayjs(biraniDatum)}
        //maxDate={maxdate}
        //minDate={mindate}
        views={["year", "month", "day"]}
        //onChange={debounce(handleDateChange, 2000)} //AKO SE ŽELI UKUCAVANJE DATUMA DA RADI
        onAccept={handleDateChange}
        slots={{
          actionBar: CustomActionBar,
        }}
        slotProps={{
          textField: {
            sx: {
              "& .MuiInputBase-input": {
                fontSize:
                  "clamp(0.875rem,-0.5789rem + 1.3158vw,1rem) !important",
              },
              marginTop: "0.25em !important",
            },
          },
        }}
      />
    </LocalizationProvider>
  );

  const table = useMaterialReactTable({
    data: bolnickeData,
    columns,
    enableStickyHeader: true,
    enableRowVirtualization: true,
    enablePagination: false,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSelectAll: false,
    positionToolbarAlertBanner: "none",
    //getRowId: (row) => row["id"],
    initialState: {
      showGlobalFilter: true,
      density: "compact",
      showColumnFilters: false,
      sorting: [{ id: "kreirano_datum", desc: true }], //def sort po ovoj koloni opadajući
    },
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      showSkeletons: isLoading,
    },
    muiTableContainerProps: { sx: { height: "42vh" } }, // maxHeight: "46vh"
    muiTableHeadCellProps: {
      sx: {
        borderRight: "1px solid rgb(170, 170, 170)",
        fontFamily: "Inter",
        fontSize: "0.85em",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        borderRight: "1px solid rgb(170, 170, 170)",
        fontFamily: "Inter",
        fontSize: "0.85em",
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
        <Button
          color="primary"
          size="medium"
          disabled={loadingPreuzmi || Object.keys(rowSelection).length === 0}
          onClick={() => handlePreuzmi("preuzimanje")} // NOTIFIKACIJA JE U FETCH-u
          variant="contained"
          sx={{ width: "180px", fontFamily: "Inter" }}
        >
          {loadingPreuzmi ? (
            <CircularProgress size="22px" />
          ) : (
            "Preuzmi uputnicu"
          )}
        </Button>
        <Button
          color="success"
          size="medium"
          disabled={loadingPosalji || Object.keys(rowSelection).length === 0}
          onClick={() => handlePreuzmi("slanje")} // NOTIFIKACIJA JE U FETCH-u
          variant="contained"
          sx={{ width: "180px", fontFamily: "Inter" }}
        >
          {loadingPosalji ? (
            <CircularProgress size="22px" color="success" />
          ) : (
            "Preuzmi i pošalji"
          )}
        </Button>
        <CustomTooltip arrow title={"Osvježi podatke bolničkih uputnica!"}>
          <IconButton
            onClick={() => handleOsvjeziBolnicke()}
            disabled={isLoading}
          >
            <RefreshTwoToneIcon
              fontSize={"large"}
              sx={{
                color: isLoading ? "#737373" : "#ab003c",
                cursor: isLoading ? "wait" : "pointer",
                filter: "drop-shadow(5px 5px 5px rgba(0,0,0,0.3))",
                "&:hover": {
                  color: isLoading ? "#737373" : "#ff285f",
                },
              }}
            />
          </IconButton>
        </CustomTooltip>
        <MRT_ToolbarAlertBanner table={table} />
      </Box>
    ),
    muiTableBodyRowProps: ({ row /* staticRowIndex, table  */ }) => ({
      onClick: (/* event */) => {
        //getMRT_RowSelectionHandler({ row, staticRowIndex, table })(event);
        setRowSelection({
          [row.id]: true,
        });
        setIzabranaUputnica([row.original]);
      },
      selected: rowSelection[row.id],
      sx: { cursor: "pointer" },
    }),
    /* renderBottomToolbarCustomActions: () => (
      <Typography>Broj uputnica: {bolnickeData.length}</Typography>
    ), */
    renderBottomToolbar: () => (
      <Box
        sx={{
          p: "0.25em 1em",
          backgroundColor: "rgb(229, 246, 253)",
        }}
      >
        <Typography sx={{ fontSize: "1em !important" }}>
          Broj uputnica: {bolnickeData.length}
        </Typography>
      </Box>
    ),
    localization: {
      actions: "Opcije",
      and: "i",
      cancel: "Ponisti",
      changeFilterMode: "Promjeni mod filtriranja",
      changeSearchMode: "Promjeni mod pretrage",
      clearFilter: "Ponisti filtere",
      clearSearch: "Poništi pretragu",
      clearSort: "Poništi sortiranja",
      clearSelection: "Poništi izbor",
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
      noRecordsToDisplay: "Nema podataka",
      noResultsFound: "Nisu pronađeni rezultati",
      of: "od",
      or: "ili",
      pinToLeft: "Zakači lijevo",
      pinToRight: "Zakači desno",
      resetColumnSize: "Resetuj veličinu kolone",
      resetOrder: "Resetuj redoslijed",
      rowActions: "Resetuj opcije",
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

  const lista = (
    <Fragment>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sr">
        <MaterialReactTable table={table} />
        <div className="donji_dio">
          {izabranaUputnica.length !== 0 && (
            <Fragment>
              <h4>
                {izabranaUputnica[0].jmbg} - {izabranaUputnica[0].prezime}{" "}
                {izabranaUputnica[0].ime}
              </h4>
              <p>
                {izabranaUputnica[0].skladiste_grupa}-
                {izabranaUputnica[0].skladiste_grupa_naz}{" "}
                {izabranaUputnica[0].skladiste}-
                {izabranaUputnica[0].skladiste_naz}
              </p>
              <table>
                <tr>
                  <th>Šifra</th>
                  <th>Pretraga Code</th>
                  <th>Naziv pretrage</th>
                </tr>
                {izabranaUputnica[0].pretrage.map((pretraga) => (
                  <tr>
                    <td>{pretraga.lab_sifra}</td>
                    <td>{pretraga.pretraga_code}</td>
                    <td>{pretraga.pretraga_naz}</td>
                  </tr>
                ))}
              </table>
            </Fragment>
          )}
        </div>
      </LocalizationProvider>
    </Fragment>
  );

  return (
    <Fragment>
      <Popup
        title={"LISTA BOLNIČKIH UPUTNICA"}
        izborDatuma={izborDatuma}
        openPopup={true}
        setOpenPopup={closeListaBolnickih}
        fullScreen={true}
        //maxWidth={"none"}
      >
        {lista}
      </Popup>
    </Fragment>
  );
};

export default ListaBolnickih;
