import React, { useEffect, useState, useRef, Fragment } from "react";
//import { useStore } from "../../store";
import "./DetaljiUputnice.css";
import { Form, useForm } from "../UI/Forms/useForm";
import dayjs from "dayjs";
import "dayjs/locale/sr";
import randn from "randn";
//import Grid from "@mui/material/Grid";
import Controls from "../UI/Controls/Controls";
import Popup from "../UI/Forms/Popup";
import {
  Button,
  TextField,
  Box,
  Modal,
  Divider,
  List,
  ListItem,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import PuffLoader from "react-spinners/PuffLoader";
import { debounce } from "lodash";
import { podaciPacijenta, podaciUputnice } from "../util/utility";
//import { useQueryClient } from "@tanstack/react-query";

const DetaljiUputnice = ({
  edit,
  title,
  closeModal,
  sesija,
  klinike,
  odjeli,
  recordForEdit, //podaci uputnice
  doktori,
  uputio,
  opstine,
  identifikatori,
  osnoviOslobadjanja,
  osnovOsiguranja,
  notifikacija,
  dijagnozaMKB,
  povuciEpizodu,
  dataUpdate,
}) => {
  const [pojamTrazi, setPojamTrazi] = useState("");
  const [pronadjeniPacijenti, setPronadjeniPacijenti] = useState([]);
  const [openListaModal, setOpenListaModal] = useState(false);
  const [existence, setExistence] = useState(false);
  const [loadingProvjera, setLoadingProvjera] = useState(false);
  const [loadingFondProvjera, setLoadingFondProvjera] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDetalji, setLoadingDetalji] = useState(false);
  //const queryClient = useQueryClient();
  //const korisnik = useStore((store) => store.korisnik);

  const isUnos = useRef(false);

  const polovi = [
    { value: 1, label: "M" },
    { value: 0, label: "Z" },
  ];
  const vidOsiguranja = [
    { value: 0, label: "Neosiguran" },
    { value: 1, label: "OB" },
    { value: 6, label: "OZ" },
  ];

  const initialFValues = {
    //id: "",
    vrsta: 1,
    prioritet: 3,
    broj: "", //broj protokol redomata
    broj_epizode: "",
    broj_protokola: "",
    status: "",
    datum_uputnice: dayjs(),
    // datum_kraj: dayjs(),
    datum_uzorak: dayjs(),
    kreirano_korisnik: sesija.id_korisnika,
    dijagnoza_id: "",
    dijagnoza_sifra: "",
    opstina: "",
    opstina_id: "",
    jmbg: "",
    jmbg_majka: "",
    prezime: "",
    ime: "",
    ime_roditelja: "",
    datum_rodjenja: null, //dayjs(),
    pol: "",
    adresa_pacijenta: "",
    po_ugovoru: false,
    komerc_placanje: false,
    bez_participacije: false,
    osnov_oslobadjanja: "",
    // fiskalizovan: '',
    //fiskalni_broj: "",
    napomena: "",
    uputio: "",
    vid_osiguranja: "",
    status_osiguranja: "",
    kategorija_osiguranja: "",
    mkb: "",
    skladiste: 12044,
    skladiste_grupa: 1204,
    cache_id: "",
    identifikator: 1,
    telefon: "",
    email: "",
    diureza: "",
    tezina_pacijenta: "",
    visina_pacijenta: "",
    klijent_token: randn(18),
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("broj" in fieldValues && values.vrsta === 1) {
      temp.broj =
        fieldValues.broj.length < 6
          ? "Broj mora imati 6 ili više cifara"
          : fieldValues.broj.length > 32
          ? "Unesite max 32-cifreni broj"
          : "";
    }
    if ("jmbg" in fieldValues) {
      temp.jmbg =
        fieldValues.jmbg.length < 32 &&
        (values.po_ugovoru === "" || values.po_ugovoru === false)
          ? ""
          : "Unesite max 32 karaktera ";
    }
    if ("pol" in fieldValues) {
      temp.pol = values.pol !== "" ? "" : "Obavezno polje.";
    }
    if ("prezime" in fieldValues) {
      temp.prezime =
        fieldValues.prezime.length >= 3
          ? fieldValues.prezime.length < 255
            ? ""
            : "Unesite max 255 karaktera"
          : "Minimum 3 slova";
    }
    if ("ime" in fieldValues) {
      temp.ime =
        fieldValues.ime.length >= 3
          ? fieldValues.ime.length < 255
            ? ""
            : "Unesite max 255 karaktera"
          : "Minimum 3 slova";
    }
    if ("ime_roditelja" in fieldValues) {
      const imeRoditelja = fieldValues.ime_roditelja;
      const isOnlyLetters = /^[A-Za-zčćžšđČĆŽŠĐ\s]+$/.test(imeRoditelja);
      temp.ime_roditelja =
        imeRoditelja.length >= 3 && isOnlyLetters
          ? imeRoditelja.length <= 255
            ? ""
            : "Max 255 slova, samo slova"
          : "Minimum 3 slova, samo slova";
    }
    if ("napomena" in fieldValues) {
      temp.napomena =
        fieldValues.napomena.length < 255 ? "" : "Unesite max 255 karaktera";
    }
    if ("jmbg_majka" in fieldValues) {
      temp.jmbg_majka =
        fieldValues.jmbg_majka.length < 32 ? "" : "Unesite max 32 karaktera ";
    }
    if ("adresa_pacijenta" in fieldValues) {
      temp.adresa_pacijenta =
        fieldValues.adresa_pacijenta.length < 255
          ? ""
          : "Unesite max 255 karaktera ";
    }
    if ("telefon" in fieldValues) {
      temp.telefon =
        fieldValues.telefon.length < 255 ? "" : "Unesite max 255 karaktera ";
    }
    if ("email" in fieldValues) {
      temp.email =
        fieldValues.email.length < 255 ? "" : "Unesite max 255 karaktera ";
    }
    if ("diureza" in fieldValues) {
      temp.diureza =
        fieldValues.diureza.length < 8 ? "" : "Unesite max 8-cifreni broj ";
    }
    if ("tezina_pacijenta" in fieldValues) {
      temp.tezina_pacijenta =
        fieldValues.tezina_pacijenta.length < 8
          ? ""
          : "Unesite max 8-cifreni broj ";
    }
    if ("visina_pacijenta" in fieldValues) {
      temp.visina_pacijenta =
        fieldValues.visina_pacijenta.length < 8
          ? ""
          : "Unesite max 8-cifreni broj ";
    }
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    handleSGChange,
    handleSkladisteChange,
    handleKategorijaChange,
    handleOpstinaChange,
    handleIdentifikatorChange,
    handleUputioChange,
    handleOslobadjanjeChange,
    handleDijagnozaChange,
    validateOnSubmit,
    isDirty,
  } = useForm(initialFValues, true, validate);

  const provjeraPacijenta = async () => {
    const newData = new URLSearchParams();
    newData.append("pacijent_ime", isNaN(pojamTrazi) ? pojamTrazi : "");
    newData.append(
      "pacijent_identifikator",
      isNaN(pojamTrazi) ? "" : pojamTrazi
    );
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=trazi_pacijenta`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: newData,
      }
    );
    if (response.status === 404) {
      notifikacija(
        true,
        "Pretraga nije uspjela, došlo je do greške!",
        "error",
        3000
      );
    }
    return await response.json();
  };

  /*   const isJmbgValid = (value) => {
      let jmbg = value.split("");
      if (jmbg.length === 13) {
        let kon = Number(jmbg[12]);
        let izrKon =
          11 -
          ((7 * (Number(jmbg[0]) + Number(jmbg[6])) +
            6 * (Number(jmbg[1]) + Number(jmbg[7])) +
            5 * (Number(jmbg[2]) + Number(jmbg[8])) +
            4 * (Number(jmbg[3]) + Number(jmbg[9])) +
            3 * (Number(jmbg[4]) + Number(jmbg[10])) +
            2 * (Number(jmbg[5]) + Number(jmbg[11]))) %
            11);
        if (izrKon > 9) {
          izrKon = 0;
        }
        if (izrKon === 0 && kon === 0) {
          //if (errorJmbg === true) setErrorJmbg(false);
          return true;
        } else if (izrKon >= 1 && izrKon <= 9 && izrKon === kon) {
          //if (errorJmbg === true) setErrorJmbg(false);
          return true;
        } else {
          //setErrorJmbg(true);
          return false;
        }
      } else {
        //setErrorJmbg(true);
        return false;
      }
    }; */

  const handleProvjera = () => {
    //console.log("pojamTrazi handle", pojamTrazi, pojamTrazi.length);
    if (!isNaN(pojamTrazi) && pojamTrazi.length < 7) {
      notifikacija(true, "Unesite minimalno sedam brojeva!", "error", 3000);
    } else if (isNaN(pojamTrazi) && pojamTrazi.length < 3) {
      notifikacija(true, "Unesite minimalno tri slova!", "error", 3000);
    } else {
      if (pronadjeniPacijenti.length > 0) setPronadjeniPacijenti([]);
      if (existence === true) setExistence(false);
      setLoadingProvjera(true);
      provjeraPacijenta().then((data) => {
        //console.log("data", data);
        if (data.podaci.length > 0) {
          setPronadjeniPacijenti(data.podaci);
          setOpenListaModal(true);
        } else {
          notifikacija(
            true,
            "Pacijent nije pronađen u bazi KIS-a!",
            "warning",
            2000
          );
          fondProvjera().then((r) => {
            //console.log("REZULTAT FONDPROVJERA", r);
            if (r.poruka !== "") {
              //ako pacijent nije pronađen u bazi fonda
              notifikacija(true, r.poruka, "warning", 4000);
              setLoadingFondProvjera(false);
            } else {
              upisiPacijenta(r.osiguranje, "osiguranje").then((res) => {
                //ako pacijent već postoji u bazi - MOŽDA IZBACITI VEĆ JE GORE PROVJERENO
                if (res.pacijent.poruka !== "") {
                  setExistence(true);
                  notifikacija(true, res.pacijent.poruka, "warning", 3000);
                }
                updateCache(
                  r.osiguranje[0].fzors_osiguranik_jmbg,
                  res.pacijent.pid === undefined
                    ? res.pacijent.podaci.data[0][0]
                    : res.pacijent.pid
                ).then(() => {
                  handlePacijent(
                    res.pacijent.pid === undefined
                      ? res.pacijent.podaci.data[0][0]
                      : res.pacijent.pid,
                    r.osiguranje[0].fzors_osiguranik_jmbg
                  ).then(() => {
                    setLoadingFondProvjera(false);
                  });
                });
              });
            }
          });
        }
        setLoadingProvjera(false);
      });
    }
  };

  const detaljiPacijenta = async (id, jmbg) => {
    setLoadingDetalji(true);
    const newData = new URLSearchParams();
    newData.append("pacijent_uid", id);
    newData.append("pacijent_identifikator", jmbg);
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=detalji_pacijenta`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: newData,
      }
    );
    if (response.status === 404) {
      notifikacija(
        true,
        "Podaci o pacijentu nisu vraćeni, došlo je do greške!",
        "error",
        3000
      );
    }
    setLoadingDetalji(false);
    return await response.json();
  };

  const handlePacijent = async (id, jmbg) => {
    return detaljiPacijenta(id, jmbg).then((data) => {
      //console.log("DATA detaljiPacijenta", data);
      if (data.detalji[0].status_osiguranja === "1") {
        const razlikaUGodinama = dayjs().diff(
          dayjs(data.detalji[0].datum_rodjenja),
          "years"
        );
        //console.log("razlika u godinama", razlikaUGodinama);
        if (razlikaUGodinama <= 18 || razlikaUGodinama >= 65) {
          data.detalji[0].vid_osiguranja = 1;
          data.detalji[0].bez_participacije = true;
          if (razlikaUGodinama <= 18) {
            data.detalji[0].osnov_oslobadjanja = 81;
          } else if (razlikaUGodinama >= 65) {
            data.detalji[0].osnov_oslobadjanja = 82;
          }
        } else {
          data.detalji[0].vid_osiguranja = 6;
        }
      } else {
        data.detalji[0].vid_osiguranja = 0;
        data.detalji[0].komerc_placanje = true;
      }
      if (data.poruka === "") {
        const obPripadnici = [
          9, 13, 14, 20, 38, 57, 58, 101, 102, 103, 104, 105, 106, 107, 108,
          109, 111, 112, 113,
        ];
        setValues({
          ...initialFValues,
          broj: values.broj !== undefined ? values.broj : "",
          ...data.detalji[0],
          prioritet: values.prioritet,
          datum_rodjenja: dayjs(data.detalji[0].datum_rodjenja),
          rok_osiguranja: dayjs(data.detalji[0].rok_osiguranja),
          vid_osiguranja: obPripadnici.includes(
            Number(data.detalji[0].kategorija_osiguranja)
          )
            ? 1
            : data.detalji[0].bez_participacije === true
            ? 1
            : data.detalji[0].status_osiguranja === "1"
            ? 6
            : 0,
          cache_id: data.cache_id ? data.cache_id : "",
          napomena:
            values.napomena !== "" ? values.napomena : initialFValues.napomena, //da ostane napomena ako je unijeta prije provjere osiguranja
        });
      } else {
        notifikacija(true, data.poruka, "error", 3000);
      }
      if (!existence) setExistence(true);
    });
  };

  const handleNovaEpizoda = async (id) => {
    if (values.vrsta === 2) return;
    const newData = new URLSearchParams();
    newData.append("pacijent_uid", id === undefined ? values.id_pacijenta : id);
    newData.append("vid_osiguranja", values.vid_osiguranja);
    newData.append("kategorija_osiguranja", values.kategorija_osiguranja);
    newData.append("vrsta", values.vrsta);
    newData.append("uputna_dijagnoza", values.mkb);
    newData.append("id_korisnika", sesija.id_korisnika);
    newData.append("ljekar_sifra", values.uputio);
    newData.append("status_osiguranja", values.status_osiguranja);
    newData.append("fond_cache_id", values.cache_id);
    const response = await fetch(`../rpc/laboratorija.cfc?method=new_epizoda`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: newData,
    });
    if (response.ok) {
      return await response.json();
    } else {
      notifikacija(
        true,
        "Epizoda nije kreirana, došlo je do greške!",
        "error",
        3000
      );
    }
  };

  const postUputnicaData = async () => {
    const newData = new URLSearchParams();
    newData.append("id", values.id);
    newData.append(
      "datum_uputnice",
      dayjs(values.datum_uputnice).format("DD.MM.YYYY HH:mm:ss")
    );
    newData.append(
      "datum_uzorak",
      dayjs(values.datum_uzorak).format("DD.MM.YYYY HH:mm:ss")
    );
    newData.append("prioritet", values.prioritet);
    //newData.append("po_ugovoru",values.po_ugovoru || values.po_ugovoru === 1 ? 1 : 0);
    newData.append("po_ugovoru", Number(values.po_ugovoru));
    newData.append("vrsta", values.vrsta);
    //newData.append("komerc_placanje",values.komerc_placanje || values.komerc_placanje === 1 ? 1 : 0);
    newData.append("komerc_placanje", Number(values.komerc_placanje));
    newData.append("ime", values.ime);
    newData.append("prezime", values.prezime);
    newData.append("pol", values.pol);
    newData.append("ime_roditelja", values.ime_roditelja);
    newData.append("jmbg", values.jmbg);
    newData.append(
      "datum_rodjenja",
      dayjs(values.datum_rodjenja).format("DD.MM.YYYY")
    );
    newData.append("status_osiguranja", values.status_osiguranja);
    //newData.append("bez_participacije",values.bez_participacije || values.bez_participacije === 1 ? 1 : 0);
    newData.append("bez_participacije", Number(values.bez_participacije));
    newData.append("osnov_oslobadjanja", values.osnov_oslobadjanja);
    newData.append("vid_osiguranja", values.vid_osiguranja);
    newData.append("kategorija_osiguranja", values.kategorija_osiguranja);
    newData.append("naziv_kategorije_osig", values.naziv_kategorije_osig);
    newData.append("uputio", values.uputio);
    newData.append("skladiste_grupa", values.skladiste_grupa);
    newData.append("skladiste", values.skladiste);
    newData.append("protokol", values.broj);
    newData.append("dijagnoza_id", values.dijagnoza_id);
    newData.append("dijagnoza_sifra", values.dijagnoza_sifra);
    newData.append("dijagnoza_opis", values.dijagnoza_opis);
    newData.append("napomena", values.napomena);
    newData.append("jmbg_majka", values.jmbg_majka);
    newData.append("diureza", values.diureza);
    newData.append("tezina", values.tezina_pacijenta);
    newData.append("visina", values.visina_pacijenta);

    const response = await fetch(
      `../rpc/laboratorija.cfc?method=izmjena_podataka_uputnice`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: newData,
      }
    );
    if (response.ok) {
      closeModal();
      notifikacija(
        true,
        "Izmjene podataka je uspješno sačuvana !",
        "success",
        3000
      );
      dataUpdate(values.id); // update podataka uputnice
      //queryClient.invalidateQueries({ queryKey: ["uputnice"] });
    } else {
      notifikacija(
        true,
        "Izmjena podataka nije sačuvana, došlo je do greške!",
        "error",
        3000
      );
    }
    return await response.json();
  };

  const provjeraEpizode = async () => {
    const newData = new URLSearchParams();
    newData.append("id_epizode", values.broj_epizode);
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=provjera_epizode`,
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

  const handleSubmit = debounce(async () => {
    if (isUnos.current) return;
    isUnos.current = true;
    //ev.preventDefault();
    if (existence && values.vrsta === 2 && values.broj_epizode !== "") {
      provjeraEpizode().then((r) => {
        //console.log("R PROVJERA EPIZODE", r, values.id_pacijenta);
        if (r.id_pacijenta.length > 0) {
          if (r.id_pacijenta[0].vrsta === 2) {
            if (r.id_pacijenta[0].id_pacijenta === values.id_pacijenta)
              return true;
            if (r.id_pacijenta[0].id_pacijenta !== values.id_pacijenta) {
              isUnos.current = false;
              notifikacija(
                true,
                "Epizoda nije od istog pacijenta!",
                "error",
                3500
              );
              return false;
            }
          } else {
            isUnos.current = false;
            notifikacija(true, "Epizoda nije bolnička !", "error", 3500);
            return false;
          }
        }
        if (r.id_pacijenta.length === 0) {
          notifikacija(true, "Epizoda ne postoji!", "error", 3500);
          return false;
        }
      });
      return;
    }
    await validateOnSubmit().then((isValidated) => {
      if (isValidated) {
        setLoadingSubmit(true);
        if (existence) {
          // OVDJE UPDATE PACIJENTA AKO POSTOJI
          let podaci_pacijenta = podaciPacijenta(values);
          //console.error("PODACI PACIJENTA 1", podaci_pacijenta);
          if (isDirty) {
            upisiPacijenta(podaci_pacijenta, "update");
          }
          handleNovaEpizoda().then((res) => {
            let podaci_uputnice = podaciUputnice(values, {
              id: values.vrsta === 1 ? res.epizoda_id : values.broj_epizode,
            });
            //console.warn("PODACI_UPUTNICE DETALJI UPUTNICE SLANJE-1",podaci_uputnice);
            povuciEpizodu(podaci_uputnice); // kreiranje uputnice
            isUnos.current = false;
            setLoadingSubmit(false);
          });
        } else {
          let podaci_pacijenta = podaciPacijenta(values, { pacijent_uid: 0 });
          //console.error("PODACI PACIJENTA 2", podaci_pacijenta);
          upisiPacijenta(podaci_pacijenta, "rucno").then((response) => {
            //console.log("response upisiPacijenta", response);
            //ako pacijent već postoji u bazi
            if (response.pacijent.poruka !== "") {
              setExistence(true);
              notifikacija(true, response.pacijent.poruka, "error", 3000);
              isUnos.current = false;
              setLoadingSubmit(false);
            } else {
              //ako pacijent nije pronađen u bazi fonda
              //setValues({ ...values, id_pacijenta: response.pacijent.pid });
              handleNovaEpizoda(response.pacijent.pid).then((res) => {
                let podaci_uputnice = podaciUputnice(values, {
                  id: values.vrsta === 1 ? res.epizoda_id : values.broj_epizode,
                });
                povuciEpizodu(podaci_uputnice); //kreiranje uputnice
                //console.warn("PODACI_UPUTNICE DETALJI UPUTNICE SLANJE-2",podaci_uputnice);
                isUnos.current = false;
                setLoadingSubmit(false);
              });
            }
          });
        }
      } else {
        isUnos.current = false;
        notifikacija(
          true,
          "Molimo ispravno popunite tražene podatke!",
          "error",
          3000
        );
      }
    });
  }, 100);

  const handleUpdateSubmit = debounce(async () => {
    if (isUnos.current) return;
    isUnos.current = true;
    //ev.preventDefault();
    await validateOnSubmit().then((isValidated) => {
      if (isValidated) {
        let update_podaci = podaciPacijenta(values);
        upisiPacijenta(update_podaci, "update").then(() => {
          postUputnicaData();
          isUnos.current = false;
        });
      } else {
        isUnos.current = false;
        notifikacija(
          true,
          "Molimo ispravno popunite tražene podatke!",
          "error",
          3000
        );
      }
    });
  }, 100);

  const preventDefaultHandler = (ev) => {
    ev.preventDefault();
  };

  const handlePojamTrazi = (pojam) => {
    if (pojam.startsWith("5885") || pojam.startsWith("8000")) {
      setValues({ ...values, identifikator: 5 });
    }
    setPojamTrazi(pojam);
    // DRUGI NAČIN if (pojam.slice(0, 4) === "5885")
  };

  const updateCache = async (jmbg, id_pacijenta) => {
    const newData = new URLSearchParams();
    newData.append("pacijent_identifikator", jmbg);
    newData.append("pacijent_uid", id_pacijenta);
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=cache_update`,
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

  const fondProvjera = async (id_pacijenta) => {
    const newData = new URLSearchParams();
    newData.append("korisnik_ime", sesija.ime_korisnika);
    newData.append("korisnik_sifra", sesija.sifra_korisnika);
    newData.append("pacijent_uid", id_pacijenta ? id_pacijenta : 0);
    newData.append("pacijent_identifikator", pojamTrazi);
    newData.append("pacijent_identifikator_vrsta", values.identifikator);
    newData.append("model_placanja", 1);
    newData.append("forsiraj_provjeru", 1);
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=fond_provjera`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: newData,
      }
    );
    if (response.ok) {
      return response.json();
    } else {
      notifikacija(
        true,
        "Pacijent sa ovim JMBG-om ne postoji u fondu!",
        "error",
        3000
      );
    }
  };

  const upisiPacijenta = async (podaci, tip) => {
    //console.log("upisiPacijenta", tip, podaci);
    const newData = new URLSearchParams();
    newData.append("korisnik_ime", sesija.ime_korisnika);
    newData.append("korisnik_sifra", sesija.sifra_korisnika);
    newData.append("pacijent_uid", tip === "update" ? podaci.pacijent_uid : 0);
    newData.append(
      "pacijent_identifikator",
      tip === "osiguranje"
        ? podaci[0].fzors_osiguranik_jmbg
        : podaci.pacijent_identifikator
    );
    newData.append(
      "pacijent_identifikator_vrsta",
      tip === "osiguranje" ? values.identifikator : podaci.identifikator
    );
    //newData.append("rfid", "");
    newData.append(
      "prezime",
      tip === "osiguranje" ? podaci[0].fzors_osiguranik_prezime : podaci.prezime
    );
    newData.append(
      "ime",
      tip === "osiguranje" ? podaci[0].fzors_osiguranik_ime : podaci.ime
    );
    newData.append(
      "ime_roditelja",
      tip === "rucno" || tip === "update" ? podaci.ime_roditelja : ""
    );
    newData.append(
      "pol",
      tip === "osiguranje"
        ? podaci[0].fzors_osiguranik_pol === "M"
          ? 1
          : 0
        : podaci.pol
    );
    //newData.append("krvna_grupa", "");
    //newData.append("rh_faktor", "");
    newData.append(
      "datum_rodjenja",
      tip === "osiguranje"
        ? podaci[0].fzors_osiguranik_datum_rodjenja
        : dayjs(podaci.datum_rodjenja).format("YYYY-MM-DD")
    );
    //newData.append("mjesto_rodjenja", "");
    newData.append(
      "opstina_id",
      tip === "osiguranje"
        ? podaci[0].fzors_osiguranik_opstina_sifra
        : podaci.opstina_id
    );
    newData.append(
      "opstina",
      tip === "osiguranje"
        ? podaci[0].fzors_osiguranik_opstina_naziv
        : podaci.opstina
    );
    //newData.append("mjesto", "");
    newData.append(
      "adresa",
      tip === "osiguranje"
        ? podaci[0].fzors_osiguranik_adresa
        : podaci.adresa_pacijenta
    );
    newData.append("telefon", tip === "osiguranje" ? "" : podaci.telefon);
    newData.append("email", tip === "osiguranje" ? "" : podaci.email);
    //newData.append("bracno_stanje", "");
    //newData.append("zanimanje", "");
    //newData.append("broj_kartona", "");
    //newData.append("datum_smrti", "");
    //newData.append("razlog_smrti", "");
    //newData.append("napomena", "");
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=upisi_pacijenta`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: newData,
      }
    );
    if (response.ok) {
      return response.json();
    } else {
      notifikacija(true, "Unos pacijenta u bazu nije uspio!", "error", 3000);
    }
  };

  const handleCloseListaModal = () => {
    setOpenListaModal(false);
  };

  const generisiJmbg = () => {
    let prviDio = dayjs(values.datum_rodjenja).format("DDMMYYYY");
    let modifiedString =
      prviDio.slice(0, 4) + prviDio.slice(5) + `${randn(5)}` + "X";
    setValues({
      ...values,
      identifikator: 5,
      jmbg: modifiedString /* `${randn(13)}`, */,
    });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: 900,
    maxHeight: "90vh",
    bgcolor: "background.paper",
    border: "1px solid var(--color-gray-50)",
    borderRadius: "var(--border-radius-small)",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    if (edit === false) return;
    if (recordForEdit !== null) {
      setValues({
        ...recordForEdit,
        datum_uputnice: dayjs(recordForEdit.datum_uputnice),
        datum_rodjenja: dayjs(recordForEdit.datum_rodjenja),
        rok_osiguranja: dayjs(recordForEdit.rok_osiguranja),
        datum_uzorak:
          recordForEdit.datum_uzorak !== ""
            ? dayjs(recordForEdit.datum_uzorak)
            : dayjs(new Date()),
        uputio: `${recordForEdit.uputio}`,
      });
    } // eslint-disable-next-line
  }, [recordForEdit, setValues]);

  //console.log("pronadjeniPacijenti",pronadjeniPacijenti,pronadjeniPacijenti.length);
  console.log("VALUES UPUTNICE", values, "existence", existence);
  //console.log("recordForEdit podaci uputnice", recordForEdit);
  //console.log("values za slanje", values);
  //console.log("errors", errors, Object.keys(errors).length);
  const uputnicaPolja = (
    <div className="pacijent_container">
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loadingDetalji && !loadingProvjera && !loadingFondProvjera}
        //onClick={handleClose}
      >
        <PuffLoader color="#fff" size={200} /* cssOverride={{ zIndex: 2 }} */ />
      </Backdrop>

      {!edit && (
        <div className="pozadina_polja provjera">
          <TextField
            variant="outlined"
            type="search"
            size="small"
            label={
              pojamTrazi !== "" && !isNaN(pojamTrazi) && pojamTrazi.length < 7
                ? "Minimalno sedam brojeva"
                : pojamTrazi !== "" &&
                  isNaN(pojamTrazi) &&
                  pojamTrazi.length < 3
                ? "Minimalno 3 slova!"
                : "JMBG / prezime ili ime"
            }
            name="provjera_pacijenta"
            sx={{ width: "280px" }}
            inputProps={{
              sx: {
                padding: "0.5vw 0.7vw !important",
                fontFamily: "Inter !important",
                fontSize: "0.85vw !important",
                fontWeight: "600 !important",
              },
            }}
            InputLabelProps={{
              sx: {
                fontFamily: "Inter !important",
                fontSize: "0.8vw !important",
              },
            }}
            value={pojamTrazi}
            onChange={(event) => handlePojamTrazi(event.target.value)}
            error={
              (pojamTrazi !== "" &&
                !isNaN(pojamTrazi) &&
                pojamTrazi.length < 7) ||
              (pojamTrazi !== "" && isNaN(pojamTrazi) && pojamTrazi.length < 3)
            }
          />
          <Button
            variant="contained"
            size="small"
            color="success"
            disabled={loadingProvjera /* || pojamTrazi.startsWith("8000") */}
            sx={{
              fontFamily: "Inter",
              fontSize: "clamp(0.75rem, calc(1vw - 0.15rem), 0.95rem)",
              //fontSize: "15px" /*  "0.83vw", */,
              //padding: "4px 12px" /* "0.2vw 0.7vw", */,
              "& .MuiButton-containedSizeSmall": {
                paddingInline: "min(10px, 0.5%) !important",
                paddingBlock: "min(4px, 0.1%) !important",
              },

              minWidth: "160px" /* "fit-content !important", */,
            }}
            onClick={handleProvjera}
          >
            {loadingProvjera === false && "PROVJERA OSIGURANJA"}
            {loadingProvjera ? (
              <CircularProgress size="22px" color="success" />
            ) : null}
          </Button>
          {/*<Button
            variant="contained"
            size="small"
            color="primary"
            disabled={loadingFondProvjera}
            sx={{
              fontFamily: "Inter",
              //fontSize: "15px" //"0.83vw", ,
              fontSize: "clamp(0.75rem, calc(1vw - 0.15rem), 0.95rem)",
              //padding: "4px 12px" //"0.2vw 0.7vw",
              minWidth: "155px" //"fit-content !important",
            }}
            onClick={handleFondProvjera}
          >
            {loadingFondProvjera === false && "FOND PROVJERA"}
            {loadingFondProvjera ? <CircularProgress size="22px" /> : null}
          </Button>*/}
          <Button
            variant="outlined"
            size="small"
            color="primary"
            sx={{
              fontFamily: "Inter",
              //fontSize: "15px" /* "0.83vw", */,
              fontSize: "clamp(0.75rem, calc(1vw - 0.15rem), 0.95rem)",
              //padding: "4px 12px" /* "0.2vw 0.7vw", */,
            }}
            disabled={pronadjeniPacijenti.length === 0}
            onClick={() => setOpenListaModal(true)}
          >
            LISTA PRONAĐENIH
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="warning"
            sx={{
              fontFamily: "Inter",
              //fontSize: "15px" /* "0.83vw", */,
              fontSize: "clamp(0.75rem, calc(1vw - 0.15rem), 0.95rem)",
              //padding: "4px 12px" /* "0.2vw 0.7vw", */,
            }}
            disabled={
              ((values.po_ugovoru === "" || values.po_ugovoru === false) &&
                (values.komerc_placanje === "" ||
                  values.komerc_placanje === false)) ||
              values.datum_rodjenja === null
            }
            onClick={generisiJmbg}
          >
            GENERIŠI JMBG
          </Button>
        </div>
      )}
      <Form onSubmit={preventDefaultHandler}>
        <div className="podaci_container">
          <label>
            <p className="pacijent_label">Podaci pacijenta i osiguranja:</p>
            <div className="pozadina_polja maticni_podaci">
              <div className="prvi_red">
                <Controls.DatePicker
                  name="datum_uputnice"
                  label="Datum uputnice:"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  } // NE ŠALJE SE ODAVDE DATUM UNOSI BACKEND NA SERVERU
                  views={["year", "month", "day"]}
                  value={values.datum_uputnice}
                  onChange={handleInputChange}
                />

                <Controls.DateTimePicker
                  name="datum_uzorak"
                  label="Datum i vrijeme uzorka:"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  } // NE ŠALJE SE ODAVDE DATUM UNOSI BACKEND NA SERVERU
                  views={["year", "month", "day", "hours", "minutes"]}
                  value={values.datum_uzorak}
                  onChange={handleInputChange}
                />

                <Controls.Autocomplete
                  //disablePortal
                  size="small"
                  blurOnSelect
                  id="identifikator"
                  name="identifikator"
                  disabled={edit}
                  //onFocus={() => validate({ identifikator: values.identifikator})}
                  options={identifikatori.map((i) => ({
                    value: i.id,
                    label: i.naziv,
                  }))}
                  getOptionLabel={(option) => `${option.label}`}
                  openOnFocus={true}
                  value={
                    values.identifikator === ""
                      ? null
                      : (() => {
                          const identifikator = identifikatori.find(
                            (i) => i.id === Number(values.identifikator)
                          );
                          return identifikator
                            ? {
                                value: identifikator.id,
                                label: identifikator.naziv,
                              }
                            : null;
                        })()
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      //label="Vrsta identifikatora:"
                      label={
                        <span style={{ fontWeight: "bold", color: "#4f534e" }}>
                          Vrsta identifikatora:
                        </span>
                      }
                      error={errors.identifikator}
                      helperText={errors.identifikator}
                    />
                  )}
                  sx={(theme) => ({
                    display: "flex",
                    background: "#f6f7f6 !important",
                    "&.MuiAutocomplete-input": {
                      color: theme.palette.error.main,
                    },
                  })}
                  onChange={(e, newValue) =>
                    handleIdentifikatorChange(e, newValue)
                  }
                />
              </div>

              <div className="drugi_red">
                <Controls.RadioGroup
                  label="Prioritet:"
                  name="prioritet"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  value={values.prioritet}
                  onChange={(ev) =>
                    setValues({ ...values, prioritet: +ev.target.value })
                  }
                  items={[
                    { id: 1, title: "Hitno" },
                    { id: 3, title: "Redovno" },
                  ]}
                />

                <Controls.Checkbox
                  name="po_ugovoru"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik ||
                      values.komerc_placanje === 1 ||
                      values.komerc_placanje)
                      ? true
                      : false
                  }
                  label="Po ugovoru"
                  value={
                    values.po_ugovoru === 1 || values.po_ugovoru ? true : false
                  }
                  onChange={handleInputChange}
                />

                <Controls.Checkbox
                  name="komerc_placanje"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik ||
                      values.po_ugovoru === 1 ||
                      values.po_ugovoru)
                      ? true
                      : false
                  }
                  label="Plaćanje po komercijalnim cjenama"
                  value={
                    values.komerc_placanje === 1 || values.komerc_placanje
                      ? true
                      : false
                  }
                  onChange={handleInputChange}
                />
              </div>

              <div className="treci_red">
                <Controls.RadioGroup
                  label="Vrsta:"
                  name="vrsta"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  value={values.vrsta}
                  onChange={(ev) =>
                    setValues({ ...values, vrsta: +ev.target.value })
                  }
                  items={[
                    { id: 1, title: "Ambulantna" },
                    { id: 2, title: "Bolnička" /*  disabled: true  */ },
                  ]}
                />

                <Controls.Input
                  name="jmbg"
                  //label="JMBG:"
                  label={
                    <span style={{ fontWeight: "bold", color: "#3e92cc" }}>
                      JMBG
                    </span>
                  }
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  value={values.jmbg}
                  onChange={handleInputChange}
                  onFocus={() => validate({ jmbg: values.jmbg })}
                  error={errors.jmbg}
                  size="small"
                />
                <Controls.DatePicker
                  disabled={
                    values.status !== "" &&
                    (existence ||
                      values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  name="datum_rodjenja"
                  //label="Datum rođenja"
                  label={
                    <span style={{ fontWeight: "bold", color: "#3e92cc" }}>
                      Datum rođenja
                    </span>
                  }
                  views={["year", "month", "day"]}
                  value={values.datum_rodjenja}
                  onChange={handleInputChange}
                  error={errors.datum_rodjenja}
                />
              </div>

              <div className="cetvrti_red">
                <Controls.Input
                  name="prezime"
                  //label="Prezime:"
                  label={
                    <span style={{ fontWeight: "bold", color: "#3e92cc" }}>
                      Prezime
                    </span>
                  }
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  value={values.prezime}
                  onChange={handleInputChange}
                  onFocus={() => validate({ prezime: values.prezime })}
                  error={errors.prezime}
                  size="small"
                />
                <Controls.Input
                  name="ime"
                  //label="Ime:"
                  label={
                    <span style={{ fontWeight: "bold", color: "#3e92cc" }}>
                      Ime
                    </span>
                  }
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  value={values.ime}
                  onChange={handleInputChange}
                  onFocus={() => validate({ ime: values.ime })}
                  error={errors.ime}
                  size="small"
                />
                <Controls.Select
                  name="pol"
                  //label="Pol"
                  label={
                    <span style={{ fontWeight: "bold", color: "#3e92cc" }}>
                      Pol
                    </span>
                  }
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  value={values.pol}
                  onFocus={() => validate({ pol: values.pol })}
                  onChange={(ev) => handleInputChange(ev)}
                  options={polovi}
                  error={errors.pol}
                />
                <Controls.Input
                  name="ime_roditelja"
                  //label="Ime roditelja:"
                  label={
                    <span style={{ fontWeight: "bold", color: "#3e92cc" }}>
                      Ime roditelja
                    </span>
                  }
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  value={values.ime_roditelja}
                  onChange={handleInputChange}
                  onFocus={() =>
                    validate({ ime_roditelja: values.ime_roditelja })
                  }
                  error={errors.ime_roditelja}
                  size="small"
                />
              </div>

              <div className="peti_red">
                <Controls.Checkbox
                  name="status_osiguranja"
                  label="Osiguran"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  value={
                    values.status_osiguranja === 1 ||
                    values.status_osiguranja === "1" ||
                    values.status_osiguranja === true
                      ? true
                      : false
                  }
                  //onChange={handleInputChange} //NE MOŽE SE MEJENJATI STATUS OSIGURANJA
                />

                <Controls.Checkbox
                  name="bez_participacije"
                  label="Oslobođen participacije"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik ||
                      values.po_ugovoru === 1 ||
                      values.po_ugovoru === true ||
                      values.komerc_placanje === 1 ||
                      values.komerc_placanje === true ||
                      values.status_osiguranja === "0" ||
                      values.status_osiguranja === "")
                  }
                  value={
                    values.bez_participacije === 1 || values.bez_participacije
                      ? true
                      : false
                  }
                  onChange={handleInputChange}
                />
                <Controls.Autocomplete
                  //disablePortal
                  size="small"
                  blurOnSelect
                  id="osnov_oslobadjanja"
                  name="osnov_oslobadjanja"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik ||
                      values.bez_participacije === 0 ||
                      !values.bez_participacije)
                      ? true
                      : false
                  }
                  getOptionLabel={(option) =>
                    `${option.sifra} - ${option.label}`
                  }
                  openOnFocus={true}
                  value={
                    values.osnov_oslobadjanja === ""
                      ? null
                      : (() => {
                          const osnov = osnoviOslobadjanja.find(
                            (osnov) =>
                              osnov.osnov_id === values.osnov_oslobadjanja
                          );
                          return osnov
                            ? {
                                value: osnov.osnov_id,
                                sifra: osnov.fond_sifra,
                                label: osnov.kategorija,
                              }
                            : null;
                        })()
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      //label="Osnov oslobađanja"
                      label={
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "var(--color-primary-950)",
                          }}
                        >
                          Osnov oslobađanja
                        </span>
                      }
                      error={errors.osnov_oslobadjanja}
                      helperText={errors.osnov_oslobadjanja}
                    />
                  )}
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    width: "70%",
                    background: "#edecff !important",
                  }}
                  onChange={(e, newValue) =>
                    handleOslobadjanjeChange(e, newValue)
                  }
                  options={osnoviOslobadjanja
                    .sort((a, b) => Number(a.fond_sifra) - Number(b.fond_sifra))
                    .map((osnov) => ({
                      value: osnov.osnov_id,
                      sifra: osnov.fond_sifra,
                      label: osnov.kategorija,
                    }))}
                />
              </div>

              <div className="sesti_red">
                <Controls.Select
                  name="vid_osiguranja"
                  //label="Vid osiguranja"
                  label={
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "var(--color-primary-950)",
                      }}
                    >
                      Vid osiguranja
                    </span>
                  }
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  sx={{ maxWidth: "160px !important" }}
                  value={values.vid_osiguranja}
                  onFocus={() =>
                    validate({ vid_osiguranja: values.vid_osiguranja })
                  }
                  onChange={(ev) => handleInputChange(ev)}
                  options={vidOsiguranja}
                  error={errors.vid_osiguranja}
                ></Controls.Select>

                <Controls.Autocomplete
                  //disablePortal
                  size="small"
                  blurOnSelect
                  id="kategorija_osiguranja"
                  name="kategorija_osiguranja"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  getOptionLabel={(option) =>
                    `${option.value} - ${option.label}`
                  }
                  onFocus={() =>
                    validate({
                      kategorija_osiguranja: values.kategorija_osiguranja,
                    })
                  }
                  openOnFocus={true}
                  value={
                    values.kategorija_osiguranja === ""
                      ? null
                      : (() => {
                          const kategorija = osnovOsiguranja.find(
                            (osnov) =>
                              osnov.kategorija ===
                              Number(values.kategorija_osiguranja)
                          );
                          return kategorija
                            ? {
                                value: kategorija.kategorija,
                                label: kategorija.naziv_osnove,
                              }
                            : null;
                        })()
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      //label="Kategorija osiguranja"
                      label={
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "var(--color-primary-950)",
                          }}
                        >
                          Kategorija osiguranja
                        </span>
                      }
                      error={errors.kategorija_osiguranja}
                      helperText={errors.kategorija_osiguranja}
                    />
                  )}
                  sx={{ display: "flex", background: "#edecff !important" }}
                  onChange={(e, newValue) =>
                    handleKategorijaChange(e, newValue)
                  }
                  options={osnovOsiguranja.map((osnov) => ({
                    value: osnov.kategorija,
                    label: osnov.naziv_osnove,
                  }))}
                />
                <Controls.Autocomplete
                  //disablePortal
                  size="small"
                  blurOnSelect
                  id="uputio"
                  name="uputio"
                  disabled={
                    values.status !== "" &&
                    (values.vrsta === 2 ||
                      values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                      ? true
                      : false
                  }
                  getOptionLabel={(option) => `${option.label}`}
                  openOnFocus={true}
                  value={
                    values.uputio === ""
                      ? null
                      : values.vrsta === 2
                      ? (() => {
                          const uputio_je = uputio.find(
                            (doktor) => doktor.value === values.uputio
                          );
                          return uputio_je
                            ? {
                                value: uputio_je.value,
                                label: uputio_je.ime,
                              }
                            : null;
                        })()
                      : (() => {
                          const uputio = doktori.find(
                            (doktor) => doktor.value === values.uputio
                          );
                          return uputio
                            ? {
                                value: uputio.value,
                                label: uputio.ime,
                              }
                            : null;
                        })()
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Uputio ljekar"
                      error={errors.uputio}
                      helperText={errors.uputio}
                    />
                  )}
                  sx={{ display: "flex", maxWidth: "220px" }}
                  onChange={(e, newValue) => handleUputioChange(e, newValue)}
                  options={
                    values.vrsta === 2
                      ? uputio.map((doktor) => ({
                          value: doktor.value,
                          label: doktor.ime,
                        }))
                      : doktori.map((doktor) => ({
                          value: doktor.value,
                          label: doktor.ime,
                        }))
                  }
                />
              </div>

              <div className="sedmi_red">
                <Controls.Autocomplete
                  //disablePortal
                  size="small"
                  blurOnSelect
                  id="skladiste_grupa"
                  name="skladiste_grupa"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  getOptionLabel={(option) =>
                    `${option.value} - ${option.label}`
                  }
                  openOnFocus={true}
                  value={
                    values.skladiste_grupa === ""
                      ? null
                      : (() => {
                          const klinika = klinike.find(
                            (klinika) => klinika.id === values.skladiste_grupa
                          );
                          return klinika
                            ? {
                                value: klinika.id,
                                label: klinika.naziv,
                              }
                            : null;
                        })()
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Klinika"
                      error={errors.skladiste_grupa}
                      helperText={errors.skladiste_grupa}
                    />
                  )}
                  sx={{
                    display: "flex",
                    width: "50%" /* background: "#fae9ea" */,
                  }}
                  onChange={(e, newValue) => handleSGChange(e, newValue)}
                  options={klinike.map((klinika) => ({
                    value: klinika.id,
                    label: klinika.naziv,
                  }))}
                />
                <Controls.Autocomplete
                  //disablePortal
                  size="small"
                  blurOnSelect
                  id="skladiste"
                  name="skladiste"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  getOptionLabel={(option) =>
                    `${option.value} - ${option.label}`
                  }
                  openOnFocus={true}
                  value={
                    values.skladiste === ""
                      ? null
                      : (() => {
                          const odjel = odjeli.find(
                            (odjel) => odjel.id === values.skladiste
                          );
                          return odjel
                            ? {
                                value: odjel.id,
                                label: odjel.naziv,
                              }
                            : null;
                        })()
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Odjel"
                      error={errors.skladiste}
                      helperText={errors.skladiste}
                    />
                  )}
                  sx={{
                    display: "flex",
                    width: "50%" /* background: "#fae9ea" */,
                  }}
                  onChange={(e, newValue) => handleSkladisteChange(e, newValue)}
                  options={odjeli.map((odjel) => ({
                    value: odjel.id,
                    label: odjel.naziv,
                  }))}
                />
              </div>

              <div>
                <Controls.Input
                  name="broj"
                  label="Protokol"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  value={values.broj}
                  onChange={handleInputChange}
                  onFocus={() => validate({ broj: values.broj })}
                  error={errors.broj}
                  size="small"
                />
                <Controls.Autocomplete
                  //disablePortal
                  size="small"
                  blurOnSelect
                  id="dijagnoza_sifra"
                  name="dijagnoza_sifra"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  options={dijagnozaMKB}
                  getOptionLabel={(option) =>
                    `${option.value} - fond šifra ${option.label}`
                  }
                  openOnFocus={true}
                  sx={{
                    display: "flex",
                    width: "25%",
                    background: "#fae9ea" /*background: "#edafb8" */,
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="MKB"
                      error={errors.dijagnoza_sifra}
                      helperText={errors.dijagnoza_sifra}
                    />
                  )}
                  value={
                    values.dijagnoza_id === ""
                      ? null
                      : (() => {
                          const mkb = dijagnozaMKB.find(
                            (dijagnoza) => dijagnoza.id === values.dijagnoza_id
                          );
                          return mkb
                            ? {
                                value: mkb.value,
                                id: mkb.id,
                                label: mkb.label,
                                participacija: mkb.participacija,
                              }
                            : null;
                        })()
                  }
                  onChange={(e, newValue) => {
                    handleDijagnozaChange(e, newValue);
                  }}
                />
              </div>

              <div>
                <Controls.Input
                  name="napomena"
                  label="Napomena"
                  size="small"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  value={values.napomena}
                  onChange={handleInputChange}
                  error={errors.napomena}
                />
              </div>

              <div>
                <Controls.Input
                  name="jmbg_majka"
                  label="JMBG majka"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  value={values.jmbg_majka}
                  onChange={handleInputChange}
                  error={errors.jmbg_majka}
                  size="small"
                />

                <Controls.Input
                  name="broj_epizode"
                  disabled={
                    !edit
                      ? values.vrsta === 1
                        ? true
                        : existence
                        ? false
                        : true
                      : true
                  }
                  label="Broj epizode"
                  value={values.broj_epizode}
                  onChange={handleInputChange}
                  error={errors.broj_epizode}
                  size="small"
                />

                <Controls.Input
                  name="broj_protokola"
                  disabled={true}
                  label="KIS protokol"
                  value={values.broj_protokola}
                  onChange={handleInputChange}
                  error={errors.broj_protokola}
                  size="small"
                />
              </div>

              <div className="button_container">
                <Controls.MyButton
                  onClick={closeModal}
                  text="Otkaži"
                  startIcon={
                    <CloseIcon sx={{ color: "var(--color-error-200)" }} />
                  }
                />
                <Controls.MyButton
                  onClick={edit ? handleUpdateSubmit : handleSubmit}
                  startIcon={
                    <DoneOutlineIcon
                      sx={{ color: "var(--color-primary-600)" }}
                    />
                  }
                  disabled={
                    values.status !== "" &&
                    (loadingSubmit ||
                      values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  type="submit"
                  text="Sačuvaj"
                  color="success"
                  loaderColor="error"
                  sacuvaj={true}
                  sx={(theme) => ({
                    color: theme.palette.grey[50],
                  })}
                  loading={loadingSubmit}
                />
              </div>
            </div>
          </label>
          <label>
            <p className="pacijent_label">Dodatni podaci:</p>
            <div className="pozadina_polja maticni_podaci">
              <div>
                <Controls.Input
                  name="osiguranje_status"
                  disabled={true}
                  label={
                    <span style={{ color: "#3e92cc" }}>Status osiguranja</span>
                  }
                  value={
                    values.status_osiguranja === 1 ||
                    values.status_osiguranja === "1" ||
                    values.status_osiguranja === true
                      ? "Osiguran"
                      : "Neosiguran"
                  }
                  size="small"
                />
                <Controls.DatePicker
                  disabled={true}
                  name="rok_osiguranja"
                  //label="Rok važenja osig."
                  label={
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "var(--color-primary-950)",
                      }}
                    >
                      Rok važenja osig.
                    </span>
                  }
                  views={["year", "month", "day"]}
                  value={values.rok_osiguranja}
                />
              </div>
              <div>
                <Controls.Autocomplete
                  //disablePortal
                  size="small"
                  blurOnSelect
                  id="opstina"
                  name="opstina"
                  disabled={
                    values.status !== "" &&
                    (edit ||
                      values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  options={opstine.map((opstina) => ({
                    value: opstina.id,
                    label: opstina.naziv,
                  }))}
                  getOptionLabel={(option) => `${option.label}`}
                  openOnFocus={true}
                  value={
                    values.opstina_id === ""
                      ? null
                      : (() => {
                          const opstina = opstine.find(
                            (o) => o.id === Number(values.opstina_id)
                          );
                          return opstina
                            ? {
                                value: opstina.id,
                                label: opstina.naziv,
                              }
                            : null;
                        })()
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Opština"
                      error={errors.opstina}
                      helperText={errors.opstina}
                    />
                  )}
                  sx={{ display: "flex" }}
                  onChange={(e, newValue) => handleOpstinaChange(e, newValue)}
                />
                <Controls.Input
                  name="nosilac_jmbg"
                  disabled={true}
                  InputLabelProps={{ shrink: Boolean(values.nosilac_jmbg) }}
                  label="Nosilac JMBG"
                  value={values.nosilac_jmbg}
                  onChange={handleInputChange}
                  size="small"
                />
              </div>
              <div>
                <Controls.Input
                  name="adresa_pacijenta"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  InputLabelProps={{ shrink: Boolean(values.adresa_pacijenta) }}
                  label="Adresa pacijenta"
                  value={values.adresa_pacijenta}
                  onChange={handleInputChange}
                  error={errors.adresa_pacijenta}
                  size="small"
                />
              </div>
              <div>
                <Controls.Input
                  name="telefon"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  InputLabelProps={{ shrink: Boolean(values.telefon) }}
                  label="Br. telefona"
                  value={values.telefon}
                  onChange={handleInputChange}
                  error={errors.telefon}
                  size="small"
                />
                <Controls.Input
                  name="email"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  InputLabelProps={{ shrink: Boolean(values.email) }}
                  label="Email"
                  value={values.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  size="small"
                />
              </div>
              <div>
                <Controls.Input
                  name="jib"
                  disabled={true}
                  InputLabelProps={{
                    shrink: Boolean(values.jib),
                  }}
                  sx={{ maxWidth: "35% !important" }}
                  label="JIB"
                  value={values.jib}
                  size="small"
                />
                <Controls.Input
                  name="naziv_obv"
                  disabled={true}
                  InputLabelProps={{ shrink: Boolean(values.naziv_obv) }}
                  label="Obveznik doprinosa"
                  value={values.naziv_obv}
                  size="small"
                />
              </div>
              <div>
                <Controls.Input
                  name="adresa_obveznika"
                  disabled={true}
                  InputLabelProps={{
                    shrink: Boolean(values.adresa_obveznika),
                  }}
                  sx={{ minWidth: "60% !important" }}
                  label="Adresa obveznika doprinosa"
                  value={values.adresa_obveznika}
                  size="small"
                />
                <Controls.Input
                  name="opstina_obveznika"
                  disabled={true}
                  InputLabelProps={{
                    shrink: Boolean(values.opstina_obveznika),
                  }}
                  label="Opština obveznika"
                  value={values.opstina_obveznika}
                  size="small"
                />
              </div>
              <div>
                <Controls.Input
                  name="sifra_djelatnosti"
                  disabled={true}
                  InputLabelProps={{ shrink: Boolean(values.obv_sifdel) }}
                  label="Šifra djelatnosti obveznika"
                  value={values.obv_sifdel}
                  size="small"
                />
                <Controls.Input
                  name="rbo"
                  disabled={true}
                  InputLabelProps={{ shrink: Boolean(values.rbo_broj) }}
                  label="RBO"
                  value={values.rbo_broj}
                  size="small"
                />
                <Controls.Input
                  name="broj_knjizice"
                  disabled={true}
                  InputLabelProps={{ shrink: Boolean(values.broj_knjizice) }}
                  label="Broj knjižice"
                  value={values.broj_knjizice}
                  size="small"
                />
              </div>
              <div>
                <Controls.Input
                  name="diureza"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  InputLabelProps={{ shrink: Boolean(values.diureza) }}
                  label="Diureza u ml"
                  value={values.diureza}
                  onChange={handleInputChange}
                  error={errors.diureza}
                  size="small"
                />
                <Controls.Input
                  name="tezina_pacijenta"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  InputLabelProps={{
                    shrink: Boolean(values.tezina_pacijenta !== ""),
                  }}
                  label="Težina u kg"
                  value={values.tezina_pacijenta}
                  onChange={handleInputChange}
                  error={errors.tezina_pacijenta}
                  size="small"
                />
                <Controls.Input
                  name="visina_pacijenta"
                  disabled={
                    values.status !== "" &&
                    (values.status > 0 ||
                      sesija.id_korisnika !== values.kreirano_korisnik)
                  }
                  InputLabelProps={{
                    shrink: Boolean(values.visina_pacijenta !== ""),
                  }}
                  label="Visina u cm"
                  value={values.visina_pacijenta}
                  onChange={handleInputChange}
                  error={errors.visina_pacijenta}
                  size="small"
                />
              </div>
              <div>
                <label>
                  <p className="porodicni">Porodični ljekar:</p>
                  <div
                    style={{
                      display: "flex",
                      paddingBottom: "0.5em",
                      gap: "0.3vw",
                    }}
                  >
                    <Controls.Input
                      name="id_porodicni"
                      disabled={true}
                      InputLabelProps={{ shrink: Boolean(values.id_porodicni) }}
                      label="ID ljekara"
                      value={values.id_porodicni}
                      size="small"
                    />
                    <Controls.Input
                      name="ime_porodicni"
                      disabled={true}
                      InputLabelProps={{
                        shrink: Boolean(values.ime_porodicni),
                      }}
                      label="Ime ljekara"
                      value={values.ime_porodicni}
                      size="small"
                    />
                    <Controls.Input
                      name="prezime_porodicni"
                      disabled={true}
                      InputLabelProps={{
                        shrink: Boolean(values.prezime_porodicni),
                      }}
                      label="Prezime ljekara"
                      value={values.prezime_porodicni}
                      size="small"
                    />
                  </div>
                </label>
              </div>
            </div>
          </label>
        </div>
      </Form>
    </div>
  );

  return (
    <Fragment>
      <Modal
        open={openListaModal}
        onClose={handleCloseListaModal}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <IconButton
            aria-label="close"
            onClick={handleCloseListaModal}
            sx={{
              position: "fixed",
              top: "10px",
              right: "10px",
              color: "var(--color-error-200)",
            }}
          >
            <CloseIcon />
          </IconButton>
          <h2
            id="modal-modal-title"
            style={{
              color: "var(--color-primary-600",
            }}
          >
            Lista pronađenih pacijenata u bazi podataka:
          </h2>
          <Divider />
          <Box sx={{ maxHeight: "75vh", overflowX: "clip", overflowY: "auto" }}>
            <List>
              {pronadjeniPacijenti !== null && pronadjeniPacijenti !== undefined
                ? pronadjeniPacijenti
                    .sort((a, b) => {
                      const prezimeA = a.prezime.toLowerCase();
                      const prezimeB = b.prezime.toLowerCase();
                      const rezultat = prezimeA.localeCompare(prezimeB, "hr");
                      if (rezultat !== 0) return rezultat;
                      // Ako su prezimena ista, sortiraj po imenu
                      const imeA = a.ime.toLowerCase();
                      const imeB = b.ime.toLowerCase();
                      return imeA.localeCompare(imeB, "hr");
                    })
                    .map((pacijent, index) => (
                      <ListItem
                        key={
                          pacijent !== null && pacijent !== undefined
                            ? pacijent.id
                            : null
                        }
                        aria-label="izaberi pacijenta"
                        sx={{
                          cursor: "pointer",
                          border: "1px solid var(--color-gray-50)",
                          borderRadius: "var(--border-radius-small)",
                          backgroundColor: "rgba(239, 240, 235, 0.3)",
                          marginBottom: "0.25em",
                          "&:hover": {
                            backgroundColor: "var(--color-gray-100)",
                          },
                        }}
                        onClick={() => {
                          if (pacijent !== null && pacijent !== undefined) {
                            handlePacijent(pacijent.id, pacijent.jmbg);
                            setPojamTrazi(pacijent.jmbg);
                            handleCloseListaModal();
                          }
                        }}
                      >
                        {index + 1}. {pacijent.prezime}{" "}
                        {`(${pacijent.ime_roditelja})`} {pacijent.ime} -{" "}
                        {pacijent.jmbg}
                      </ListItem>
                    ))
                : null}
            </List>
          </Box>
        </Box>
      </Modal>
      <Popup
        title={title}
        openPopup={true}
        setOpenPopup={closeModal}
        //fullScreen={fullScreen}
        fullWidth={true}
        //maxWidth="lg"
        maxWidth={window.screen.width <= 1768 ? "lg" : "xl"}
        backdropNonClose={true}
      >
        {uputnicaPolja}
      </Popup>
    </Fragment>
  );
};

