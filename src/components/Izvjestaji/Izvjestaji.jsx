import {
  useState,
  useEffect,
  useRef,
  /* useCallback, */ Fragment,
} from "react";
import { useStore } from "../../store";
import { useQuery } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import {
  naplacenoTransformer,
  naplacenoPoPacijentuTransformer,
  naplacenoKomercijalnoTransformer,
  uslugePokioZbirnoTransformer,
  uslugeKioTransformer,
  uslugeZBgrupeTransformer,
  uslugeZbirnoTransformer,
  uslugeStarosneGrupeTransformer,
  uslugeDoktoriTransformer,
  brPacijenataTransformer,
  realizacijaKomercijalnihTransformer,
  realizacijaOsiguranihTransformer,
} from "../util/transformer";
import dayjs from "dayjs";
import IzborIzvjestaja from "./IzborIzvjestaja";
import Naplaceno from "./Naplaceno";
import NaplacenoPoPacijentu from "./NaplacenoPoPacijentu";
import NaplacenoKomercijalno from "./NaplacenoKomercijalno";
import Realizacija from "./Realizacija";
import UslugeKIOzbirno from "./UslugeKIOzbirno";
import UslugeKIO from "./UslugeKIO";
import UslugeZBgrupe from "./UslugeZBgrupe";
import UslugeZbirno from "./UslugeZbirno";
import UslugeSG from "./UslugeSG";
import UslugeDoktori from "./UslugeDoktori";
import BrPacijenata from "./BrPacijenata";
import BrPacijenataKorisnik from "./BrPacijenataKorisnik";
import Storno from "./Storno";
import Protokol from "./Protokol";
import "./Izvjestaji.css";

