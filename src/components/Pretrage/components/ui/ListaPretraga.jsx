import "./ListaPretraga.css";
import { Fragment, useState, useMemo, useEffect } from "react";
import DataTable from "react-data-table-component";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import PretragaIzmjenaForm from "./PretragaIzmjenaForm";
import { useStore } from "../../../../store";

const columns = [
  {
    id: "glavnaGrupa",
    name: "Glavna grupa",
    selector: (row) => row.pretrage_grupa,
    sortable: true,
  },
  {
    id: "podGrupa",
    name: "Podgrupa",
    selector: (row) => row.pretrage_podgrupa,
    sortable: true,
  },
  {
    id: "grupa",
    name: "Grupa pretraga",
    selector: (row) => row.grupa_pretraga,
    sortable: true,
  },
  {
    id: "naziv",
    name: "Naziv pretrage",
    selector: (row) => row.pretraga_naz,
    sortable: true,
  },
];

const tableStyles = {
  table: {
    style: {
      backgroundColor: "transparent",
    },
  },
  head: {
    style: {
      color: "#0e5959",
      fontSize: "1.15em",
      fontWeight: "600",
    },
  },
  headRow: {
    style: {
      borderBottomColor: "#0e5959",
    },
  },
  rows: {
    style: {
      fontSize: "1em",
      "&:hover": {
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "#0e5959 !important",
      },
    },
  },
};

const ListaPretraga = () => {
  const pretrage = useStore((store) => store.pretrage);
  const pretragaZaIzmjenu = useStore((store) => store.pretragaZaIzmjenu);
  const unesiPretraguZaIzmjenu = useStore(
    (store) => store.unesiPretraguZaIzmjenu
  );
  const [isPretragaIzmjenaDrawer, setIsPretragaIzmjenaDrawer] = useState(false);
  const [neaktivnePretrage, setNeaktivnePretrage] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filterAktivnePretrage, setFilterAktivnePretrage] = useState([]);

  useEffect(() => {
    const filteredPretrage = pretrage.filter(
      (pretraga) =>
        pretraga.pretraga_naz &&
        pretraga.pretraga_naz.toLowerCase().includes(filterText.toLowerCase())
    );
    let klackalica = neaktivnePretrage ? 0 : 1;
    const aktivnePretrage = filteredPretrage.filter(
      (pretraga) => pretraga.aktivno === klackalica
    );
    setFilterAktivnePretrage(aktivnePretrage);
  }, [pretrage, filterText, neaktivnePretrage]);

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText.length !== 0) {
        setFilterText("");
      }
    };

    return (
      <Fragment>
        <div className="search-container aktivcontainer">
          <button
            className={`trazid aktivd ${neaktivnePretrage ? "nboja" : ""}`}
            onClick={() => {
              setNeaktivnePretrage(!neaktivnePretrage);
            }}
          >
            <p>{neaktivnePretrage ? "Neaktivne" : "Aktivne"}</p>
            <i class="bx bx-filter"></i>
          </button>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Traži po nazivu ili šifri.."
            name="search"
            onChange={(e) => setFilterText(e.target.value)}
            value={filterText}
          />
          <button onClick={handleClear} className="trazid">
            <i class="bx bx-reset"></i>
          </button>
        </div>
      </Fragment>
    );
  }, [filterText, neaktivnePretrage]);

  const urediPretraguOpen = (pretraga) => {
    unesiPretraguZaIzmjenu(pretraga);
    setTimeout(setIsPretragaIzmjenaDrawer(!isPretragaIzmjenaDrawer), 500);
  };
  const urediPretraguClose = () => {
    unesiPretraguZaIzmjenu(null);
    setIsPretragaIzmjenaDrawer(!isPretragaIzmjenaDrawer);
  };

  return (
    <Fragment>
      <DataTable
        customStyles={tableStyles}
        columns={columns}
        data={filterAktivnePretrage}
        onRowClicked={urediPretraguOpen}
        subHeader
        subHeaderAlign="left"
        subHeaderComponent={subHeaderComponentMemo}
        fixedHeader
        highlightOnHover
        responsive
        pointerOnHover
      />

      <Drawer
        open={isPretragaIzmjenaDrawer}
        onClose={urediPretraguClose}
        direction="left"
        size="450px"
        className="draw_backdrop"
      >
        <div className="draw_menu">
          <p>UREDI PODATKE LAB. PRETRAGE</p>
          {pretragaZaIzmjenu !== null && <PretragaIzmjenaForm />}
        </div>
      </Drawer>
    </Fragment>
  );
};

export default ListaPretraga;
