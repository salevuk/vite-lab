import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import "./UslugeZBgrupe.css";

const UslugeZBgrupe = React.forwardRef(
  ({ podaci, dateRange, memorandum }, ref) => {
    //console.log("podaci zb grupe", podaci);
    const [ukupno, setUkupno] = useState({});

    useEffect(() => {
      // Inicijalizacija promenljivih
      let ukupnoBrBolnickih = 0;
      let ukupnoNaplacenaParticipacija = 0;
      let ukupnoObavezniVid = 0;
      let ukupnoNeosigurani = 0;
      let ukupnoBrAmbulantnih = 0;
      let ukupnoHitne = 0;
      let ukupnoUkupnoPretraga = 0;
      // Iteracija kroz sve usluge i dodavanje
      podaci.forEach((usluga) => {
        ukupnoBrBolnickih += usluga.br_bolnickih;
        ukupnoNaplacenaParticipacija += usluga.naplacena_participacija;
        ukupnoObavezniVid += usluga.obavezni_vid;
        ukupnoNeosigurani += usluga.neosigurani;
        ukupnoBrAmbulantnih += usluga.br_ambulantnih;
        ukupnoHitne += usluga.hitne;
        ukupnoUkupnoPretraga += usluga.ukupno_pretraga;
      });

      setUkupno({
        ukupnoBrBolnickih: ukupnoBrBolnickih,
        ukupnoNaplacenaParticipacija: ukupnoNaplacenaParticipacija,
        ukupnoObavezniVid: ukupnoObavezniVid,
        ukupnoNeosigurani: ukupnoNeosigurani,
        ukupnoBrAmbulantnih: ukupnoBrAmbulantnih,
        ukupnoHitne: ukupnoHitne,
        ukupnoUkupnoPretraga: ukupnoUkupnoPretraga,
      });
    }, [podaci]);

    return (
      <>
        {podaci.length === 0 && (
          <Box
            sx={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
          >
            <h2 style={{ color: "#d8315b", width: "max-content" }}>
              Za odabrani raspon datuma nema podataka
            </h2>
          </Box>
        )}
        {podaci.length > 0 && (
          <div className="izvjestaj" ref={ref}>
            <div className="izvjestaj_header">
              <div dangerouslySetInnerHTML={{ __html: memorandum }}></div>
              <h3>ZAVOD ZA KLINIČKU LABORATORIJSKU DIJAGNOSTIKU</h3>
            </div>
            <div className="izvjestaj_podheader">
              <h2>
                PRETRAGE (USLUGE) - ZBIRNO za period {dateRange.datumOd} -{" "}
                {dateRange.datumDo}
              </h2>
            </div>
            <div className="izvjestaj_body">
              <div className="zbgrupe_table">
                <div>Šifra</div>
                <div>Usluga</div>
                <div>Br. bolničkih pretraga</div>
                <div>Naplaćena participacija</div>
                <div>Obavezni vid</div>
                <div>Neosigurana lica</div>
                <div>Br. ambulatnih pretraga</div>
                <div>Hitne pretrage</div>
                <div>Ukupno pretraga</div>
              </div>
              {podaci.map((usluga, index) => (
                <div
                  key={usluga.sifra_usluge}
                  className={`zbgrupe_row ${
                    index === podaci.length - 1 ? "last-row" : ""
                  }`}
                >
                  <p>{usluga.sifra_usluge}</p>
                  <p>{usluga.naziv}</p>
                  <p>{usluga.br_bolnickih}</p>
                  <p>{usluga.naplacena_participacija}</p>
                  <p>{usluga.obavezni_vid}</p>
                  <p>{usluga.neosigurani}</p>
                  <p>{usluga.br_ambulantnih}</p>
                  <p>{usluga.hitne}</p>
                  <p>{usluga.ukupno_pretraga}</p>
                </div>
              ))}
              {Object.keys(ukupno).length > 0 && (
                <div className="zbgrupe_row_ukupno">
                  <p>UKUPNO:</p>
                  <p>{ukupno.ukupnoBrBolnickih}</p>
                  <p>{ukupno.ukupnoNaplacenaParticipacija}</p>
                  <p>{ukupno.ukupnoObavezniVid}</p>
                  <p>{ukupno.ukupnoNeosigurani}</p>
                  <p>{ukupno.ukupnoBrAmbulantnih}</p>
                  <p>{ukupno.ukupnoHitne}</p>
                  <p>{ukupno.ukupnoUkupnoPretraga}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
);

export default UslugeZBgrupe;