const fetchIzvjestaj = async ({ queryKey, signal }) => {
  const [_, naziv_izvjestaja, datumOd, datumDo, id_doktora] = queryKey;
  const response = await fetch(
    `../rpc/laboratorija.cfc?method=izbor_izvjestaja&izvjestaj=${naziv_izvjestaja}&datumOd=${datumOd}&datumDo=${datumDo}&id_doktora=${id_doktora}`,
    {
      method: "GET",
      signal: signal,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch report data");
  }
  return response.json();
};

const Izvjestaji = () => {
  const izvjestaj = useStore((store) => store.prikazi);
  const setIzvjestajData = useStore((store) => store.setIzvjestajData);
  const [realizacijaKomercijalnih, setRealizacijaKomercijalnih] = useState([]);
  /* const isLoading = useStore((store) => store.isLoading);
  const setIsLoading = useStore((store) => store.setIsLoading); */
  const [dateRange, setDateRange] = useState({
    datumOd: dayjs(new Date()).format("DD.MM.YYYY"),
    datumDo: dayjs(new Date()).format("DD.MM.YYYY"),
    doktor: null,
  });
  //const [doktor, setDoktor] = useState(null);
  const [memorandum, setMemorandum] = useState(null);
  //const odabraniDoktor = useStore((store) => store.odabraniDoktor);

  const componentRef = useRef(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "izvjestaj",
      izvjestaj.naziv,
      dateRange.datumOd,
      dateRange.datumDo,
      dateRange.doktor,
    ],
    queryFn: fetchIzvjestaj,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data !== undefined) {
      // Handle transformations based on the report type
      switch (izvjestaj.naziv) {
        case "naplaceno":
          naplacenoTransformer(data.lista, setIzvjestajData);
          break;
        case "naplaceno_po_pacijentu":
          naplacenoPoPacijentuTransformer(data.lista, setIzvjestajData);
          break;
        case "naplaceno_komercijalno":
          naplacenoKomercijalnoTransformer(data.lista, setIzvjestajData);
          break;
        case "realizacija":
          realizacijaKomercijalnihTransformer(
            data.lista_komercijalnih,
            setRealizacijaKomercijalnih
          );
          realizacijaOsiguranihTransformer(
            data.lista_osiguranih,
            setIzvjestajData
          );
          break;
        case "usluge_pokio_zbirno":
          uslugePokioZbirnoTransformer(data.lista, setIzvjestajData);
          break;
        case "usluge_po_kio":
          uslugeKioTransformer(data.lista_pretraga, setIzvjestajData);
          break;
        case "usluge_zb_grupe":
          uslugeZBgrupeTransformer(data.lista, setIzvjestajData);
          break;
        case "usluge_starosne_grupe":
          uslugeStarosneGrupeTransformer(data.lista_pretraga, setIzvjestajData);
          break;
        case "usluge_zbirno_ukupno":
          uslugeZbirnoTransformer(data.lista, setIzvjestajData);
          break;
        case "usluge_doktori":
          uslugeDoktoriTransformer(data.lista, setIzvjestajData);
          break;
        case "br_pacijenata":
          brPacijenataTransformer(data.lista, setIzvjestajData);
          break;
        case "br_pacijenata_korisnik":
        case "protokol_ambulantni":
        case "protokol_bolnicki":
        case "stornirano":
          setIzvjestajData(data.lista);
          break;
        default:
          console.warn("Unknown report type:", izvjestaj.naziv);
      }
    } // eslint-disable-next-line
  }, [data]);

  const povuciMemorandum = async () => {
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=ucitaj_memorandum&id=${9}`
    );
    if (!response.ok) {
      throw Error("Nije moguće povući memorandum!");
    }
    return response.json();
  };

  useEffect(() => {
    povuciMemorandum().then((data) => {
      setMemorandum(data["memorandum"]);
    });
  }, []);

  /*  const povuciIzvjestaj = useCallback(
    async (izvjestaj, datumOd, datumDo, id_doktora) => {
      const response = await fetch(
        `../rpc/laboratorija.cfc?method=izbor_izvjestaja&izvjestaj=${izvjestaj}&datumOd=${datumOd}&datumDo=${datumDo}&id_doktora=${id_doktora}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return await response.json();
    },
    []
  );

  useEffect(() => {
    setIsLoading(true);
    povuciIzvjestaj(
      izvjestaj.naziv,
      dateRange.datumOd,
      dateRange.datumDo,
      odabraniDoktor.value
    ).then((r) => {
      if (izvjestaj.naziv === "naplaceno") {
        naplacenoTransformer(r.lista, setIzvjestajData);
      }
      if (izvjestaj.naziv === "naplaceno_po_pacijentu") {
        naplacenoPoPacijentuTransformer(r.lista, setIzvjestajData);
      }
      if (izvjestaj.naziv === "naplaceno_komercijalno") {
        naplacenoKomercijalnoTransformer(r.lista, setIzvjestajData);
      }
      if (izvjestaj.naziv === "realizacija") {
        realizacijaKomercijalnihTransformer(
          r.lista_komercijalnih,
          setRealizacijaKomercijalnih
        );
        realizacijaOsiguranihTransformer(r.lista_osiguranih, setIzvjestajData);
      }
      if (izvjestaj.naziv === "usluge_pokio_zbirno") {
        uslugePokioZbirnoTransformer(r.lista, setIzvjestajData);
      }
      if (izvjestaj.naziv === "usluge_po_kio") {
        uslugeKioTransformer(r.lista_pretraga, setIzvjestajData);
      }
      if (izvjestaj.naziv === "usluge_zb_grupe") {
        uslugeZBgrupeTransformer(r.lista, setIzvjestajData);
      }
      if (izvjestaj.naziv === "usluge_starosne_grupe") {
        uslugeStarosneGrupeTransformer(r.lista_pretraga, setIzvjestajData);
      }
      if (izvjestaj.naziv === "usluge_zbirno_ukupno") {
        uslugeZbirnoTransformer(r.lista, setIzvjestajData);
      }
      if (izvjestaj.naziv === "usluge_doktori") {
        uslugeDoktoriTransformer(r.lista, setIzvjestajData);
      }
      if (izvjestaj.naziv === "br_pacijenata") {
        brPacijenataTransformer(r.lista, setIzvjestajData);
      }
      if (izvjestaj.naziv === "br_pacijenata_korisnik") {
        setIzvjestajData(r.lista);
      }
      if (izvjestaj.naziv === "protokol_ambulantni") {
        setIzvjestajData(r.lista);
      }
      if (izvjestaj.naziv === "protokol_bolnicki") {
        setIzvjestajData(r.lista);
      }
      if (izvjestaj.naziv === "stornirano") {
        setIzvjestajData(r.lista);
      }
      setIsLoading(false);
    }); // eslint-disable-next-line
  }, [
    povuciIzvjestaj,
    dateRange,
    izvjestaj.naziv,
    setIzvjestajData,
    odabraniDoktor,
  ]); */

  /*   const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  }); // za verziju 2.15.1 react_to_print */

  const handlePrint = useReactToPrint({ contentRef: componentRef }); // za verziju 3.0.1 i veću react_to_print

  //console.log("printing ref", componentRef);
  return (
    <Fragment>
      <IzborIzvjestaja
        dateRange={dateRange}
        setDateRange={setDateRange}
        onHandlePrint={handlePrint}
        //title={title}
      />
      {isLoading && (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "24%" }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      )}
      {isError && (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "24%" }}
        >
          <p>Error: {error.message}</p>
        </Box>
      )}
      {!isLoading && izvjestaj.naziv === "naplaceno" && (
        <Naplaceno
          podaci={izvjestaj.data}
          dateRange={dateRange}
          memorandum={memorandum}
          ref={componentRef}
        />
      )}
      {!isLoading && izvjestaj.naziv === "naplaceno_po_pacijentu" && (
        <NaplacenoPoPacijentu
          podaci={izvjestaj.data}
          dateRange={dateRange}
          memorandum={memorandum}
          ref={componentRef}
        />
      )}
      {!isLoading && izvjestaj.naziv === "naplaceno_komercijalno" && (
        <NaplacenoKomercijalno
          podaci={izvjestaj.data}
          dateRange={dateRange}
          memorandum={memorandum}
          ref={componentRef}
        />
      )}
      {!isLoading && izvjestaj.naziv === "realizacija" && (
        <Realizacija
          podaci_komercijalnih={realizacijaKomercijalnih}
          podaci_osiguranih={izvjestaj.data}
          dateRange={dateRange}
          memorandum={memorandum}
          ref={componentRef}
        />
      )}
      {!isLoading && izvjestaj.naziv === "usluge_pokio_zbirno" && (
        <UslugeKIOzbirno
          podaci={izvjestaj.data}
          dateRange={dateRange}
          memorandum={memorandum}
          ref={componentRef}
        />
      )}
      {!isLoading && izvjestaj.naziv === "usluge_po_kio" && (
        <UslugeKIO
          podaci={izvjestaj.data}
          dateRange={dateRange}
          memorandum={memorandum}
          ref={componentRef}
        />
      )}
      {!isLoading && izvjestaj.naziv === "usluge_zb_grupe" && (
        <UslugeZBgrupe
          podaci={izvjestaj.data}
          dateRange={dateRange}
          memorandum={memorandum}
          ref={componentRef}
        />
      )}
      {!isLoading && izvjestaj.naziv === "usluge_zbirno_ukupno" && (
        <UslugeZbirno
          podaci={izvjestaj.data}
          dateRange={dateRange}
          memorandum={memorandum}
          ref={componentRef}
        />
      )}
      {!isLoading && izvjestaj.naziv === "usluge_starosne_grupe" && (
        <UslugeSG
          podaci={izvjestaj.data}
          dateRange={dateRange}
          memorandum={memorandum}
          ref={componentRef}
        />
      )}
      {!isLoading && izvjestaj.naziv === "usluge_doktori" && (
        <UslugeDoktori
          podaci={izvjestaj.data}
          dateRange={dateRange}
          memorandum={memorandum}
          ref={componentRef}
        />
      )}
      {!isLoading && izvjestaj.naziv === "br_pacijenata" && (
        <BrPacijenata
          podaci={izvjestaj.data}
          dateRange={dateRange}
          memorandum={memorandum}
          ref={componentRef}
        />
      )}
      {!isLoading && izvjestaj.naziv === "br_pacijenata_korisnik" && (
        <BrPacijenataKorisnik
          podaci={izvjestaj.data}
          dateRange={dateRange}
          memorandum={memorandum}
          ref={componentRef}
        />
      )}
      {!isLoading &&
        (izvjestaj.naziv === "protokol_ambulantni" ||
          izvjestaj.naziv === "protokol_bolnicki") && (
          <Protokol
            podaci={izvjestaj.data}
            dateRange={dateRange}
            protokol={izvjestaj.naziv === "protokol_ambulantni" ? 1 : 2}
            memorandum={memorandum}
            ref={componentRef}
          />
        )}
      {!isLoading && izvjestaj.naziv === "stornirano" && (
        <Storno
          podaci={izvjestaj.data}
          dateRange={dateRange}
          memorandum={memorandum}
          ref={componentRef}
        />
      )}
    </Fragment>
  );
};

export default Izvjestaji;