export default DetaljiUputnice;

//import Select from "react-select";

{
  /* <Select
                name="skladiste_grupa"
                label="Klinika"
                placeholder="Klinika"
                isClearable={true}
                //menuIsOpen={true}
                isDisabled={
                  values.status > 0 || korisnik !== values.kreirano_korisnik
                }
                onChange={(option) => {
                  let event = {
                    target: { name: "skladiste_grupa", value: option.value },
                  };
                  handleInputChange(event);
                }}
                options={klinike.map((klinika) => ({
                  value: klinika.id,
                  label: klinika.id + " - " + klinika.naziv,
                }))}
                value={
                  values.skladiste_grupa === ""
                    ? null
                    : (() => {
                        const klinika = klinike.find(
                          (klinika) => klinika.id === values.skladiste_grupa
                        );
                        return klinika
                          ? {
                              value: klinika.id,
                              label: `${klinika.id} - ${klinika.naziv}`,
                            }
                          : null;
                      })()
                }
                styles={{
                  control: (base, { isFocused }) => ({
                    ...base,
                    marginLeft: "0.5em",
                    width: "360px",
                    borderWidth: "1px",
                    borderColor: isFocused
                      ? "blue"
                      : errors.skladiste_grupa
                      ? "red"
                      : "gray",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: "2",
                    width: "360px",
                    marginLeft: "0.5em",
                  }),
                }}
              /> */
}
