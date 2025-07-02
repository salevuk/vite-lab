import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import "./Realizacija.css";

const Realizacija = React.forwardRef(
  ({ podaci_komercijalnih, podaci_osiguranih, dateRange, memorandum }, ref) => {
    const [ukupnoKomercijalno, setUkupnoKomercijalno] = useState(0);
    const [ukupnoOsigurano, setUkupnoOsigurano] = useState(0);

    useEffect(() => {
      if (podaci_komercijalnih.length > 0) {
        /* let ukupno = 0;
        podaci.map((item) => (ukupno += item.pacijent_ukupno));
        seUkupno(ukupno); */
        setUkupnoKomercijalno(
          podaci_komercijalnih.reduce((acc, item) => {
            return acc + Number(item.iznos);
          }, 0)
        );
      }
      if (podaci_osiguranih.length > 0) {
        /* let ukupno = 0;
        podaci.map((item) => (ukupno += item.pacijent_ukupno));
        seUkupno(ukupno); */
        setUkupnoOsigurano(
          podaci_osiguranih.reduce((acc, item) => {
            return acc + Number(item.iznos);
          }, 0)
        );
      }
    }, [podaci_komercijalnih, podaci_osiguranih]);

    return (
      <>
        {podaci_komercijalnih.length === 0 &&
          podaci_osiguranih.length === 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20%",
              }}
            >
              <h2 style={{ color: "#d8315b", width: "max-content" }}>
                Za odabrani raspon datuma nema podataka naplaćenih komercijalnih
                usluga
              </h2>
            </Box>
          )}
        {((podaci_komercijalnih.length > 0 && podaci_osiguranih.length > 0) ||
          (podaci_komercijalnih.length > 0 && podaci_osiguranih.length === 0) ||
          (podaci_komercijalnih.length === 0 &&
            podaci_osiguranih.length > 0)) && (
          <div className="izvjestaj" ref={ref}>
            <div className="izvjestaj_header">
              <div dangerouslySetInnerHTML={{ __html: memorandum }}></div>
              <h3>ZAVOD ZA KLINIČKU LABORATORIJSKU DIJAGNOSTIKU</h3>
            </div>
            <div className="izvjestaj_podheader">
              <h2>
                izvjestaj službe za period {dateRange.datumOd} -{" "}
                {dateRange.datumDo}
              </h2>
            </div>
            <div className="izvjestaj_body">
              <h3>Komercijalne</h3>
              <div className="realizacija_table">
                <div>Šifra</div>
                <div>Naziv usluge</div>
                <div>Vid osiguranja</div>
                <div>Br. usluga</div>
                <div>Iznos</div>
              </div>
              {podaci_komercijalnih.map((usluga, index) => (
                <div
                  className={`realizacija_row ${
                    index === podaci_komercijalnih.length - 1 ? "last-row" : ""
                  }`}
                  key={usluga.sifra_usluge}
                >
                  <p>{usluga.sifra_usluge}</p>
                  <p>{usluga.naziv}</p>
                  <p>{usluga.vid_osiguranja}</p>
                  <p>{usluga.br_usluga}</p>
                  <p>{usluga.iznos}</p>
                </div>
              ))}
              <div className="realizacija_ukupno">
                <p>UKUPNO:</p>
                <p>{ukupnoKomercijalno.toFixed(2)}</p>
              </div>
              <h3 className="pagebreak">Osigurane</h3>
              <div className="realizacija_table">
                <div>Šifra</div>
                <div>Naziv usluge</div>
                <div>Vid osiguranja</div>
                <div>Br. usluga</div>
                <div>Iznos</div>
              </div>
              {podaci_osiguranih.map((usluga) => (
                <div className="realizacija_row" key={usluga.sifra_usluge}>
                  <p>{usluga.sifra_usluge}</p>
                  <p>{usluga.naziv}</p>
                  <p>{usluga.vid_osiguranja}</p>
                  <p>{usluga.br_usluga}</p>
                  <p>{usluga.iznos}</p>
                </div>
              ))}
              <div className="realizacija_ukupno">
                <p>UKUPNO:</p>
                <p>{ukupnoOsigurano.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);
export default Realizacija;
