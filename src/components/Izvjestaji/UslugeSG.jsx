import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import "./UslugeSG.css";

const UslugeSG = React.forwardRef(({ podaci, dateRange, memorandum }, ref) => {
  //console.log("podaci sg usluge", podaci);

  const [ukupno, setUkupno] = useState({});

  useEffect(() => {
    // Inicijalizacija promenljivih
    let ukupnoPrvaGrupa = 0;
    let ukupnoDrugaGrupa = 0;
    let ukupnoTrecaGrupa = 0;
    let ukupnoCetvrtaGrupa = 0;
    let ukupnoPetaGrupa = 0;
    let ukupnoSestaGrupa = 0;
    let ukupnoPretraga = 0;
    // Iteracija kroz sve usluge i dodavanje
    podaci.forEach((usluga) => {
      ukupnoPrvaGrupa += usluga.prva_grupa;
      ukupnoDrugaGrupa += usluga.druga_grupa;
      ukupnoTrecaGrupa += usluga.treca_grupa;
      ukupnoCetvrtaGrupa += usluga.cetvrta_grupa;
      ukupnoPetaGrupa += usluga.peta_grupa;
      ukupnoSestaGrupa += usluga.sesta_grupa;
      ukupnoPretraga += usluga.ukupno_pretraga;
    });

    setUkupno({
      ukupnoPrvaGrupa: ukupnoPrvaGrupa,
      ukupnoDrugaGrupa: ukupnoDrugaGrupa,
      ukupnoTrecaGrupa: ukupnoTrecaGrupa,
      ukupnoCetvrtaGrupa: ukupnoCetvrtaGrupa,
      ukupnoPetaGrupa: ukupnoPetaGrupa,
      ukupnoSestaGrupa: ukupnoSestaGrupa,
      ukupnoPretraga: ukupnoPretraga,
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
              PRUŽENE USLUGE za period {dateRange.datumOd} - {dateRange.datumDo}
            </h2>
          </div>
          <div className="izvjestaj_body">
            <div className="sgusluge_table">
              <div>Šifra</div>
              <div>Usluga</div>
              <div>0 - 1</div>
              <div>2 - 6</div>
              <div>7 - 15</div>
              <div>16 - 30</div>
              <div>31 - 64</div>
              <div>65 i više</div>
              <div>Ukupno</div>
            </div>
            {podaci.map((usluga) => (
              <div key={usluga.sifra_usluge} className="sgusluge_row">
                <p>{usluga.sifra_usluge}</p>
                <p>{usluga.naziv}</p>
                <p>{usluga.prva_grupa}</p>
                <p>{usluga.druga_grupa}</p>
                <p>{usluga.treca_grupa}</p>
                <p>{usluga.cetvrta_grupa}</p>
                <p>{usluga.peta_grupa}</p>
                <p>{usluga.sesta_grupa}</p>
                <p>{usluga.ukupno_pretraga}</p>
              </div>
            ))}
            {Object.keys(ukupno).length > 0 && (
              <div className="sgusluge_ukupno">
                <p>UKUPNO:</p>
                <p>{ukupno.ukupnoPrvaGrupa}</p>
                <p>{ukupno.ukupnoDrugaGrupa}</p>
                <p>{ukupno.ukupnoTrecaGrupa}</p>
                <p>{ukupno.ukupnoCetvrtaGrupa}</p>
                <p>{ukupno.ukupnoPetaGrupa}</p>
                <p>{ukupno.ukupnoSestaGrupa}</p>
                <p>{ukupno.ukupnoPretraga}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
});

export default UslugeSG;
