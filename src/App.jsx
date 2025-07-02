import { Fragment, useCallback, useEffect, useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "./store";
import { useReactToPrint } from "react-to-print";
import ListaUputnica from "./components/Uputnice/ListaUputnica";
import PretragaUputnica from "./components/Uputnice/PretragaUputnica";
import Provjera from "./components/Uputnice/Provjera";
import {
  uputnicaTransformer,
  uputioTransformer,
  mkbTransformer,
} from "./components/util/transformer";
import NovaPretraga from "./components/Modals/NovaPretraga";
import NovaUsluga from "./components/Modals/NovaUsluga";
import ListaBolnickih from "./components/Modals/Bolnicke/ListaBolnickih";
import ListaRezultata from "./components/Modals/Rezultati/ListaRezultata";
import Pretrage from "./components/Pretrage/Pretrage";
import Izvjestaji from "./components/Izvjestaji/Izvjestaji";
import Sifrarnici from "./components/Sifrarnici/Sifrarnici";
import Toast from "./components/UI/Toast/Toast";
import dayjs from "dayjs";
import OvjeraModal from "./components/Pretrage/components/ui/OvjeraModal";
import UplatnicaModal from "./components/Pretrage/components/ui/UplatnicaModal";
import Arhiva from "./components/Arhiva/Arhiva";
import "./App.css";
import "./components/Elektronska/stilovi/globalni.scss";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
//import Popravak from "./Popravak.jsx";
import DetaljiUputnice from "./components/Modals/DetaljiUputnice.jsx";
import ElektroUputnica from "./components/Elektronska/funkcionalnosti/uputnice/komponente/ElektroUputnica.jsx";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const prefetchMKB = async () => {
  const response = await fetch(
    `../rpc/laboratorija.cfc?method=lista_mkb&datumOd=""&datumDo=""`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return await response.json();
};

const prefetchSession = async () => {
  const response = await fetch(
    `../rpc/laboratorija.cfc?method=get_session&datumOd=""&datumDo=""`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return await response.json();
};

const prefetchedSessionPromise = prefetchSession();
const prefetchedMKBPromise = prefetchMKB();

const App = () => {
  const dodajSesiju = useStore((store) => store.dodajSesiju);
  const sesijaPodaci = useStore((store) => store.sesijaPodaci);
  const [uputnice, setUputnice] = useState([]);
  const [klinike, setKlinike] = useState([]);
  const [odjeli, setOdjeli] = useState([]);
  const [doktori, setDoktori] = useState([]);
  const [uputio, setUputio] = useState([]);
  const [opstine, setOpstine] = useState([]);
  const [identifikatori, setIdentifikatori] = useState([]);
  const openLoader = useStore((store) => store.openLoader);
  const unesiPretrage = useStore((store) => store.unesiPretrage);
  //const ponistiNalog = useStore((store) => store.ponistiNalog);
  const setOsnoviOslobadjanja = useStore(
    (store) => store.setOsnoviOslobadjanja
  );
  const setOsnovOsiguranja = useStore((store) => store.setOsnovOsiguranja);
  const osnoviOslobadjanja = useStore((store) => store.osnoviOslobadjanja);
  const osnovOsiguranja = useStore((store) => store.osnovOsiguranja);
  const prikazi = useStore((store) => store.prikazi);
  const [pretrageSve, setPretrageSve] = useState([]);
  const [otvoriDetaljUputnice, setOtvoriDetaljUputnice] = useState(false);
  const [otvoriNoviPacijent, setOtvoriNoviPacijent] = useState(false);
  //const odabranePretrage = useStore((store) => store.odabranePretrage);
  const podaciUputnice = useStore((store) => store.podaciUputnice);
  const otvoriPrintOvjere = useStore((store) => store.otvoriPrintOvjere);
  const setOtvoriPrintOvjere = useStore((store) => store.setOtvoriPrintOvjere);
  const otvoriPrintUplatnice = useStore((store) => store.otvoriPrintUplatnice);
  const setOtvoriPrintUplatnice = useStore(
    (store) => store.setOtvoriPrintUplatnice
  );
  const otvoriNovaPretraga = useStore((store) => store.otvoriNovaPretraga);
  const setOtvoriNovaPretraga = useStore(
    (store) => store.setOtvoriNovaPretraga
  );
  const otvoriNovaUsluga = useStore((store) => store.otvoriNovaUsluga);
  const setOtvoriNovaUsluga = useStore((store) => store.setOtvoriNovaUsluga);
  const [privilegije, setPrivilegije] = useState();
  const [pacijentPodaci, setPacijentPodaci] = useState({});
  const [openListaBolnickih, setOpenListaBolnickih] = useState(false);
  const [openListaRezultata, setOpenListaRezultata] = useState(false);
  const [openListaElektronskih, setOpenListaElektronskih] = useState(false);
  const [openPretragaUputnica, setOpenPretragaUputnica] = useState(false);
  const openProvjeraCijene = useStore((store) => store.openProvjeraCijene);
  const setOpenProvjeraCijene = useStore(
    (store) => store.setOpenProvjeraCijene
  );
  const [datumRange, setDatumRange] = useState({
    datumOd: dayjs(new Date()).format("DD.MM.YYYY"),
    datumDo: dayjs(new Date()).format("DD.MM.YYYY"),
  });
  //const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "",
    duration: 0,
  });
  const [dijagnozaMKB, setDijagnozaMKB] = useState([]);
  //const [korisnici, setKorisnici] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [prikaziSveUputnice, setPrikaziSveUputnice] = useState(0);
  const [sorting, setSorting] = useState([{ id: "id", desc: true }]);
  const queryClient = useQueryClient();

  const componentRef = useRef();

  /*   const povuciPodatke = useCallback(async (method, datumOd, datumDo) => {
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=${method}&datumOd=${datumOd}&datumDo=${datumDo}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return await response.json();
  }, []); */

  const povuciPodatke = async (params) => {
    const newData = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      newData.append(key, params[key] === undefined ? "" : params[key]);
    });
    const response = await fetch(`${API_BASE_URL}/rpc/laboratorija.cfc?`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: newData,
    });
    return response.json();
  };

  /*   const povuciPrivilegije = useCallback(async (id_korisnika) => {
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=privilegije&id_korisnika=${id_korisnika}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return await response.json();
  }, []); */

  const invalidateSesija = () => {
    povuciPodatke({ method: "get_session" }).then((r) => {
      dodajSesiju(r);
      setColumnFilters([
        { id: "kreirano_korisnik", value: `${r["id_korisnika"]}` },
      ]);
      //useStore.setState({ korisnik: r["id_korisnika"] });
      /* povuciPrivilegije(r["id_korisnika"]).then((privilegije) => {
        r.lab_privilegije = privilegije.lab_privilegije.split(",").map(Number);
        dodajSesiju(r);
        setColumnFilters([
          { id: "kreirano_korisnik", value: `${r["id_korisnika"]}` },
        ]);
        useStore.setState({ korisnik: r["id_korisnika"] });
      }); */
    });
  };

  /*  useEffect(() => {
   prefetchedSessionPromise.then((r) => {
      povuciPrivilegije(r["id_korisnika"]).then((privilegije) => {
        r.lab_privilegije = privilegije.lab_privilegije.split(",").map(Number);
        dodajSesiju(r);
        setColumnFilters([
          { id: "kreirano_korisnik", value: `${r["id_korisnika"]}` },
        ]);
        useStore.setState({ korisnik: r["id_korisnika"] });
      });
    });
  }, []); */

  useEffect(() => {
    prefetchedSessionPromise.then((r) => {
      dodajSesiju(r);
      setColumnFilters([
        { id: "kreirano_korisnik", value: `${r["id_korisnika"]}` },
      ]);
      //useStore.setState({ korisnik: r["id_korisnika"] });
    }); //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (dijagnozaMKB.length > 0) return;
    prefetchedMKBPromise.then((r) => {
      mkbTransformer(r.lista, setDijagnozaMKB);
      useStore.setState({ openLoader: false });
    }); //eslint-disable-next-line
  }, []);

  /* useEffect(() => {
    povuciPodatke("lista_mkb").then((r) => {
      /* povuciPodatke("lista_mkb").then((r) => setDijagnozaMKB(r["lista"])); KADA IDE NA QueryToArray
      mkbTransformer(r.lista, setDijagnozaMKB);
    });
  }, [povuciPodatke]); */

  const privilegijeParams = {
    method: "lista_privilegija",
  };

  const {
    data: privilegije_data,
    isError: privilegijeIsError,
    error: privilegijeError,
  } = useQuery({
    queryKey: ["privilegije", privilegijeParams],
    queryFn: () => povuciPodatke(privilegijeParams),
    refetchOnWindowFocus: false,
    //enabled: !!mkb_data,
  });
  useEffect(() => {
    if (privilegijeIsError) {
      notifikacija(true, privilegijeError.message);
    }
    if (privilegije_data !== undefined) {
      setPrivilegije(privilegije_data.lista_privilegija);
    } //eslint-disable-next-line
  }, [privilegije_data]);

  const uputniceParams = {
    method: "laboratorija_uputnice_lista",
    datumOd: datumRange.datumOd,
    datumDo: datumRange.datumDo,
  };
  const {
    data: uputnice_data,
    isError: uputniceIsError,
    isPending: ucitavanje_uputnica,
    error: uputniceError,
  } = useQuery({
    queryKey: ["uputnice", uputniceParams],
    queryFn: () => povuciPodatke(uputniceParams),
    refetchOnWindowFocus: false,
    //enabled: !!privilegije_data,
  });
  useEffect(() => {
    //console.log("uputnice_data", uputnice_data);
    if (uputniceIsError) {
      notifikacija(true, uputniceError.message);
    }
    if (uputnice_data !== undefined) {
      uputnicaTransformer(uputnice_data.lista, setUputnice);
    }
    //eslint-disable-next-line
  }, [uputnice_data]);

  const uputioParams = {
    method: "uputio",
  };
  const {
    data: uputio_data,
    isError: uputioIsError,
    error: uputioError,
  } = useQuery({
    queryKey: ["uputio", uputioParams],
    queryFn: () => povuciPodatke(uputioParams),
    refetchOnWindowFocus: false,
    //enabled: !!uputnice_data,
  });
  useEffect(() => {
    if (uputioIsError) {
      notifikacija(true, uputioError.message);
    }
    if (uputio_data !== undefined) {
      uputioTransformer(uputio_data.lista, setUputio);
    } //eslint-disable-next-line
  }, [uputio_data]);

  const klinikeParams = {
    method: "lista_klinike",
  };
  const {
    data: klinike_data,
    isError: klinikeIsError,
    error: klinikeError,
  } = useQuery({
    queryKey: ["klinike", klinikeParams],
    queryFn: () => povuciPodatke(klinikeParams),
    refetchOnWindowFocus: false,
    //enabled: !!uputnice_data,
  });
  useEffect(() => {
    if (klinikeIsError) {
      notifikacija(true, klinikeError.message);
    }
    if (klinike_data !== undefined) {
      setKlinike(klinike_data.lista_klinike);
    } //eslint-disable-next-line
  }, [klinike_data]);

  const odjeliParams = {
    method: "lista_odjeli",
  };
  const {
    data: odjeli_data,
    isError: odjeliIsError,
    error: odjeliError,
  } = useQuery({
    queryKey: ["odjeli", odjeliParams],
    queryFn: () => povuciPodatke(odjeliParams),
    refetchOnWindowFocus: false,
    //enabled: !!uputnice_data,
  });
  useEffect(() => {
    if (odjeliIsError) {
      notifikacija(true, odjeliError.message);
    }
    if (odjeli_data !== undefined) {
      setOdjeli(odjeli_data.lista_odjeli);
    } //eslint-disable-next-line
  }, [odjeli_data]);

  const doktoriParams = {
    method: "lista_doktori",
  };
  const {
    data: doktori_data,
    isError: doktoriIsError,
    error: doktoriError,
  } = useQuery({
    queryKey: ["doktori", doktoriParams],
    queryFn: () => povuciPodatke(doktoriParams),
    refetchOnWindowFocus: false,
    //enabled: !!uputnice_data,
  });
  useEffect(() => {
    if (doktoriIsError) {
      notifikacija(true, doktoriError.message);
    }
    if (doktori_data !== undefined) {
      setDoktori(doktori_data.lista);
    } //eslint-disable-next-line
  }, [doktori_data]);

  /*   useEffect(() => {
    povuciPodatke("lista_korisnika_labaratorije").then((r) => {
      let lista = [...r["lista1"], ...r["lista2"]];
      setKorisnici(lista);
    });
  }, []); */

  const pretrageParams = {
    method: "lista_pretraga",
  };
  const {
    data: pretrage_data,
    isError: pretrageIsError,
    error: pretrageError,
  } = useQuery({
    queryKey: ["pretrage", pretrageParams],
    queryFn: () => povuciPodatke(pretrageParams),
    refetchOnWindowFocus: false,
    //enabled: !!privilegije_data,
  });
  useEffect(() => {
    if (pretrageIsError) {
      notifikacija(true, pretrageError.message);
    }
    if (pretrage_data !== undefined) {
      unesiPretrage(pretrage_data.lista_pretraga);
    } //eslint-disable-next-line
  }, [pretrage_data]);

  const pretrageSveParams = {
    method: "lista_pretraga_sve",
  };
  const {
    data: pretrageSve_data,
    isError: pretrageSveIsError,
    error: pretrageSveError,
  } = useQuery({
    queryKey: ["pretrageSve", pretrageSveParams],
    queryFn: () => povuciPodatke(pretrageSveParams),
    refetchOnWindowFocus: false,
    //enabled: !!privilegije_data,
  });
  useEffect(() => {
    if (pretrageSveIsError) {
      notifikacija(true, pretrageSveError.message);
    }
    if (pretrageSve_data !== undefined) {
      setPretrageSve(pretrageSve_data.lista_pretraga_sve);
    } //eslint-disable-next-line
  }, [pretrageSve_data]);

  const osnovOsiguranjaParams = {
    method: "osnov_osiguranja",
  };
  const {
    data: osnovOsiguranja_data,
    isError: osnovOsiguranjaIsError,
    error: osnovOsiguranjaError,
  } = useQuery({
    queryKey: ["osnovOsiguranja", osnovOsiguranjaParams],
    queryFn: () => povuciPodatke(osnovOsiguranjaParams),
    refetchOnWindowFocus: false,
    //enabled: !!uputnice_data,
  });
  useEffect(() => {
    if (osnovOsiguranjaIsError) {
      notifikacija(true, osnovOsiguranjaError.message);
    }
    if (osnovOsiguranja_data !== undefined) {
      setOsnovOsiguranja(osnovOsiguranja_data.lista);
    } //eslint-disable-next-line
  }, [osnovOsiguranja_data]);

  const osnovOslobadjanjaParams = {
    method: "lista_osnov_oslobadjanja",
  };
  const {
    data: osnovOslobadjanja_data,
    isError: osnovOslobadjanjaIsError,
    error: osnovOslobadjanjaError,
  } = useQuery({
    queryKey: ["osnovOslobadjanja", osnovOslobadjanjaParams],
    queryFn: () => povuciPodatke(osnovOslobadjanjaParams),
    refetchOnWindowFocus: false,
    //enabled: !!uputnice_data,
  });
  useEffect(() => {
    if (osnovOslobadjanjaIsError) {
      notifikacija(true, osnovOslobadjanjaError.message);
    }
    if (osnovOslobadjanja_data !== undefined) {
      setOsnoviOslobadjanja(osnovOslobadjanja_data.lista_osnov_oslobadjanja);
    } //eslint-disable-next-line
  }, [osnovOslobadjanja_data]);

  const opstineParams = {
    method: "lista_opstina",
  };
  const {
    data: opstine_data,
    isError: opstineIsError,
    error: opstineError,
  } = useQuery({
    queryKey: ["opstine", opstineParams],
    queryFn: () => povuciPodatke(opstineParams),
    refetchOnWindowFocus: false,
    //enabled: !!uputnice_data,
  });
  useEffect(() => {
    if (opstineIsError) {
      notifikacija(true, opstineError.message);
    }
    if (opstine_data !== undefined) {
      setOpstine(opstine_data.lista_opstina);
    } //eslint-disable-next-line
  }, [opstine_data]);

  const identifikatoriParams = {
    method: "vrste_identifikatora",
  };
  const {
    data: identifikatori_data,
    isError: identifikatoriIsError,
    error: identifikatoriError,
  } = useQuery({
    queryKey: ["identifikatori", identifikatoriParams],
    queryFn: () => povuciPodatke(identifikatoriParams),
    refetchOnWindowFocus: false,
    //enabled: !!privilegije_data,
  });
  useEffect(() => {
    if (identifikatoriIsError) {
      notifikacija(true, identifikatoriError.message);
    }
    if (identifikatori_data !== undefined) {
      setIdentifikatori(identifikatori_data.vrste_identifikatora);
    } //eslint-disable-next-line
  }, [identifikatori_data]);

  const naIzborDatuma = (datumOd, datumDo) => {
    setDatumRange({
      datumOd: datumOd,
      datumDo: datumDo,
    });
  };

  const notifikacija = (open, msg, severity, duration) => {
    setOpen({
      open: open,
      message: msg,
      severity: severity,
      duration: duration,
    });
  };

  useEffect(() => {
    if (
      podaciUputnice === undefined ||
      Object.keys(podaciUputnice).length === 0
    )
      return;
    const pacijentPodaci = {
      id_uputnice: podaciUputnice["id"],
      ime_roditelja: podaciUputnice["ime_roditelja"],
      ime: podaciUputnice["ime"],
      prezime: podaciUputnice["prezime"],
      datum_rodjenja: podaciUputnice["datum_rodjenja"]
        ? dayjs(podaciUputnice["datum_rodjenja"]).format("DD.MM.YYYY")
        : "",
      broj_protokola: podaciUputnice["broj_protokola"],
      skladiste: podaciUputnice["skladiste"],
      skladiste_grupa: podaciUputnice["skladiste_grupa"],
      status: podaciUputnice["status"],
    };
    setPacijentPodaci(pacijentPodaci);
  }, [podaciUputnice]);

  /* const povuciFzoPodatke = async () => {
    const response = await fetch(
      `../rpc/izis_rs.cfc?method=OsiguranikUID2&id=3121299108&__BDRETURNFORMAT=json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return await response.json();
  }; */
  //../rpc/izis_rs.cfc?method=osiguranik_jmbg&jmbg=JMBG_BROJ&__BDRETURNFORMAT=json PODACI PREKO JMBG
  // TREBAJU PODACI O RBO - registarski broj osiguranika (obv_oznaka) i šifri djelatnosti (obv_sifdel)
  const povuciEpizodu = async (podaci) => {
    //console.error("PODACI HANDLE POVUCI EPIZODU - 2",podaci,"original:",podaci.datum_rodjenja,"pretvoreno NOVO:",dayjs(podaci.datum_rodjenja).format("YYYY-MM-DD"));
    const newData = new URLSearchParams();
    newData.append("id_epizode", podaci.id);
    newData.append("prioritet", podaci.prioritet);
    newData.append("protokol", podaci.protokol);
    newData.append("dijagnoza_id", podaci.dijagnoza_id);
    newData.append("dijagnoza_sifra", podaci.dijagnoza_sifra);
    newData.append("jmbg_majka", podaci.jmbg_majka);
    newData.append("napomena", podaci.napomena);
    newData.append("uputio", podaci.uputio);
    newData.append(
      "datum_rodjenja",
      dayjs(podaci.datum_rodjenja).format("YYYY-MM-DD")
    ); //dayjs(podaci.datum_rodjenja).format("DD.MM.YYYY")
    newData.append("status_osiguranja", podaci.status_osiguranja);
    newData.append("osnov_oslobadjanja", podaci.osnov_oslobadjanja);
    //newData.append("po_ugovoru", podaci.po_ugovoru === true ? 1 : 0);
    newData.append("po_ugovoru", Number(podaci.po_ugovoru));
    //newData.append("komerc_placanje", podaci.komerc_placanje === true ? 1 : 0);
    newData.append("komerc_placanje", Number(podaci.komerc_placanje));
    //newData.append("bez_participacije", podaci.bez_participacije === true ? 1 : 0);
    newData.append("bez_participacije", Number(podaci.bez_participacije));
    newData.append("visina", podaci.visina);
    newData.append("tezina", podaci.tezina);
    newData.append("diureza", podaci.diureza);
    newData.append("klijent_token", podaci.klijent_token);
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=ucitaj_epizodu2`, //izmjena metode
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: newData,
      }
    );
    if (response.ok) {
      notifikacija(true, "Uputnica je uspješno kreirana!", "success", 2000);
    } else {
      notifikacija(
        true,
        "Uputnica nije kreirana, došlo je do greške!",
        "error",
        2000
      );
    }
    return await response.json();
  };

  const updateQuerie = async (id) => {
    const fetchUputnica = await fetch(
      `../rpc/laboratorija.cfc?method=laboratorija_uputnice_lista&id=${id}&datumOd=${datumRange.datumOd}&datumDo=${datumRange.datumDo}`
    );
    const uputnicaParse = await fetchUputnica.json();
    //console.error("updateQuerie Uputnica", uputnicaParse);
    const novaUputnica = handleUpdateQueryData(uputnicaParse["lista"]);
    return novaUputnica[0];
  };

  const handleUpdateQueryData = (data) => {
    //console.error("uputnica", data);
    const novaUputnica = uputnicaTransformer(data);
    //console.error("novaUputnica handle", novaUputnica);
    queryClient.setQueryData(["uputnice", uputniceParams], (oldData) => {
      const existingUputnica = oldData.lista.find(
        (uputnica) => uputnica.id === data[0].id
      );
      if (existingUputnica) {
        return oldData;
      } else {
        const newList = [...oldData.lista, data[0]];
        return { ...oldData, lista: newList };
      }
    });
    return novaUputnica[0];
  };

  const dataUpdate = async (id) => {
    const fetchUputnica = await fetch(
      `../rpc/laboratorija.cfc?method=laboratorija_uputnice_lista&id=${id}&datumOd=${datumRange.datumOd}&datumDo=${datumRange.datumDo}`
    );
    const uputnicaParse = await fetchUputnica.json();
    /* const novaUputnica = uputnicaTransformer(uputnicaParse["lista"]);
    useStore.setState({
      podaciUputnice: {
        ...novaUputnica[0],
      },
    }); */
    queryClient.setQueryData(["uputnice", uputniceParams], (oldData) => {
      return {
        ...oldData,
        lista: oldData.lista.map((uputnica) =>
          uputnica.id === id ? uputnicaParse["lista"][0] : uputnica
        ),
      };
    });
  };

  const izmjenaStatusa = async (
    id,
    status,
    razlog_storno,
    ukupna_cijena,
    ukupno_fond,
    grupno,
    bolnicka_direktno
  ) => {
    const newData = new URLSearchParams();
    newData.append("uputnica", id);
    if (razlog_storno !== "") newData.append("razlog_storno", razlog_storno);
    if (ukupna_cijena !== undefined && ukupna_cijena !== "")
      newData.append("ukupna_cijena", ukupna_cijena);
    if (ukupno_fond !== undefined && ukupno_fond !== "")
      newData.append("ukupno_fond", ukupno_fond);
    newData.append("status", status);
    await fetch(`../rpc/laboratorija.cfc?method=izmjena_statusa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: newData,
    }).then((response) => {
      if (response.ok) {
        //PREBACI PRETRAGE U podaciUputnice - OPCIJA OSTAJANJA NA NALOGU NAKON SLANJA
        /*const pretrageNaloga = odabranePretrage.find(
          (nalog) => nalog.id === id
        );
        if (pretrageNaloga !== undefined) {
           useStore.setState({
            podaciUputnice: {
              ...podaciUputnice,
              pretrage: pretrageNaloga.pretrage,
              status: 1,
            },
          }); 
          //ponistiNalog(id);
        }*/
        // OPCIJA VRAĆANJA NA LISTU UPUTNICA
        /* useStore.setState({
          prikazi: { meni: "uputnice", naziv: "", data: [] },
        }); */
        if (status === 2) {
          notifikacija(true, "Uputnica je stornirana", "success", 3000);
          dataUpdate(id); // UPDAJTUJE PODATKE UPUTNICE U LISTI
          //queryClient.invalidateQueries({ queryKey: ["uputnice"] });
        } else if (status === 1)
          if (!grupno) {
            setTimeout(() => {
              //setLoading(true);
              if (!bolnicka_direktno) {
                dataUpdate(id); // UPDAJTUJE PODATKE UPUTNICE U LISTI
              } else {
                updateQuerie(id); // UNOSI UPUTNICU U LISTU
              }
              //queryClient.invalidateQueries({ queryKey: ["uputnice"] });
              //setLoading(false);
              notifikacija(
                true,
                "Uputnica je poslana u BIONET",
                "success",
                3000
              );
            }, 1200); //1800 VRIJEME REFRESHA
          } else {
            dataUpdate(id);
          }
      } else {
        notifikacija(
          true,
          "Izmjena ili slanje nije uspjelo, došlo je do greške!",
          "error",
          5000
        );
      }
      return response;
    });
  };

  const izaberiUputnicu = useCallback((uputnica) => {
    useStore.setState({ podaciUputnice: uputnica });
    useStore.setState({
      prikazi: { meni: "pretrage", naziv: "", data: [] },
    });
  }, []);

  useEffect(() => {
    if (
      podaciUputnice === undefined ||
      Object.keys(podaciUputnice).length === 0
    )
      return;
    let izabranaUputnica = uputnice.filter(
      (uputnica) => uputnica["id"] === podaciUputnice["id"]
    );
    useStore.setState({ podaciUputnice: izabranaUputnica[0] });
    // eslint-disable-next-line
  }, [uputnice]);

  const updateEpizoda = async (id_epizode, id_uputnice) => {
    const newData = new URLSearchParams();
    newData.append("id_epizode", id_epizode);
    newData.append("id_uputnice", id_uputnice);
    await fetch(`../rpc/laboratorija.cfc?method=update_epizoda`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: newData,
    });
  };
  //OVDE UČITAVA POSTOJANJE EPIZODE I KREIRA UPUTNICU
  const handlePovuciEpizodu = (podaci) => {
    //console.warn("PODACI HANDLE POVUCI EPIZODU - 1",podaci,"original_datum:",podaci.datum_rodjenja);
    if (podaci.id) {
      povuciEpizodu(podaci)
        .then((r) => {
          //console.warn("POVUČENA EPIZODA _ UPUTNICA:", r);
          if (r && r.greska === 1) {
            throw new Error(r.poruka);
          }
          if (r && r.id) {
            if (podaci.vrsta === 1) {
              updateEpizoda(podaci.id, r.id);
            }
            const novaUputnica = handleUpdateQueryData(r.uputnica);
            //console.error("novaUputnica", novaUputnica);
            return novaUputnica; //updateQuerie(r.id); // mora return da bi dalje imao rez, ovdje zove za da ubaci podatke novostvorene uputnice
          } else if (!r || typeof r.id === "undefined") {
            throw new Error("Invalid response from povuciEpizodu.");
          }
        })
        .then((rez) => {
          //console.warn("UNESENA UPUTNICA:", rez);
          if (rez) {
            setOtvoriNoviPacijent(false);
            izaberiUputnicu(rez);
            //queryClient.invalidateQueries({ queryKey: ["uputnice"] }); // refresh ukupne liste uputnica
            /* setTimeout(() => {
              setOtvoriDetaljUputnice(true);
            }, 100); otvara podatke uputnice */
          } else {
            throw new Error("Failed to update uputnice");
          }
        })
        .catch((error) => {
          //console.error("Error handling episode:", error);
          notifikacija(
            true,
            `Došlo je do greške! ${error.message}`,
            "error",
            5000
          );
        });
    } else {
      //console.error("Invalid epizodaId");
    }
  };

  const osvjeziPodatke = () => {
    setDatumRange({
      datumOd: dayjs(new Date()).format("DD.MM.YYYY"),
      datumDo: dayjs(new Date()).format("DD.MM.YYYY"),
    });
    useStore.setState({ podaciUputnice: {} });
  };
  // za verziju react to print >  3.00.0 ide useReactToPrint ovako
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  //console.log("korisnik",useStore.getState().korisnik,"privilegije",privilegije);
  //console.log("OPENLOADER", openLoader);
  //console.log("uputnice obradjene", uputnice);
  //console.log("podaciUputnice APP",podaciUputnice,Object.keys(podaciUputnice).length);
  //console.log("sesijaPodaci", sesijaPodaci, Object.keys(sesijaPodaci).length);
  //console.log("loading", loading, dayjs(new Date()).format("HH.mm.ss"));
  console.log("otvoriNovaUsluga", otvoriNovaUsluga);
  return (
    <Fragment>
      {sesijaPodaci.id_korisnika &&
        !sesijaPodaci.grupa_korisnika.includes("23") &&
        !sesijaPodaci.grupa_korisnika.includes("1") && (
          <div className="odbijenica">
            <h2>
              NEMATE PRAVO PRISTUPA LABORATORIJSKOM INFORMACIONOM SISTEMU.
            </h2>
          </div>
        )}
      {!sesijaPodaci.id_korisnika && !sesijaPodaci.grupa_korisnika && (
        <div className="notloged">
          <h1>NISTE PRIJAVLJENI U KLINIČKI INFORMACIONI SISTEM</h1>
          <h2>SAMO ULOGOVAN KORISNIK MOŽE PRISTUPITI LIS APLIKACIJI</h2>
          <h2>MOLIMO VAS DA TO UČINITE !</h2>
        </div>
      )}
      {sesijaPodaci.id_korisnika &&
        (sesijaPodaci.grupa_korisnika.includes("23") ||
          sesijaPodaci.grupa_korisnika.includes("1")) && (
          <Fragment>
            <Toast
              open={open.open}
              setOpen={() =>
                setOpen({ open: false, message: "", severity: "", duration: 0 })
              }
              severity={open.severity}
              message={open.message}
              duration={open.duration}
            />
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={openLoader}
              //onClick={handleClose}
            >
              <CircularProgress color="inherit" size="8em" />
            </Backdrop>
            {prikazi.meni === "uputnice" && (
              <ListaUputnica
                uputnice={uputnice}
                //setPodaciUputnice={setPodaciUputnice}
                //setPodaciZaOvjeru={handleOvjera}
                //korisnici={korisnici}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                prikaziSveUputnice={prikaziSveUputnice}
                setPrikaziSveUputnice={setPrikaziSveUputnice}
                otvoriPretrage={() =>
                  useStore.setState({
                    prikazi: { meni: "pretrage", naziv: "", data: [] },
                  })
                }
                storniranjeUputnice={izmjenaStatusa}
                onOpenListaBolnickih={() => setOpenListaBolnickih(true)}
                onOpenListaRezultata={() => setOpenListaRezultata(true)}
                onOpenListaElektronskih={() => setOpenListaElektronskih(true)}
                onOpenNovaUputnica={() => setOtvoriNoviPacijent(true)}
                onOpenPretragaUputnica={() => setOpenPretragaUputnica(true)}
                onOpenProvjeraCijene={() => setOpenProvjeraCijene(true)}
                onOsvjeziPodatke={osvjeziPodatke}
                imeKorisnika={sesijaPodaci["ime_korisnika"]}
                //datumRange={datumRange}
                naIzborDatuma={naIzborDatuma}
                loading={ucitavanje_uputnica}
                setSorting={setSorting}
                sorting={sorting}
                izmjenaStatusa={izmjenaStatusa}
                notifikacija={notifikacija}
              />
            )}

            {prikazi.meni === "arhiva" && (
              <Arhiva notifikacija={notifikacija} />
            )}

            {otvoriDetaljUputnice && dijagnozaMKB.length > 0 && (
              <DetaljiUputnice
                edit={true} // IZMJENA PODATAK
                title={`PODACI UPUTNICE I PACIJENTA`}
                klinike={klinike}
                odjeli={odjeli}
                recordForEdit={podaciUputnice}
                sesija={sesijaPodaci}
                doktori={doktori}
                uputio={uputio}
                opstine={opstine}
                identifikatori={identifikatori}
                osnoviOslobadjanja={osnoviOslobadjanja}
                osnovOsiguranja={osnovOsiguranja}
                notifikacija={notifikacija}
                dijagnozaMKB={dijagnozaMKB}
                closeModal={() => setOtvoriDetaljUputnice(false)}
                dataUpdate={dataUpdate}
              />
            )}

            {otvoriNoviPacijent && dijagnozaMKB.length > 0 && (
              <DetaljiUputnice
                edit={false}
                title={"PROVJERA PODATAKA PACIJENTA I UNOS UPUTNICE"}
                klinike={klinike}
                odjeli={odjeli}
                sesija={sesijaPodaci}
                doktori={doktori}
                uputio={uputio}
                opstine={opstine}
                identifikatori={identifikatori}
                osnoviOslobadjanja={osnoviOslobadjanja}
                osnovOsiguranja={osnovOsiguranja}
                notifikacija={notifikacija}
                dijagnozaMKB={dijagnozaMKB}
                povuciEpizodu={handlePovuciEpizodu}
                closeModal={() => setOtvoriNoviPacijent(false)}
              />
            )}

            {otvoriNovaPretraga.open && (
              <NovaPretraga
                closeModal={() =>
                  setOtvoriNovaPretraga({
                    open: false,
                    izmjena: false,
                    data: {},
                  })
                }
                izmjena={otvoriNovaPretraga.izmjena}
                pretragaForEdit={otvoriNovaPretraga.data}
                notifikacija={notifikacija}
              />
            )}

            {otvoriNovaUsluga.open && (
              <NovaUsluga
                closeModal={() =>
                  setOtvoriNovaUsluga({
                    open: false,
                    izmjena: false,
                    data: {},
                  })
                }
                izmjena={otvoriNovaUsluga.izmjena}
                uslugaForEdit={otvoriNovaUsluga.data}
                notifikacija={notifikacija}
              />
            )}

            {otvoriPrintOvjere && (
              <OvjeraModal
                podaciOvjere={podaciUputnice}
                closePrintOvjera={() => setOtvoriPrintOvjere(false)}
                printOvjera={handlePrint}
                ref={componentRef}
              />
            )}

            {otvoriPrintUplatnice && (
              <UplatnicaModal
                setOpen={(e) => setOtvoriPrintUplatnice(e)}
                pacijentPodaci={pacijentPodaci}
                podaciUputnice={podaciUputnice}
                printUplatnica={handlePrint}
                ref={componentRef}
              ></UplatnicaModal>
            )}

            {openListaBolnickih && (
              <ListaBolnickih
                closeListaBolnickih={() => setOpenListaBolnickih(false)}
                izmjenaStatusa={izmjenaStatusa}
                pretrageSve={pretrageSve}
                notifikacija={notifikacija}
                updateQuerie={updateQuerie}
              />
            )}

            {openListaRezultata && (
              <ListaRezultata
                closeListaRezultata={() => setOpenListaRezultata(false)}
                notifikacija={notifikacija}
              />
            )}

            {openListaElektronskih && (
              <ElektroUputnica
                closeListaElektroskih={() => setOpenListaElektronskih(false)}
              />
            )}

            {openPretragaUputnica && (
              <PretragaUputnica
                closePretragaUputnica={() => setOpenPretragaUputnica(false)}
                notifikacija={notifikacija}
              />
            )}

            {openProvjeraCijene && (
              <Provjera
                pretrageSve={pretrageSve}
                notifikacija={notifikacija}
                closeProvjeraCijene={() => setOpenProvjeraCijene(false)}
              />
            )}

            {prikazi.meni === "pretrage" &&
              Object.keys(pacijentPodaci).length > 0 && (
                <Pretrage
                  pretrageSve={pretrageSve}
                  pacijentPodaci={pacijentPodaci}
                  //podaciUputnice={podaciUputnice}
                  otvoriDetalj={setOtvoriDetaljUputnice}
                  zatvoriPretrage={() =>
                    useStore.setState({
                      prikazi: { meni: "uputnice", naziv: "", data: [] },
                    })
                  }
                  izmjenaStatusa={izmjenaStatusa}
                />
              )}
            {prikazi.meni === "izvjestaji" && <Izvjestaji />}
            {prikazi.meni === "sifrarnici" && (
              <Sifrarnici
                privilegije={privilegije}
                notifikacija={notifikacija}
                invalidateSesija={invalidateSesija}
                idKorisnika={sesijaPodaci.id_korisnika}
              />
            )}
            {/*prikazi.meni === "obracun" && <Popravak />*/}
          </Fragment>
        )}
    </Fragment>
  );
};

export default App;
