import { useState, useEffect, useRef } from "react";
import { useStore } from "../../../../store";
import { pripremaPodaci } from "../../../util/utility";
import useSlanjeBionet from "../../../util/useSlanjeBionet";
import { usePretragaUnos } from "../../../util/usePretragaUnos";
import "./IzborAnaliza.css";
import KlinickaHemija from "../podgrupeanalize/KlinickaHemija";
import Hgu from "../podgrupeanalize/HematologijaGasneUrin";
import Kou from "../podgrupeanalize/KoagulacijaOsmolaritetUsluge";
import Alergija from "../podgrupeanalize/Alergija";
import Profil from "../podgrupeanalize/Profil";
import Autoimune from "../podgrupeanalize/Autoimune";
import Hormoni from "../podgrupeanalize/Hormoni";
import KostaniMarkeri from "../podgrupeanalize/KostaniMarkeri";
import ListaPretraga from "../ui/ListaPretraga";
//import { useReactToPrint } from "react-to-print";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import Select, { components } from "react-select"; // eslint-disable-line
import Toast from "../../../UI/Toast/Toast";
import ConfirmModal from "../../../Modals/ConfirmModal";
//import dayjs from "dayjs";
import CircularProgress from "@mui/material/CircularProgress";
//import PretragaUnosForm from "../ui/PretragaUnosForm";

