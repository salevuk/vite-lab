import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import "./NaplacenoKomercijalno.css";

const NaplacenoKomercijalno = React.forwardRef(
  ({ podaci, dateRange, memorandum }, ref) => {
    const [ukupno, setUkupno] = useState(0);

    useEffect(() => {
      if (podaci.length > 0) {
        /* let ukupno = 0;
      podaci.map((item) => (ukupno += item.pacijent_ukupno));
      seUkupno(ukupno); */
        setUkupno(
          podaci.reduce((acc, item) => {
            return acc + Number(item.pacijent_ukupno);
          }, 0)
        );
      }
    }, [podaci]);

    return (
      <>
        {podaci.length === 0 && (
          <Box
            sx={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
          >
            <h2 style={{ color: "#d8315b", width: "max-content" }}>
              Za odabrani raspon datuma nema podataka naplaćenih komercijalnih
              usluga
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
                Pregled naplaćenih komercijalnih usluga za period{" "}
                {dateRange.datumOd} - {dateRange.datumDo}
              </h2>
            </div>
            <div className="izvjestaj_body">
              <div className="naplacenokom_table">
                <div>Šifra</div>
                <div>Naziv</div>
                <div>Br. usluga</div>
                <div>Pacijent</div>
                <div>Ukupno</div>
              </div>
              {podaci.map((pretraga, index) => (
                <div
                  className={`naplacenokom_row ${
                    index === podaci.length - 1 ? "last-row" : ""
                  }`}
                >
                  <p>{pretraga.sifra_usluge}</p>
                  <p>{pretraga.naziv}</p>
                  <p>{pretraga.broj_usluga}</p>
                  <p>{pretraga.pacijent}</p>
                  <p>{pretraga.pacijent_ukupno}</p>
                </div>
              ))}
              <div className="naplacenokom_ukupno">
                <p>UKUPNO:</p>
                <p>{ukupno.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

export default NaplacenoKomercijalno;
