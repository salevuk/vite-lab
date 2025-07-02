import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import "./UslugeZbirno.css";

const UslugeZbirno = React.forwardRef(
  ({ podaci, dateRange, memorandum }, ref) => {
    //console.log("podaci zbirno", podaci);

    const [ukupno, setUkupno] = useState(0);

    useEffect(() => {
      let ukupnoPretraga = 0;
      podaci.forEach((usluga) => {
        ukupnoPretraga += usluga.ukupno_pretraga;
      });
      setUkupno(ukupnoPretraga);
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
                PRUŽENE USLUGE - ZBIRNO za period {dateRange.datumOd} -{" "}
                {dateRange.datumDo}
              </h2>
            </div>
            <div className="izvjestaj_body">
              <div className="zbukupno_table">
                <div>Šifra</div>
                <div>Usluga</div>
                <div>Br. pretraga</div>
              </div>
              {podaci.map((usluga) => (
                <div key={usluga.sifra_usluge} className="zbukupno_row">
                  <p>{usluga.sifra_usluge}</p>
                  <p>{usluga.naziv}</p>
                  <p>{usluga.ukupno_pretraga}</p>
                </div>
              ))}
              <div className="zbukupno_ukupno">
                <p>UKUPNO:</p>
                <p>{ukupno}</p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

export default UslugeZbirno;
