import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import "./UslugeKIOzbirno.css";

const UslugeKIOzbirno = React.forwardRef(
  ({ podaci, dateRange, memorandum }, ref) => {
    //console.log("PODACI KIOZBIRNO", podaci);
    const [ukupno, setUkupno] = useState({});

    useEffect(() => {
      let ukupnoBrUsluga = 0;
      let ukupnoIznos = 0;
      podaci.forEach((tipUputnice) => {
        ukupnoBrUsluga += tipUputnice.broj_usluga;
        ukupnoIznos += tipUputnice.ukupno_iznos;
      });
      setUkupno({ ukupnoBrUsluga: ukupnoBrUsluga, ukupnoIznos: ukupnoIznos });
    }, [podaci]);
    //console.log("ukupno kiozbirno", ukupno);
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
                PRUŽENE USLUGE ZBIRNO - grupisano za period {dateRange.datumOd}{" "}
                - {dateRange.datumDo}
              </h2>
            </div>
            <div className="izvjestaj_body">
              {podaci.map((tipUputnice) => (
                <>
                  <p className="kiozbirno_klinika">{tipUputnice.vrsta}</p>
                  {tipUputnice.klinike.map((klinika) => (
                    <div
                      key={klinika.klinika}
                      className="kiozbirno_klinika_body"
                    >
                      <p className="kiozbirno_klinika_naziv">
                        KLINIKA: {klinika.klinika} - {klinika.klinika_naziv}
                      </p>
                      <div className="kiozbirno_table">
                        <div>Odjel</div>
                        <div>Br. usluga</div>
                        <div>Iznos</div>
                      </div>
                      {klinika.odjeli.map((odjel, index) => (
                        <div
                          key={odjel.odjel}
                          className={`kiozbirno_row ${
                            index === klinika.odjeli.length - 1
                              ? "last-row"
                              : ""
                          }`}
                        >
                          <p>
                            {odjel.odjel} - {odjel.odjel_naziv}
                          </p>
                          <p>{odjel.broj_usluga}</p>
                          <p>{odjel.ukupno_iznos.toFixed(2)}</p>
                        </div>
                      ))}
                      {
                        <div className="kiozbirno_ukupno">
                          <p>UKUPNO ZA KLINIKU: {klinika.klinika}</p>
                          <p>{klinika.broj_usluga}</p>
                          <p>{klinika.ukupno_iznos.toFixed(2)}</p>
                        </div>
                      }
                    </div>
                  ))}
                </>
              ))}
              {Object.keys(ukupno).length > 0 && (
                <div className="kiozbirno_ukupno">
                  <p>UKUPNO:</p>
                  <p>{ukupno.ukupnoBrUsluga}</p>
                  <p>{ukupno.ukupnoIznos.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
);

export default UslugeKIOzbirno;
