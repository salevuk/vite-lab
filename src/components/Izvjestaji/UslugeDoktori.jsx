import React, { useEffect, useState } from "react";
import { useStore } from "../../store";
import Box from "@mui/material/Box";
import "./UslugeDoktori.css";

const UslugeDoktori = React.forwardRef(
  ({ podaci, dateRange, memorandum }, ref) => {
    //console.warn("USLUGE PO DOKTORIMA", podaci);
    const [ukupno, setUkupno] = useState(0);
    const [filtriraniPodaci, setFiltriraniPodaci] = useState([]);
    const odabraniDoktor = useStore((store) => store.odabraniDoktor);
    //console.log("ODABRANI DOKTOR", odabraniDoktor);

    useEffect(() => {
      let filteredPodaci = podaci;

      if (odabraniDoktor.value !== "") {
        // Ako je odabran doktor, filtriraj po njemu
        filteredPodaci = podaci
          .filter(
            (klinika) => Number(klinika.klinika) === odabraniDoktor.klinika
          )
          .map((klinika) => ({
            ...klinika,
            doktori: klinika.doktori.filter(
              (doktor) => Number(doktor.doktor) === odabraniDoktor.value
            ),
          }));
        //console.log("filteredPodaci 1", filteredPodaci);
      }

      let ukupno = 0;
      filteredPodaci.forEach((klinika) => {
        ukupno += Number(klinika.ukupno_iznos);
      });
      //console.log("filteredPodaci 2", ukupno);
      setUkupno(ukupno);
      setFiltriraniPodaci([...filteredPodaci]);
    }, [podaci, odabraniDoktor]);

    /* useEffect(() => {
      let ukupno = 0;
      podaci.map((item) => (ukupno += Number(item.ukupno_iznos)));
      setUkupno(ukupno);
    }, [podaci]); */
    //console.warn("FILTRIRANE USLUGE PO DOKTORIMA", filtriraniPodaci);
    return (
      <>
        {filtriraniPodaci.length === 0 && (
          <Box
            sx={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
          >
            <h2 style={{ color: "#d8315b", width: "max-content" }}>
              Za odabrani raspon datuma nema podataka
            </h2>
          </Box>
        )}
        {filtriraniPodaci.length > 0 && (
          <div className="izvjestaj" ref={ref}>
            <div className="izvjestaj_header">
              <div dangerouslySetInnerHTML={{ __html: memorandum }}></div>
              <h3>ZAVOD ZA KLINIČKU LABORATORIJSKU DIJAGNOSTIKU</h3>
            </div>
            <div className="izvjestaj_podheader">
              <h2>
                TRAŽENE PRETRAGE (USLUGE) PO DOKTORIMA za period{" "}
                {dateRange.datumOd} - {dateRange.datumDo}
              </h2>
            </div>
            <div className="izvjestaj_body">
              {filtriraniPodaci.map((klinika) => (
                <React.Fragment key={klinika.klinika}>
                  <p className="podokt_klinika">
                    {klinika.klinika} - {klinika.klinika_naziv}
                  </p>
                  {klinika.doktori.map((doktor) => (
                    <div
                      key={`${klinika.klinika}-${doktor.doktor}`}
                      className="podokt_klinika_body"
                    >
                      <p className="podokt_klinika_naziv">
                        DOKTOR: {doktor.prezime} {doktor.ime}
                      </p>
                      <div className="podokt_table">
                        <div>Redni br.</div>
                        <div>Usluga</div>
                        <div>Količina</div>
                        <div>Iznos</div>
                      </div>
                      {doktor.usluge.map((usluga, index) => (
                        <div
                          key={usluga.sifra_usluge}
                          className={`podokt_row ${
                            index === doktor.usluge.length - 1 ? "last-row" : ""
                          }`}
                        >
                          <p>{doktor.usluge.indexOf(usluga) + 1}</p>
                          <p>
                            {usluga.sifra_usluge} {usluga.naziv}
                          </p>
                          <p>{usluga.kolicina}</p>
                          <p>{usluga.ukupno_iznos}</p>
                        </div>
                      ))}
                      {
                        <div className="podokt_ukupno">
                          <p>
                            UKUPNO DOKTOR: {doktor.prezime} {doktor.ime}
                          </p>
                          <p>{doktor.ukupno_iznos}</p>
                        </div>
                      }
                    </div>
                  ))}
                  {odabraniDoktor.value === "" && (
                    <div className="podokt_ukupno_klinika">
                      <p>
                        UKUPNO KLINIKA: {klinika.klinika} -{" "}
                        {klinika.klinika_naziv}
                      </p>
                      <p>{klinika.ukupno_iznos}</p>
                    </div>
                  )}
                </React.Fragment>
              ))}
              {odabraniDoktor.value === "" && (
                <div className="podokt_ukupno_klinika">
                  <p>UKUPNO:</p>
                  <p>{ukupno.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
);
export default UslugeDoktori;
