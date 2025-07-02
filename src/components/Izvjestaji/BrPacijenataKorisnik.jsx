import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import "./BrPacijenataKorisnik.css";

const BrPacijenataKorisnik = React.forwardRef(
  ({ podaci, dateRange, memorandum }, ref) => {
    const [ukupno, setUkupno] = useState(0);
    //console.log("podaci", podaci, podaci.length, Object.keys(podaci).length);
    useEffect(() => {
      if (podaci.length > 0) {
        let ukupno_pac = podaci.reduce(
          (a, b) => a + Number(b.br_pacijenata),
          0
        );
        setUkupno(ukupno_pac);
      }
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
                Broj primljenih pacijenata po personalu(korisnicima) za period{" "}
                {dateRange.datumOd} - {dateRange.datumDo}
              </h2>
            </div>
            <div className="izvjestaj_body uzi_body">
              <div className="brpk_table">
                <div>Redni br.</div>
                <div>Prezime i ime</div>
                <div>Broj primljenih pacijenata</div>
              </div>
              {podaci.map((korisnik, index) => (
                <div
                  key={korisnik.korisnik}
                  className={`brpk_row ${
                    index === podaci.length - 1 ? "last-row" : ""
                  }`}
                >
                  <p>{podaci.indexOf(korisnik) + 1}</p>
                  <p>
                    {korisnik.prezime} {korisnik.ime}
                  </p>
                  <p>{korisnik.br_pacijenata}</p>
                </div>
              ))}
              <div className="brpk_ukupno">
                <p>UKUPNO PRIMLJENIH PACIJENATA:</p>
                <p>{ukupno}</p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

export default BrPacijenataKorisnik;
