import dayjs from "dayjs";
import { useEffect, useState, useCallback } from "react";

const Popravak = () => {
  const [uputnice, setUputnice] = useState([]);
  const povuciUputnice = useCallback(async () => {
    const response = await fetch(`../rpc/laboratorija.cfc?method=provjera2`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return await response.json();
  }, []);
  const popraviUputnicu = async (
    id_uputnice,
    status_osiguranja,
    vid_osiguranja,
    ukupna_participacija,
    ukupno_fond
  ) => {
    const newData = new URLSearchParams();
    newData.append("id_uputnice", id_uputnice);
    newData.append("status_osiguranja", status_osiguranja);
    newData.append("vid_osiguranja", vid_osiguranja);
    newData.append("ukupna_participacija", ukupna_participacija);
    newData.append("ukupno_fond", ukupno_fond);
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=popravak_obracuna`,
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

  useEffect(() => {
    if (uputnice.length > 0) return;
    povuciUputnice().then((r) => setUputnice(r.lista_b_uputnica));
  }, []);

  /* const extractDatumRodjenja = useCallback((jmbg) => {
         if (
      typeof jmbg !== "string" ||
      jmbg.length !== 13 ||
      !/^\d{13}$/.test(jmbg)
    ) {
      throw new Error("Neispravan JMBG format");
    } 

    let day = jmbg.substring(0, 2);
    let month = jmbg.substring(2, 4);
    let year = jmbg.substring(4, 7);
    // Ako je godina manja od 800, dodajemo 2000, inače 1000 tj. 1900 (jer se koriste 19xx i 20xx godine)
    let fullYear = parseInt(year, 10) < 800 ? `2${year}` : `1${year}`;

    return `${day}.${month}.${fullYear}`;
  }, []);*/

  /*  useEffect(() => {
    if (uputnice.length > 0) return;
    povuciUputnice().then((r) => {
      let filtrirane = r.lista.filter((u) => {
        const jmbgStartsWith =
          u.jmbg.startsWith("5885") || u.jmbg.startsWith("8000");
        if (jmbgStartsWith) return false;
        return (
          extractDatumRodjenja(u.jmbg) !==
          dayjs(u.datum_rodjenja).format("DD.MM.YYYY")
        );
      });
      setUputnice(filtrirane);
    });
  }, []); */

  const popravi = () => {
    uputnice.map((u) => {
      if (u.vrsta === 2 || u.vrsta === 3) {
        let podaciUputnice = {
          id: u.id,
          status_osiguranja: u.status_osiguranja,
          vid_osiguranja: u.vid_osiguranja,
          ukupna_participacija: 0,
          ukupno_fond: 0,
        };

        let ukupna_participacija = u.pretrage
          .reduce(function (a, c) {
            return a + Number(c.fond_participacija);
          }, 0)
          .toFixed(2);
        let ukupno_fond = u.pretrage
          .reduce(function (a, c) {
            return a + Number(c.fond_cijena);
          }, 0)
          .toFixed(2);
        //PODRAZUMJEVANO SU BOLNIČKE VRSTA 2 ILI 3
        if (u.status_osiguranja === "0") {
          let ukupna_mpc_cijena = u.pretrage
            .reduce(function (a, c) {
              return a + Number(c.mpc_cijena);
            }, 0)
            .toFixed(2);
          podaciUputnice.ukupna_participacija = ukupna_mpc_cijena;
          //podaciUputnice.ukupno_fond(0);
        } else if (u.status_osiguranja === "1") {
          if (u.vid_osiguranja === 6 /*OZ*/) {
            podaciUputnice.ukupno_fond =
              Number(ukupno_fond) - Number(ukupna_participacija);
            podaciUputnice.ukupna_participacija = ukupna_participacija;
          }
          if (u.vid_osiguranja === 1 /*OB*/ || u.vid_osiguranja === 0) {
            podaciUputnice.ukupno_fond = ukupno_fond;
            //podaciUputnice.ukupna_participacija(0);
          }
        }
        console.log("PODACI UPUTNICE", podaciUputnice);
        /*  popraviUputnicu(
          podaciUputnice.id,
          podaciUputnice.status_osiguranja,
          podaciUputnice.vid_osiguranja,
          podaciUputnice.ukupna_participacija,
          podaciUputnice.ukupno_fond
        ); */
      } else {
        let podaciUputnice = {
          id: u.id,
          status_osiguranja: u.status_osiguranja,
          vid_osiguranja: u.vid_osiguranja,
          ukupna_participacija: 0,
          ukupno_fond: 0,
        };
        let ukupna_participacija = u.pretrage
          .reduce(function (a, c) {
            return a + Number(c.kolicina) * Number(c.fond_participacija);
          }, 0)
          .toFixed(2);
        let ukupno_fond = u.pretrage
          .reduce(function (a, c) {
            return a + Number(c.kolicina) * Number(c.fond_cijena);
          }, 0)
          .toFixed(2);
        if (u.status_osiguranja === "0" || u.komerc_placanje === 1) {
          let ukupna_mpc_cijena = u.pretrage
            .reduce(function (a, c) {
              return a + Number(c.kolicina) * Number(c.mpc_cijena);
            }, 0)
            .toFixed(2);
          podaciUputnice.ukupna_participacija = ukupna_mpc_cijena;
          //podaciUputnice.ukupno_fond(0);
        } else if (
          u.status_osiguranja === "1" &&
          u.komerc_placanje === 0 &&
          u.po_ugovoru === 0
        ) {
          if (u.bez_participacije === 1) {
            podaciUputnice.ukupno_fond = ukupno_fond;
          }
          if (u.bez_participacije === 0) {
            podaciUputnice.ukupno_fond =
              Number(ukupno_fond) - Number(ukupna_participacija);
            podaciUputnice.ukupna_participacija = ukupna_participacija;
          }
        } else if (u.po_ugovoru === 1) {
          podaciUputnice.ukupno_fond = 0;
          podaciUputnice.ukupna_participacija = 0;
        }
        console.log("PODACI UPUTNICE", podaciUputnice);
        popraviUputnicu(
          podaciUputnice.id,
          podaciUputnice.status_osiguranja,
          podaciUputnice.vid_osiguranja,
          podaciUputnice.ukupna_participacija,
          podaciUputnice.ukupno_fond
        );
      }
    });
  };

  /*   const data = [
    {
      LIS_sifra_narudzbe: "930004759",
      Sifra_pretrage: "100",
      Skraceni_naziv_pretrage: "E",
      Dugi_naziv_pretrage: "Eritrociti",
      Rezultat: "4.69",
      Flag: "",
      Mjerna_jedinica: "[1e12]/L",
      Referentni_interval: "4.34 - 5.72",
      Napomena: "",
    },
    {
      LIS_sifra_narudzbe: "930004759",
      Sifra_pretrage: "105",
      Skraceni_naziv_pretrage: "WBC",
      Dugi_naziv_pretrage: "Leukociti",
      Rezultat: "u izradi",
      Flag: "",
      Mjerna_jedinica: "[1e9]/L",
      Referentni_interval: "3,40 - 9,70",
      Napomena: "",
    },
  ]; */
  /* const posaljiRezultate = async () => {
    const response = await fetch(
      "path/to/finalni_labrezultati.cfc?method=finalni_labrezultati&data=" +
        encodeURIComponent(JSON.stringify(data))
    )
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
    return await response.json();
  }; */

  console.log("UPUTNICE ZA POPRAVAK", uputnice);
  return (
    <div style={{ margin: "2em 4em", overflowY: "scroll" }}>
      <button onClick={() => popravi()}>PRONAĐI</button>
      {uputnice.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>LAB BR</th>
              <th>JMBG</th>
              <th>Datum rođenja</th>
            </tr>
          </thead>
          <tbody>
            {uputnice.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.jmbg}</td>
                <td>{dayjs(u.datum_rodjenja).format("DD.MM.YYYY")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Popravak;
