import { Fragment, useEffect, useState, useCallback, useMemo } from "react";
//import { useStore } from "../../../store";
import Popup from "../../UI/Forms/Popup";
import {
  useMaterialReactTable,
  MaterialReactTable,
  //getMRT_RowSelectionHandler,
  //MRT_ToolbarAlertBanner,
} from "material-react-table";
import { Typography, Box, Button } from "@mui/material";
import "./ListaRezultata.css";
import { rcolumns } from "./setupRezultata";
import { rezultatiTransformer } from "../../util/transformer";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/sr";

const ListaRezultata = ({ closeListaRezultata }) => {
  const [biraniDatum, setBiraniDatum] = useState(new Date());
  const [rezultatiData, setRezultatiData] = useState([]);
  const [izabraniRezultati, setIzabraniRezultati] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const povuciPodatke = useCallback(
    async (method, datumOd, datumDo, controller) => {
      const response = await fetch(
        `../rpc/laboratorija.cfc?method=${method}&datumOd=${datumOd}&datumDo=${datumDo}`,
        { method: "get", signal: controller.signal }
      );
      return await response.json();
    },
    []
  );
  //console.log("IZABRANI REZULTATI", izabraniRezultati);
  const CustomActionBar = (props) => {
    return (
      <div className={`${props.className} calendar_action`}>
        <Button onClick={props.onSetToday}>
          {dayjs(new Date()).format("DD.MM.YYYY")}
        </Button>
      </div>
    );
  };

  //console.log("rezultati", rezultatiData);
  const columns = useMemo(() => rcolumns, []);

  useEffect(() => {
    setIsLoading(true);
    const controller = new AbortController();
    povuciPodatke(
      "rezultati",
      //dayjs(biraniOdDatum).format("DD.MM.YYYY"),
      dayjs(biraniDatum).format("DD.MM.YYYY"),
      //dayjs(biraniDoDatum).format("DD.MM.YYYY"),
      dayjs(biraniDatum).format("DD.MM.YYYY"),
      controller
    )
      .then((r) => {
        /* let lista = [
          ...(r?.lista_bolnicke || []),
          ...(r?.lista_ambulantne || []),
        ]; UPISUJU SE GLAVNE TABELE NEMA RAZDVAJANJA PO VRSTI*/
        rezultatiTransformer(r.lista_rezultata, setRezultatiData);
      })
      .then(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => {
      controller.abort(); // Poništava fetch zahtjev kada se promijeni zavisnost
    };
  }, [/* biraniOdDatum, biraniDoDatum, */ biraniDatum, povuciPodatke]);

  const handleDateChange = (date /* , tip */) => {
    setBiraniDatum(date.$d);
    /* if (tip === "od") setBiraniOdDatum(date.$d);
    if (tip === "do") setBiraniDoDatum(date.$d); */
  };

  const izborDatuma = (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sr">
      <DatePicker
        label="Na datum:"
        value={dayjs(biraniDatum /* biraniOdDatum */)}
        views={["year", "month", "day"]}
        //onChange={debounce(handleDateChange, 2000)} //AKO SE ŽELI UKUCAVANJE DATUMA DA RADI
        onAccept={
          (date) => handleDateChange(date) /* handleDateChange(date, "od") */
        }
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
      {/* <DatePicker
        label="Datum do:"
        value={dayjs(biraniDoDatum)}
        views={["year", "month", "day"]}
        onAccept={(date) => handleDateChange(date, "do")}
        sx={{
          ml: "0.5em",
        }}
        slots={{
          actionBar: CustomActionBar,
        }}
      /> */}
    </LocalizationProvider>
  );

  const table = useMaterialReactTable({
    data: rezultatiData,
    columns,
    enableStickyHeader: true,
    enableRowVirtualization: true,
    enablePagination: false,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSelectAll: false,
    positionToolbarAlertBanner: "none",
    //getRowId: (row) => row["id"],
    enableExpanding: false,
    enableExpandAll: false, //disable expand all button
    muiDetailPanelProps: () => ({
      sx: () => ({
        maxWidth: "25px",
      }),
    }),
    //custom expand button rotation
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
      sx: {
        transform: row.getIsExpanded() ? "rotate(180deg)" : "rotate(-90deg)",
        transition: "transform 0.2s",
      },
    }),
    //conditionally render detail panel
    /*   renderDetailPanel: ({ row }) =>
      // UKOLIKO SE ŽELEPRETRAGE  U EXPAND DIJELU
      row.original.pretrage && row.original.pretrage.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            marginLeft: "1.5em",
            gridTemplaterRows: "1fr",
            width: "100%",
          }}
        >
          <div className="rez_table">
            <Typography fontSize={"inherit"} fontFamily={"Inter"}>
              Šifra pretrage
            </Typography>
            <Typography fontSize={"inherit"} fontFamily={"Inter"}>
              Pretraga code
            </Typography>
            <Typography fontSize={"inherit"} fontFamily={"Inter"}>
              Naziv
            </Typography>
            <Typography fontSize={"inherit"} fontFamily={"Inter"}>
              Datum prijema
            </Typography>
          </div>
          {row.original.pretrage.map((pretraga) => (
            <div className="rez_row">
              <Typography fontSize={"inherit"} fontFamily={"Inter"}>
                {pretraga.pretraga_sifra}
              </Typography>
              <Typography fontSize={"inherit"} fontFamily={"Inter"}>
                {pretraga.pretraga_code}
              </Typography>
              <Typography fontSize={"inherit"} fontFamily={"Inter"}>
                {pretraga.pretraga_naz}
              </Typography>
              <Typography fontSize={"inherit"} fontFamily={"Inter"}>
                {dayjs(pretraga.datum_prijema).format("DD.MM.YYYY HH:mm:ss")}
              </Typography>
            </div>
          ))}
        </Box>
      ) : null, */
    initialState: {
      showGlobalFilter: true,
      density: "compact",
      showColumnFilters: false,
      sorting: [{ id: "datum_kreiranja", desc: true }], //def sort po ovoj koloni opadajući
    },
    muiTableContainerProps: { sx: { height: "42vh" } }, //maxHeight: "46vh"
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
    muiTableBodyRowProps: ({ row /* staticRowIndex, table  */ }) => ({
      onClick: (/* event */) => {
        //getMRT_RowSelectionHandler({ row, staticRowIndex, table })(event);
        setRowSelection({
          [row.id]: true,
        });
        setIzabraniRezultati([row.original]);
      },
      selected: rowSelection[row.id],
      sx: { cursor: "pointer" },
    }),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      showSkeletons: isLoading,
    },
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
          Broj rezultata: {rezultatiData.length}
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
        <div className="rez_donji_dio">
          {izabraniRezultati.length !== 0 && (
            <Fragment>
              <h5>
                {izabraniRezultati[0].jmbg} - {izabraniRezultati[0].prezime}{" "}
                {izabraniRezultati[0].ime}
              </h5>
              <p>
                {izabraniRezultati[0].klinika_narucioca}-
                {izabraniRezultati[0].klinika_naz}{" "}
                {izabraniRezultati[0].odjel_narucioca}-
                {izabraniRezultati[0].odjel_naz}
              </p>
              <div className="donja_tabela">
                <div className="tabela_red tabela_header">
                  <div>Šifra pretrage</div>
                  <div>Pret. code</div>
                  <div>Naziv pretrage</div>
                  <div style={{ textAlign: "end", paddingRight: "0.5em" }}>
                    Rezultat
                  </div>
                  <div></div>
                  <div>Referentna vrijednost</div>
                  <div>Jed. mj.</div>
                  <div>Datum prijema</div>
                  <div>Datum obrade</div>
                </div>
                {izabraniRezultati[0].rezultati.map((rezultat) => {
                  let text = rezultat.ref_vr
                    .replace("&lt;", "<")
                    .replace("&gt;", ">")
                    .split("<flag>");
                  let vrijednost = rezultat.vrijednost
                    .replace("&lt;", "<")
                    .replace("&gt;", ">");
                  let oznaka = text.length > 1 ? text[1].slice(0, 1) : "N";
                  return (
                    <div className="tabela_red" key={rezultat.pretraga_sifra}>
                      <div>{rezultat.pretraga_sifra}</div>
                      <div>{rezultat.pretraga_code}</div>
                      <div>{rezultat.pretraga_naz}</div>
                      <div
                        style={
                          oznaka === "H"
                            ? {
                                color: "#d8315b",
                                fontWeight: "bold",
                                textAlign: "end",
                                paddingRight: "0.5em",
                              }
                            : oznaka === "L"
                            ? {
                                color: "#0077b6",
                                fontWeight: "bold",
                                textAlign: "end",
                                paddingRight: "0.5em",
                              }
                            : {
                                color: "black",
                                textAlign: "end",
                                paddingRight: "0.5em",
                              }
                        }
                      >
                        {vrijednost}
                      </div>
                      <div
                        style={{
                          /* width: "30px", */ fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {oznaka !== "N" ? oznaka : ""}
                      </div>
                      <div
                        style={
                          oznaka === "H"
                            ? { color: "#d8315b", fontWeight: "bold" }
                            : oznaka === "L"
                            ? { color: "#0077b6", fontWeight: "bold" }
                            : { color: "black" }
                        }
                      >
                        {text[0]}
                      </div>
                      <div>{rezultat.jm}</div>
                      <div>
                        {dayjs(rezultat.datum_prijema).format(
                          "DD.MM.YYYY HH:mm:ss"
                        )}
                      </div>
                      <div>
                        {dayjs(rezultat.datum_obrade).format(
                          "DD.MM.YYYY HH:mm:ss"
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Fragment>
          )}
        </div>
      </LocalizationProvider>
    </Fragment>
  );

  return (
    <Fragment>
      <Popup
        title={"LISTA REZULTATA LABORATORIJISKIH ANALIZA"}
        izborDatuma={izborDatuma}
        openPopup={true}
        setOpenPopup={closeListaRezultata}
        fullScreen={true}
        //maxWidth={"none"}
      >
        {lista}
      </Popup>
    </Fragment>
  );
};

export default ListaRezultata;
