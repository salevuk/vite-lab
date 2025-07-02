import { useState } from "react";
import { useStore } from "../../store";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const Tabela = ({
  columns,
  data,
  loading,
  sorting,
  osoblje,
  arhiva,
  lab,
  uslugelab,
  uslugeukc,
  uslugekom,
}) => {
  const sesijaPodaci = useStore((store) => store.sesijaPodaci);
  const setOtvoriNovaPretraga = useStore(
    (store) => store.setOtvoriNovaPretraga
  );
  const setOtvoriNovaUsluga = useStore((store) => store.setOtvoriNovaUsluga);
  const [rowSelection, setRowSelection] = useState({});

  const licenceToClick =
    sesijaPodaci.id_korisnika === 2152 ||
    sesijaPodaci.grupa_korisnika.includes("1");

  const table = useMaterialReactTable({
    columns,
    data,
    enableStickyHeader: true,
    enableRowVirtualization: true,
    enableGlobalFilter: true,
    enableRowSelection: true,
    enableHiding: false,
    //enableRowPinning: true,
    //rowPinningDisplayMode: "select-sticky",
    enableColumnFilters: false,
    enableMultiRowSelection: false,
    positionToolbarAlertBanner: "none",
    enableSelectAll: false,
    //paginationDisplayMode: "pages",
    initialState: {
      pagination: { pageSize: 1000, pageIndex: 0 },
      showGlobalFilter: true,
      density: "compact",
      //def sort po ovoj koloni rastući
      columnVisibility: { "mrt-row-select": false },
    },
    state: {
      showSkeletons: loading,
      isLoading: loading,
      rowSelection,
      sorting,
    },
    /* displayColumnDefOptions: {
      'mrt-row-select': {
        visibleInShowHideMenu: false, //hide the built-in row actions column from the show hide menu
      }, */
    getRowId: (row) => row.id,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        //console.log("row original", row.original, lab);
        //console.log("sesijaPodaci privilegije", sesijaPodaci.lab_privilegije);
        osoblje &&
          (sesijaPodaci.lab_privilegije.includes(1) ||
            sesijaPodaci.grupa_korisnika.includes("1")) &&
          useStore.setState({
            otvoriPrivilegije: {
              open: true,
              laborant: row.original,
              promjena: [],
            },
          }),
          arhiva &&
            useStore.setState({
              otvoriArhivaUputnicu: { open: true, uputnica: row.original },
            }),
          setRowSelection((prev) => ({
            [row.id]: !prev[row.id],
          }));
        lab &&
          licenceToClick &&
          setOtvoriNovaPretraga({
            open: true,
            izmjena: true,
            data: row.original,
          });
        uslugeukc &&
          licenceToClick &&
          setOtvoriNovaUsluga({
            open: true,
            izmjena: true,
            data: {
              ...row.original,
              tip_usluge: row.original.tip === "KOMERC.USL" ? 2 : 1,
              new_usluga_sif: row.original.usluga_sif,
            },
          });
        uslugelab &&
          licenceToClick &&
          setOtvoriNovaUsluga({
            open: true,
            izmjena: true,
            data: {
              ...row.original,
              tip_usluge: 1,
              new_usluga_sif: row.original.usluga_sif,
            },
          });
        uslugekom &&
          licenceToClick &&
          setOtvoriNovaUsluga({
            open: true,
            izmjena: true,
            data: {
              ...row.original,
              tip_usluge: 2,
              new_usluga_sif: row.original.usluga_sif,
            },
          });
      },
      selected: rowSelection[row.id],
      sx: {
        cursor: "pointer",
        //gap: "0.15em",
      },
    }),
    //muiSelectAllCheckboxProps: { disabled: true },
    //muiSelectCheckboxProps: { disabled: true },
    onRowSelectionChange: setRowSelection,
    muiTableContainerProps: {
      sx: { /* maxHeight: "81vh" */ height: "82vh", fontFamily: "Inter" },
    },
    muiTableHeadRowProps: {
      sx: {
        backgroundColor: "#f2f2f2",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontFamily: "Inter",
        borderRight: "1px solid rgb(170, 170, 170)",
        height: "100% !important",
      },
    },
    muiTableBodyCellProps: (/* { row } */) => ({
      sx: (/* theme */) => ({
        fontFamily: "Inter",
        paddingLeft: arhiva ? "0.5em" : "1.5em",
        fontSize: "1rem",
        borderRight: "1px solid rgb(170, 170, 170)",
      }),
    }),
    muiPaginationProps: {
      showRowsPerPage: false,
      shape: "rounded",
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
  return <MaterialReactTable table={table} />;
};

export default Tabela;