const IzborAnaliza = ({
  zatvoriPretrage,
  pacijentPodaci,
  otvoriDetalj,
  //podaciUputnice,
  pretrageSve,
  izmjenaStatusa,
}) => {
  const [tab, setTab] = useState("Rutina");
  const [isPregledDrawerOpen, setIsPregledDrawerOpen] = useState(false);
  //const [isDodajDrawerOpen, setIsDodajDrawerOpen] = useState(false);
  //const [opcije, setOpcije] = useState([]);
  const [opcijeSve, setOpcijeSve] = useState([]);
  const [ukupnaCijena, setUkupnaCijena] = useState(0);
  const [ukupnoFond, setUkupnoFond] = useState(0);
  const setOtvoriPrintUplatnice = useStore(
    (store) => store.setOtvoriPrintUplatnice
  );
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [odabraniNalog, setOdabraniNalog] = useState({ id: 0, pretrage: [] });
  const sesijaPodaci = useStore((store) => store.sesijaPodaci);
  const podaciUputnice = useStore((store) => store.podaciUputnice);
  //const korisnik = useStore((store) => store.korisnik);
  const korisnik = sesijaPodaci.id_korisnika;
  const pretrage = useStore((store) => store.pretrage);
  const odabranePretrage = useStore((store) => store.odabranePretrage);
  const odaberiPretragu = useStore((store) => store.odaberiPretragu);
  const oduzmiPretragu = useStore((store) => store.oduzmiPretragu);
  const ponistiPretragu = useStore((store) => store.ponistiPretragu);
  const setOtvoriPrintOvjere = useStore((store) => store.setOtvoriPrintOvjere);
  const [loading, setLoading] = useState(false);
  const [openNotifikaciju, setOpenNotifikaciju] = useState({
    open: false,
    message: "",
    severity: "",
    duration: 0,
  });
  const { slanjeBionet } = useSlanjeBionet();
  const { pretragaUnos } = usePretragaUnos();

  const isSlanjeBionet = useRef(false);
  const posaljiRef = useRef(null);
  const dodajRef = useRef(null);
  // unos nove pretrage - trenutno iskljucen
  /* const pretragaUnos = async (pretraga) => {
    const newData = new URLSearchParams();
    newData.append("id_uputnice", podaciUputnice.id);
    newData.append("pretraga_sifra", pretraga.lab_sifra);
    newData.append("pretraga_code", pretraga.pretraga_code);
    newData.append(
      "usluga_sifra",
      podaciUputnice.komerc_placanje === 1 || podaciUputnice.po_ugovoru === 1
        ? pretraga.komerc_sif
        : pretraga.sifra_usluge
    );
    newData.append("usluga_kolicina", pretraga.kolicina);
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

  const togglePregledDrawer = () => {
    setIsPregledDrawerOpen(!isPregledDrawerOpen);
  };

  /*   const toggleDodajDrawer = () => {
    setIsDodajDrawerOpen(!isDodajDrawerOpen);
  }; */

  const grupe = pretrage.map((u) => {
    return u.pretrage_grupa;
  });
  const gg = [...new Set(grupe)];

  /*   useEffect(() => {
    const opcijePretrage = pretrage
      .filter((p) => {
        return !odabraniNalog.pretrage.some(
          (e) => e.id === Number(p.pretraga_id)
        );
      })
      .map((u) => {
        return {
          label: (u.labmedic_sifra + " - " + u.pretraga_naz).trim(),
          pretraga_naz: u.pretraga_naz,
          pretraga_code: u.pretraga_code,
          value: Number(u.pretraga_id),
          lab_sifra: u.labmedic_sifra,
          fond_participacija: u.fond_participacija,
          fond_cijena: u.fond_cijena,
          mpc_cijena: u.mpc_cijena,
          usluga_sif: u.usluga_sif,
          komerc_sif: u.komerc_sif,
        };
      });
    setOpcije(opcijePretrage);
  }, [pretrage, odabraniNalog]); */

  useEffect(() => {
    const opcijePretrageSve = pretrageSve
      /* .filter((p) => {
        return !odabraniNalog.pretrage.some(
          (e) => e.id === Number(p.pretraga_id)
        );
      }) */
      .filter((p) => {
        return (
          ["0022", "0020"].includes(p.pretraga_id) ||
          !odabraniNalog.pretrage.some((e) => e.id === Number(p.pretraga_id))
        );
      })
      .map((u) => {
        return {
          label: (u.labmedic_sifra + " - " + u.pretraga_naz).trim(),
          pretraga_naz: u.pretraga_naz,
          pretraga_code: u.pretraga_code,
          value: Number(u.pretraga_id),
          lab_sifra: u.labmedic_sifra,
          fond_participacija: u.fond_participacija,
          fond_cijena: u.fond_cijena,
          mpc_cijena: u.mpc_cijena,
          usluga_sif: u.usluga_sif,
          komerc_sif: u.komerc_sif,
        };
      });
    setOpcijeSve(opcijePretrageSve);
  }, [pretrageSve, odabraniNalog]);

  /* useEffect(() => {
    if (odabraniNalog.pretrage.length > 0) {
      if (podaciUputnice.status === 0) {
        if (podaciUputnice.vrsta === 1) {
          if (
            podaciUputnice.status_osiguranja === 1 &&
            podaciUputnice.komerc_placanje === 0 &&
            podaciUputnice.po_ugovoru === 0
          ) {
            let ukupna_participacija = odabraniNalog.pretrage
              .reduce(function (a, c) {
                return a + Number(c.kolicina) * Number(c.fond_participacija);
              }, 0)
              .toFixed(2);
            let ukupno_fond = odabraniNalog.pretrage
              .reduce(function (a, c) {
                return a + Number(c.kolicina) * Number(c.fond_cijena);
              }, 0)
              .toFixed(2);

            if (podaciUputnice.bez_participacije === 0) {
              setUkupnaCijena(ukupna_participacija);
              setUkupnoFond(Number(ukupno_fond) - Number(ukupna_participacija));
            }
            if (podaciUputnice.bez_participacije === 1) {
              setUkupnoFond(ukupno_fond);
              setUkupnaCijena(0);
            }
          }
          if (
            podaciUputnice.status_osiguranja === 0 ||
            podaciUputnice.komerc_placanje === 1
          ) {
            let ukupna_participacija = odabraniNalog.pretrage
              .reduce(function (a, c) {
                return a + Number(c.kolicina) * Number(c.mpc_cijena);
              }, 0)
              .toFixed(2);
            setUkupnaCijena(ukupna_participacija);
            setUkupnoFond(0);
          }

          if (podaciUputnice.po_ugovoru === 1) {
            setUkupnoFond(0);
            setUkupnaCijena(0);
          }
        }
        if (podaciUputnice.vrsta === 2) {
          if (
            podaciUputnice.komerc_placanje === 0 &&
            podaciUputnice.status_osiguranja === 1
          ) {
            let ukupno_participacija = odabraniNalog.pretrage
              .reduce(function (a, c) {
                return a + Number(c.kolicina) * Number(c.fond_participacija);
              }, 0)
              .toFixed(2);
            let ukupno_fond = odabraniNalog.pretrage
              .reduce(function (a, c) {
                return a + Number(c.kolicina) * Number(c.fond_cijena);
              }, 0)
              .toFixed(2);
            //PRETPOSTAVKA 99,9% je osigurano ili retroaktivno se osigura
            if (podaciUputnice.vid_osiguranja === 6) {
              setUkupnoFond(Number(ukupno_fond) - Number(ukupno_participacija));
              setUkupnaCijena(ukupno_participacija);
            } else if (
              podaciUputnice.vid_osiguranja === 1 ||
              podaciUputnice.vid_osiguranja === 0
            ) {
              setUkupnoFond(ukupno_fond);
              setUkupnaCijena(0);
            }
          } else {
            //UKOLIKO PAC. NIJE OSIGURAN IDE SE NA KOMERC. PLAĆANJE
            let ukupna_participacija = odabraniNalog.pretrage
              .reduce(function (a, c) {
                return a + Number(c.kolicina) * Number(c.mpc_cijena);
              }, 0)
              .toFixed(2);
            setUkupnaCijena(ukupna_participacija);
            setUkupnoFond(0);
          }
        }
      } else if (podaciUputnice.status !== 0) {
        setUkupnoFond(podaciUputnice.ukupno_fond);
        setUkupnaCijena(podaciUputnice.ukupna_participacija);
      }
    }
  }, [pretrageSve, odabraniNalog, podaciUputnice]); */ // RAČUNA UKUPNU CIJENU

  useEffect(() => {
    if (odabraniNalog.pretrage.length > 0) {
      let ukupna_participacija = 0;
      let ukupno_fond = 0;
      odabraniNalog.pretrage.forEach((p) => {
        ukupna_participacija +=
          Number(p.kolicina) * Number(p.fond_participacija);
        ukupno_fond += Number(p.kolicina) * Number(p.fond_cijena);
      });
      ukupna_participacija = ukupna_participacija.toFixed(2);
      ukupno_fond = ukupno_fond.toFixed(2);
      //console.log("UKUPNA PART", ukupna_participacija);
      //console.log("UKUPNO F", ukupno_fond);
      if (Number(podaciUputnice.vrsta) === 1) {
        if (
          Number(podaciUputnice.status_osiguranja) === 1 &&
          Number(podaciUputnice.komerc_placanje) === 0 &&
          Number(podaciUputnice.po_ugovoru) === 0
        ) {
          if (Number(podaciUputnice.bez_participacije) === 0) {
            setUkupnaCijena(ukupna_participacija);
            setUkupnoFond(Number(ukupno_fond) - Number(ukupna_participacija));
          }
          if (Number(podaciUputnice.bez_participacije) === 1) {
            setUkupnoFond(ukupno_fond);
            setUkupnaCijena(0);
          }
        }
        if (
          Number(podaciUputnice.status_osiguranja) === 0 &&
          Number(podaciUputnice.komerc_placanje) === 0
        ) {
          setUkupnaCijena(
            odabraniNalog.pretrage
              .reduce(
                (a, c) => a + Number(c.kolicina) * Number(c.fond_cijena), //DA LI PUNA FONDOVSKA CIJENA ILI KOMERCIJALNA CIJENA
                0
              )
              .toFixed(2)
          );
          setUkupnoFond(0);
        }
        if (Number(podaciUputnice.komerc_placanje) === 1) {
          setUkupnaCijena(
            odabraniNalog.pretrage
              .reduce(
                (a, c) => a + Number(c.kolicina) * Number(c.mpc_cijena),
                0
              )
              .toFixed(2)
          );
          setUkupnoFond(0);
        }
      }
      if (Number(podaciUputnice.vrsta) === 2) {
        if (
          Number(podaciUputnice.komerc_placanje) === 0 &&
          Number(podaciUputnice.status_osiguranja) === 1
        ) {
          if (Number(podaciUputnice.vid_osiguranja) === 6) {
            setUkupnoFond(Number(ukupno_fond) - Number(ukupna_participacija));
            setUkupnaCijena(ukupna_participacija);
          } else if (
            Number(podaciUputnice.vid_osiguranja) === 1 ||
            Number(podaciUputnice.vid_osiguranja) === 0
          ) {
            setUkupnoFond(ukupno_fond);
            setUkupnaCijena(0);
          }
        } else {
          setUkupnaCijena(
            odabraniNalog.pretrage
              .reduce(
                (a, c) => a + Number(c.kolicina) * Number(c.mpc_cijena),
                0
              )
              .toFixed(2)
          );
          setUkupnoFond(0);
        }
      }
    }
  }, [pretrageSve, odabraniNalog, podaciUputnice]); // RAČUNA UKUPNU CIJENU

  useEffect(() => {
    if (odabranePretrage.length === 0) return;
    let izabraniNalog = odabranePretrage.find(
      (nalog) => nalog.id === podaciUputnice.id
    );
    if (izabraniNalog === undefined) {
      setOdabraniNalog({ id: 0, pretrage: [] });
    } else {
      setOdabraniNalog(izabraniNalog);
    } // eslint-disable-next-line
  }, [odabranePretrage]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      posaljiRef.current.focus();
    }
    if (event.key === "ArrowUp") {
      dodajRef.current.focus();
    }
    if (event.key === "Escape") {
      posaljiRef.current.blur();
      dodajRef.current.blur();
    }
  };

  /*   const Control = ({ children, ...props }) => {
    const style = {
      width: "42px",
      color: "#2ca08b",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "1.75em",
    };
    return (
      <components.Control {...props}>
        <span style={style}>
          <i className="bx bx-test-tube"></i>
        </span>
        {children}
      </components.Control>
    );
  }; */

  const DropdownIndicator = ({ children, ...props }) => {
    const style = {
      color: "#067bc2",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "1.5em",
    };
    return (
      <components.DropdownIndicator {...props}>
        <span style={style}>
          <i class="bx bx-list-ul"></i>
        </span>
        {children}
      </components.DropdownIndicator>
    );
  };

  /*  const selectStyle1 = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      /*       height: 32,
      minHeight: 32, 
      borderWidth: "1px",
      "&:hover": {
        borderColor: "#2684ff",
      },
      borderColor: state.isFocused ? "#2684ff" : "#84dcc6",
      borderRadius: "5px",
      fontSize: "0.95em",
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      paddingTop: 6,
      paddingBottom: 6,
    }),
    clearIndicator: (styles) => ({
      ...styles,
      paddingTop: 6,
      paddingBottom: 6,
    }),
  }; */

  const selectStyle2 = {
    control: (styles, state) => ({
      ...styles,
      /*       height: 32,
      minHeight: 32, */
      borderWidth: "1px",
      "&:hover": {
        borderColor: "#2684ff",
      },
      borderColor: state.isFocused ? "#2684ff" : "#84dcc6",
      borderRadius: "5px",
      fontSize: "0.95em",
      marginTop: "0.5em",
    }),

    dropdownIndicator: (styles) => ({
      ...styles,
      paddingTop: 4,
      paddingBottom: 4,
    }),
    clearIndicator: (styles) => ({
      ...styles,
      paddingTop: 6,
      paddingBottom: 6,
    }),
  };

  const tpr = pretrageSve.filter((p) => p.pretraga_id === "15140");

  const handleChange = (odabranaPretraga, { action }) => {
    //console.log("ODABRANA PRETRAGA", odabranaPretraga, akcija);
    /* if (action === "select-option") {
      if (odabranaPretraga.lab_sifra === "430050") {
        let tprprovjera = odabraniNalog.pretrage.find(
          (p) => p.lab_sifra === "15140"
        );
        if (tprprovjera === undefined) {
          odaberiPretragu({
            id: podaciUputnice.id,
            novaPretraga: {
              id: Number(tpr[0].pretraga_id),
              lab_sifra: tpr[0].labmedic_sifra,
              sifra_usluge: tpr[0].usluga_sif,
              pretraga_code: tpr[0].pretraga_code,
              naziv: tpr[0].pretraga_naz,
              komerc_sif: tpr[0].komerc_sif,
              //cijena: usluga_cijena,
              fond_participacija: tpr[0].fond_participacija,
              mpc_cijena: tpr[0].mpc_cijena,
              fond_cijena: tpr[0].fond_cijena,
              kolicina: 1,
            },
          });
        }
      }
      odaberiPretragu({
        id: podaciUputnice.id,
        novaPretraga: {
          id: odabranaPretraga.value, //ovdje ga pretvara u broj
          lab_sifra: odabranaPretraga.lab_sifra,
          sifra_usluge: odabranaPretraga.usluga_sif,
          komerc_sif: odabranaPretraga.komerc_sif,
          pretraga_code: odabranaPretraga.pretraga_code,
          naziv: odabranaPretraga.pretraga_naz,
          //cijena: cijena,
          fond_participacija: odabranaPretraga.fond_participacija,
          fond_cijena: odabranaPretraga.fond_cijena,
          mpc_cijena: odabranaPretraga.mpc_cijena,
          kolicina: 1,
        },
      });
      setOpenNotifikaciju({
        open: true,
        message: "Laboratorijska pretraga unešena u uputnicu!",
        severity: "success",
        duration: 2000,
      });
    } */
    if (action === "select-option") {
      // Ako je elektroforeza, automatski dodaj i TPR ako nije već dodat
      if (
        odabranaPretraga.lab_sifra === "430050" &&
        !odabraniNalog.pretrage.some((p) => p.lab_sifra === "15140") &&
        tpr[0]
      ) {
        odaberiPretragu({
          id: podaciUputnice.id,
          novaPretraga: {
            id: Number(tpr[0].pretraga_id),
            lab_sifra: tpr[0].labmedic_sifra,
            sifra_usluge: tpr[0].usluga_sif,
            pretraga_code: tpr[0].pretraga_code,
            naziv: tpr[0].pretraga_naz,
            komerc_sif: tpr[0].komerc_sif,
            fond_participacija: tpr[0].fond_participacija,
            mpc_cijena: tpr[0].mpc_cijena,
            fond_cijena: tpr[0].fond_cijena,
            kolicina: 1,
          },
        });
      }
      odaberiPretragu({
        id: podaciUputnice.id,
        novaPretraga: {
          id: odabranaPretraga.value,
          lab_sifra: odabranaPretraga.lab_sifra,
          sifra_usluge: odabranaPretraga.usluga_sif,
          komerc_sif: odabranaPretraga.komerc_sif,
          pretraga_code: odabranaPretraga.pretraga_code,
          naziv: odabranaPretraga.pretraga_naz,
          fond_participacija: odabranaPretraga.fond_participacija,
          fond_cijena: odabranaPretraga.fond_cijena,
          mpc_cijena: odabranaPretraga.mpc_cijena,
          kolicina: 1,
        },
      });

      setOpenNotifikaciju({
        open: true,
        message: "Laboratorijska pretraga unešena u uputnicu!",
        severity: "success",
        duration: 2000,
      });
    }
    if (action === "dodaj") {
      odaberiPretragu({
        id: podaciUputnice.id,
        novaPretraga: {
          id: odabranaPretraga.id,
          lab_sifra: odabranaPretraga.lab_sifra,
          sifra_usluge: odabranaPretraga.sifra_usluge,
          komerc_sif: odabranaPretraga.komerc_sif,
          pretraga_code: odabranaPretraga.pretraga_code,
          naziv: odabranaPretraga.naziv,
          //cijena: cijena, //odabranaPretraga.cijena,
          fond_participacija: odabranaPretraga.fond_participacija,
          fond_cijena: odabranaPretraga.fond_cijena,
          mpc_cijena: odabranaPretraga.mpc_cijena,
          kolicina: 1,
        },
      });
      setOpenNotifikaciju({
        open: true,
        message: "Količina dodata!",
        severity: "success",
        duration: 2000,
      });
    }

    if (action === "oduzmi") {
      oduzmiPretragu({
        id: podaciUputnice.id,
        novaPretraga: {
          id: odabranaPretraga.id,
          lab_sifra: odabranaPretraga.lab_sifra,
          sifra_usluge: odabranaPretraga.sifra_usluge,
          komerc_sif: odabranaPretraga.komerc_sif,
          pretraga_code: odabranaPretraga.pretraga_code,
          naziv: odabranaPretraga.naziv,
          //cijena: cijena, //odabranaPretraga.cijena,
          fond_participacija: odabranaPretraga.fond_participacija,
          fond_cijena: odabranaPretraga.fond_cijena,
          mpc_cijena: odabranaPretraga.mpc_cijena,
          kolicina: 1,
        },
      });
      setOpenNotifikaciju({
        open: true,
        message: "Količina umanjena!",
        severity: "success",
        duration: 2000,
      });
    }
  };
  //console.warn("TPR izbor", tpr[0], tpr[0].pretraga_naz);
  /* const handleChangeAll = (odabranaPretraga, { action }) => {
    if (action === "select-option") {
      //console.log("ODABRANA PRETRAGA", odabranaPretraga);
      if (odabranaPretraga.lab_sifra === "430050") {
        let tprprovjera = odabraniNalog.pretrage.find(
          (p) => p.lab_sifra === "15140"
        );
        if (tprprovjera === undefined) {
          // let usluga_sif =
            //podaciUputnice.komerc_placanje === 1 ||
            //podaciUputnice.po_ugovoru === 1
              //? tpr[0].komerc_sif
              //: podaciUputnice.status_osiguranja === 1
              //? tpr[0].usluga_sif
              //: tpr[0].komerc_sif; 
          //let usluga_cijena =
            //podaciUputnice.vrsta === 1
              //? podaciUputnice.komerc_placanje === 1 ||
                //podaciUputnice.status_osiguranja === 0
                //? tpr[0].mpc_cijena
               // : podaciUputnice.po_ugovoru === 1 ||
                 // podaciUputnice.bez_participacije === 1
                //? 0
               // : podaciUputnice.status_osiguranja === 1
                //? tpr[0].fond_participacija
                //: tpr[0].fond_cijena
              //: tpr[0].fond_cijena - tpr[0].fond_participacija; 
          odaberiPretragu({
            id: podaciUputnice.id,
            novaPretraga: {
              id: Number(tpr[0].pretraga_id),
              lab_sifra: tpr[0].labmedic_sifra,
              sifra_usluge: tpr[0].usluga_sif,
              pretraga_code: tpr[0].pretraga_code,
              naziv: tpr[0].pretraga_naz,
              komerc_sif: tpr[0].komerc_sif,
              //cijena: usluga_cijena,
              fond_participacija: tpr[0].fond_participacija,
              mpc_cijena: tpr[0].mpc_cijena,
              fond_cijena: tpr[0].fond_cijena,
              kolicina: 1,
            },
          });
        }
      }
      // po ugovoru komerc šifre
      // let sifra_proizvoda =
        //podaciUputnice.komerc_placanje === 1 || podaciUputnice.po_ugovoru === 1
          //? odabranaPretraga.komerc_sif
          //: podaciUputnice.status_osiguranja === 1
          //? odabranaPretraga.usluga_sif
          //: odabranaPretraga.komerc_sif;
      // let cijena =
        //podaciUputnice.vrsta === 1
         // ? podaciUputnice.komerc_placanje === 1
           // ? odabranaPretraga.mpc_cijena
           // : podaciUputnice.po_ugovoru === 1 ||
            //  podaciUputnice.bez_participacije === 1
            //? 0
           // : podaciUputnice.status_osiguranja === 1
           // ? odabranaPretraga.fond_participacija
            //: odabranaPretraga.fond_cijena
          //: odabranaPretraga.fond_cijena - odabranaPretraga.fond_participacija;  // UKOLIKO JE BOLNIČKA UZIMAMO OVO JER 99,9% slučajeva SE REOSIGURAJU
      //UVESTI REIZBOR
      odaberiPretragu({
        id: podaciUputnice.id,
        novaPretraga: {
          id: odabranaPretraga.value, //ovdje ga pretvara u broj
          lab_sifra: odabranaPretraga.lab_sifra,
          sifra_usluge: odabranaPretraga.usluga_sif,
          komerc_sif: odabranaPretraga.komerc_sif,
          pretraga_code: odabranaPretraga.pretraga_code,
          naziv: odabranaPretraga.pretraga_naz,
          //cijena: cijena,
          fond_participacija: odabranaPretraga.fond_participacija,
          fond_cijena: odabranaPretraga.fond_cijena,
          mpc_cijena: odabranaPretraga.mpc_cijena,
          kolicina: 1,
        },
      });
      setOpenNotifikaciju({
        open: true,
        message: "Laboratorijska pretraga unešena u uputnicu!",
        severity: "success",
        duration: 2000,
      });
    }
  }; */ //izbor pretrage iz liste svih pretraga

  const handlePonistiPretragu = (id_pretrage) => {
    ponistiPretragu({ id: podaciUputnice.id, pretragaId: id_pretrage });
    setOpenNotifikaciju({
      open: true,
      message: "Pretraga usješno obrisana iz uputnice!",
      severity: "info",
      duration: 2000,
    });
  };

  const zatvoriPretrageHandler = () => {
    //useStore.setState({ odabranePretrage: [] }); ne poništavamo više zbog grupnog slanja
    zatvoriPretrage();
  };

  //UPISUJE PRETRAGE U BAZU KOD AMBULANTNIH NALOGA
  const handleSlanjeNaloga = async () => {
    if (isSlanjeBionet.current) return;
    isSlanjeBionet.current = true;
    setLoading(true);
    let podaci = pripremaPodaci(odabraniNalog.pretrage, podaciUputnice);
    /* if (podaciUputnice.vrsta === 1) { */ // NE BIRATI PO VRSTI MOGU SE DOPUNITI I BOLNICKE
    await Promise.all(
      odabraniNalog.pretrage.map((pretraga) =>
        pretragaUnos(
          podaciUputnice.id,
          pretraga,
          podaciUputnice.komerc_placanje === 1 ||
            podaciUputnice.po_ugovoru === 1
            ? pretraga.komerc_sif
            : pretraga.sifra_usluge,
          korisnik
        )
      )
    ).then(() => {
      //console.warn("PODACI ZA SLANJE NA BIONET", podaci);
      //slanjeBionet(podaci);
      slanjeBionet(podaci).then((response) => {
        //console.error("RESPONSE SLANJE BIONET HOOK", response);
        if (response.ok) {
          izmjenaStatusa(
            pacijentPodaci.id_uputnice,
            1,
            "",
            ukupnaCijena,
            ukupnoFond,
            false,
            false
          );
        }
        if (!response.ok) {
          setOpenNotifikaciju({
            open: false,
            message: "Slanje nije uspjelo, došlo je do greške!",
            severity: "error",
            duration: 3000,
          });
        }
        setLoading(false);
        isSlanjeBionet.current = false;
      });
    });
  };

  const showConfirmModal = () => {
    setOpenConfirmModal(!openConfirmModal);
  };

  const validSifre = ["0020", "0022"];

  /*  const handlePrintUplatnica = useReactToPrint({
    content: () => componentRef.current,
  }); // za react to print 2.15.1 */
  //console.log("pretrage", pretrage);
  console.log("odabranePretrage IZBOR", odabranePretrage);
  console.log("odabraniNalog IZBOR", odabraniNalog);
  //console.log("opcijOsiguranja", opcijeOsiguranja);
  console.log("podaciUputnice IZBOR", podaciUputnice);
  console.warn("UKUPNA CIJENA", ukupnaCijena);
  console.warn("UKUPNO FOND", ukupnoFond);
  //console.log("pretrageSve", pretrageSve);
  //console.log("posaljiRef", posaljiRef);
  //console.log("opcijeSve", opcijeSve);
  //console.log("pacijentPodaci", pacijentPodaci);
  //console.log("ukupna cijena", ukupnaCijena);
  //console.log("ukupno fond", ukupnoFond);

  return (
    <div className="ia_container">
      <Toast
        open={openNotifikaciju.open}
        setOpen={() =>
          setOpenNotifikaciju({
            open: false,
            message: "",
            severity: "",
            duration: 0,
          })
        }
        severity={openNotifikaciju.severity}
        message={openNotifikaciju.message}
        duration={openNotifikaciju.duration}
      />
      {openConfirmModal && (
        <ConfirmModal
          onConfirm={() => handleSlanjeNaloga()}
          handleCloseConfirmModal={showConfirmModal}
          title={"Slanje naloga/uputnice u LIS"}
          text={"Sigurni ste da želite poslati ovu uputnicu?"}
          yesBtn={"Šalji"}
          noBtn={"Odustani"}
        />
      )}
      <div className="ia_header">
        {gg.map((g) => (
          <div
            className={`ia_tab ${tab === g ? "izabranaGrupa" : ""}`}
            onClick={() => setTab(g)}
          >
            <p>{g.toUpperCase()}</p>
          </div>
        ))}
        <div className="ia_naslov">
          <p onClick={() => otvoriDetalj(true)}>
            {pacijentPodaci.prezime.toUpperCase()}{" "}
            {pacijentPodaci.ime_roditelja !== ""
              ? `(${pacijentPodaci.ime_roditelja.toUpperCase()})`
              : ""}{" "}
            {pacijentPodaci.ime.toUpperCase()} {pacijentPodaci.datum_rodjenja}
          </p>
        </div>
        <div className="dugme dugme_alt">
          <button onClick={zatvoriPretrageHandler}>POVRATAK NA LISTU</button>
        </div>
        <div className="dugme">
          <button onClick={togglePregledDrawer} ref={dodajRef}>
            DODAJ/ PREGLEDAJ/ POŠALJI
          </button>
        </div>
        <div className={"uredi"}>
          <i
            onClick={() => otvoriDetalj(true)}
            className="bx bxs-user-rectangle"
          ></i>
        </div>
        {/*<div className={`uredi ${tab === "Uredi" ? "uredi_aktivno" : ""}`}>*/}
        {/*  <i*/}
        {/*    className="bx bx-grid-horizontal"*/}
        {/*    onClick={() => setTab("Uredi")}*/}
        {/*  ></i>*/}
        {/*</div>*/}
      </div>
      <div className={tab === "Uredi" ? "ia_lista" : "ia_main"}>
        {tab === "Rutina" && (
          <div className="ia_rutina">
            <KlinickaHemija tpr={tpr} />
            <Hgu />
            <Kou />
          </div>
        )}
        {tab === "Hormoni" && <Hormoni />}
        {tab === "Alergija" && <Alergija />}
        {tab === "Profil" && <Profil />}
        {tab === "Autoimune bolesti" && <Autoimune />}
        {tab === "Kostani markeri" && <KostaniMarkeri />}
        {tab === "Uredi" && <ListaPretraga />}
      </div>
      <Drawer
        open={isPregledDrawerOpen}
        onClose={togglePregledDrawer}
        direction="left"
        size="600px"
        className="draw_backdrop"
      >
        {Object.keys(podaciUputnice).length > 0 && (
          <div className="draw_menu">
            <p className="draw_menu_naslov">DODAJ LAB. PRETRAGU U UPUTNICU</p>
            <div className="draw_status">
              <p className="draw_vrsta">
                {podaciUputnice.vrsta === undefined
                  ? "Nema podataka"
                  : podaciUputnice.vrsta === 2
                  ? "BOLNIČKA UPUTNICA"
                  : "AMBULANTNA UPUTNICA"}
              </p>
              <p className="draw_osig">
                STATUS:{"  "}
                {podaciUputnice.status_osiguranja === 1 ? (
                  <b>OSIGURAN</b>
                ) : (
                  <b>NEOSIGURAN</b>
                )}{" "}
                - Vid osiguranja: {podaciUputnice.vid_osiguranja_naziv}{" "}
              </p>
              <p className="draw_osig">
                TIP PLAĆANJA:{"  "}
                {podaciUputnice.komerc_placanje === 1
                  ? "komercijalno plaćanje"
                  : podaciUputnice.po_ugovoru === 1
                  ? "po ugovoru"
                  : podaciUputnice.bez_participacije === 1
                  ? "bez participacije"
                  : podaciUputnice.status_osiguranja === 1
                  ? "participacija"
                  : "komercijalno plaćanje"}
              </p>
              <p className="draw_osig">
                KATEGORIJA:{"  "}
                {podaciUputnice.kategorija_osiguranja === 0
                  ? "Nema podataka"
                  : `${podaciUputnice.kategorija_osiguranja} - ${podaciUputnice.naziv_kategorije_osig}`}
              </p>
            </div>
            {/* <Select
            placeholder="Traži i izaberi lab. pretragu iz panela"
            options={opcije}
            isSearchable
            isClearable
            color="var(--color-labos-400)"
            onChange={handleChange}
            styles={selectStyle1}
            components={{ Control }}
            isDisabled={
              podaciUputnice.status === 1 ||
              podaciUputnice.status === 2 ||
              korisnik !== podaciUputnice.kreirano_korisnik 
                ? true
                : false
            }
          /> */}
            <Select
              placeholder="Izaberi lab. pretragu sa liste svih pretraga"
              options={opcijeSve}
              isSearchable
              isClearable
              color="var(--color-labos-400)"
              onChange={handleChange /* handleChangeAll */}
              styles={selectStyle2}
              components={{ DropdownIndicator }}
              isDisabled={
                podaciUputnice.status === 1 ||
                podaciUputnice.status === 2 ||
                podaciUputnice.status === 3 ||
                korisnik !== podaciUputnice.kreirano_korisnik /* ||
              podaciUputnice.vrsta === 2 */
                  ? true
                  : false
              }
            />
          </div>
        )}
        {odabraniNalog.pretrage.length === 0 && (
          <div className="lista_dodatih_usluga">
            <p>Nema dodatih laboratorijskih pretraga !</p>
          </div>
        )}
        {odabraniNalog.pretrage.length > 0 && (
          <div className="lista_dodatih_usluga">
            <p>Laboratorijske pretrage dodate u nalog:</p>
            <span className="dodata_pretraga_header">
              <p>R.br</p>
              <p>Šif. pret.</p>
              <p>Naziv</p>
              <p>Šif. usl.</p>
              <p></p>
              <p>Kol.</p>
              <p></p>
              <p>Cijena</p>
            </span>
            <ol>
              {(podaciUputnice.status === 0
                ? odabraniNalog.pretrage
                : podaciUputnice.pretrage
              )
                .sort((a, b) => Number(a.id) - Number(b.id))
                .map((pretraga) => (
                  <li key={pretraga.id}>
                    <div className="dodata_pretraga">
                      {/* <div>{pretraga.pretraga_id}</div> */}
                      <div>{pretraga.lab_sifra}</div>
                      <div>{pretraga.naziv}</div>
                      <div>
                        {podaciUputnice.status === 1 ||
                        podaciUputnice.status === 3 ||
                        podaciUputnice.vrsta === 2
                          ? pretraga.sifra_usluge
                          : podaciUputnice.komerc_placanje === 1 ||
                            podaciUputnice.po_ugovoru === 1
                          ? pretraga.komerc_sif
                          : pretraga.usluga_sif}
                      </div>
                      {/*<div>{pretraga.sifra_usluge}</div>*/}
                      <div>
                        {validSifre.includes(pretraga.lab_sifra) &&
                          podaciUputnice.status === 0 && (
                            <i
                              class="bx bx-minus-circle"
                              onClick={() =>
                                handleChange(pretraga, { action: "oduzmi" })
                              }
                            ></i>
                          )}
                      </div>
                      <div>
                        {pretraga.kolicina === undefined
                          ? 1
                          : pretraga.kolicina}
                      </div>
                      <div>
                        {validSifre.includes(pretraga.lab_sifra) &&
                          podaciUputnice.status === 0 && (
                            <i
                              class="bx bx-plus-circle"
                              onClick={() =>
                                handleChange(pretraga, { action: "dodaj" })
                              }
                            ></i>
                          )}
                      </div>
                      {
                        <div>
                          {/*podaciUputnice.vrsta === 1
                            ? podaciUputnice.komerc_placanje === 1
                              ? `${pretraga.mpc_cijena.toFixed(2)} KM`
                              : podaciUputnice.po_ugovoru === 1 ||
                                podaciUputnice.bez_participacije === 1
                              ? "0.00 KM"
                              : podaciUputnice.status_osiguranja === 1
                              ? `${pretraga.fond_participacija.toFixed(2)} KM`
                              : `${pretraga.mpc_cijena.toFixed(2)} KM`
                            : "0.00 KM"*/}
                          {podaciUputnice.vrsta === 1
                            ? podaciUputnice.komerc_placanje === 1
                              ? `${(
                                  pretraga.kolicina * pretraga.mpc_cijena
                                ).toFixed(2)} KM`
                              : podaciUputnice.status_osiguranja === 0 &&
                                podaciUputnice.komerc_placanje === 0
                              ? `${(
                                  pretraga.kolicina * pretraga.fond_cijena
                                ).toFixed(2)} KM`
                              : podaciUputnice.po_ugovoru === 1 ||
                                podaciUputnice.bez_participacije === 1
                              ? "0.00 KM"
                              : `${(
                                  pretraga.kolicina *
                                  pretraga.fond_participacija
                                ).toFixed(2)} KM`
                            : "0.00 KM"}
                        </div>
                      }
                      <i
                        className="bx bx-trash"
                        onClick={() => handlePonistiPretragu(pretraga.id)}
                        disabled={
                          podaciUputnice.status === 1 ||
                          podaciUputnice.status === 2 ||
                          podaciUputnice.status === 3 ||
                          korisnik !== podaciUputnice.kreirano_korisnik /* ||
                        podaciUputnice.vrsta === 2 */
                            ? true
                            : false
                        }
                        style={
                          podaciUputnice.status === 1 ||
                          podaciUputnice.status === 2 ||
                          podaciUputnice.status === 3 ||
                          korisnik !== podaciUputnice.kreirano_korisnik /* ||
                        podaciUputnice.vrsta === 2 */
                            ? {
                                display: "none",
                              }
                            : null
                        }
                      ></i>
                    </div>
                  </li>
                ))}
            </ol>
            <div>
              UKUPNA CIJENA:{" "}
              {podaciUputnice.vrsta === 2
                ? "0.00 KM"
                : podaciUputnice.komerc_placanje === 1
                ? `${ukupnaCijena} KM`
                : podaciUputnice.po_ugovoru === 1
                ? "0.00 KM"
                : podaciUputnice.bez_participacije === 1
                ? "0.00 KM"
                : `${ukupnaCijena} KM`}
            </div>
          </div>
        )}
        <div className={`dugme slanje ${loading ? "loading" : ""}`}>
          <button
            disabled={
              loading
                ? true
                : odabraniNalog.pretrage.length === 0
                ? true
                : pacijentPodaci.status !== 0 ||
                  korisnik !== podaciUputnice.kreirano_korisnik
                ? true
                : false
            }
            ref={posaljiRef}
            onClick={showConfirmModal}
          >
            {loading === false &&
              (pacijentPodaci.status === 1 || pacijentPodaci.status === 3
                ? "POSLANO"
                : podaciUputnice.status === 2
                ? "STORNIRANO"
                : "POŠALJI")}
            {loading ? <CircularProgress size="22px" /> : null}
          </button>
          <button
            disabled={
              odabraniNalog.pretrage.length === 0
                ? true
                : pacijentPodaci.status === 0 ||
                  pacijentPodaci.status === 2 /* ||
                  korisnik !== podaciUputnice.kreirano_korisnik ||
                  podaciUputnice.vrsta === 2 */
                ? true
                : false
            }
            onClick={() => setOtvoriPrintOvjere(true)}
          >
            ŠIFRIRANJE
          </button>
          <button
            disabled={
              odabraniNalog.pretrage.length === 0
                ? true
                : pacijentPodaci.status === 0 ||
                  pacijentPodaci.status === 2 /* ||
                  korisnik !== podaciUputnice.kreirano_korisnik ||
                  podaciUputnice.vrsta === 2 */
                ? true
                : false
            }
            onClick={() => setOtvoriPrintUplatnice(true)}
          >
            UPLATNICA
          </button>
        </div>
      </Drawer>
      {/*  <Drawer
        open={isDodajDrawerOpen}
        onClose={toggleDodajDrawer}
        direction="top"
        size="350px"
        className="draw_backdrop"
      >
        <div className="draw_menu">
          <p>DODAJ NOVU LABORATORIJSKU PRETRAGU U POSTOJEĆI RASPORED</p>
          <PretragaUnosForm />
        </div>
      </Drawer> */}
    </div>
  );
};

export default IzborAnaliza;
