import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { obradaTransformer } from "../util/transformer";
import "./Naplaceno.css";

const Naplaceno = React.forwardRef(({ podaci, dateRange, memorandum }, ref) => {
  const [obradjeniPodaci, setObradjeniPodaci] = useState([]);

  useEffect(() => {
    obradaTransformer(podaci, setObradjeniPodaci);
  }, [podaci]);
  //console.log("podaci", podaci);
  return (
    <>
      {obradjeniPodaci.length === 0 && (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
        >
          <h2 style={{ color: "#d8315b", width: "max-content" }}>
            Za odabrani raspon datuma nema podataka naplaćenih usluga
          </h2>
        </Box>
      )}
      {obradjeniPodaci.length > 0 && (
        <div className="izvjestaj" ref={ref}>
          <div className="izvjestaj_header">
            <div dangerouslySetInnerHTML={{ __html: memorandum }}></div>
            <h3>ZAVOD ZA KLINIČKU LABORATORIJSKU DIJAGNOSTIKU</h3>
          </div>
          <div className="izvjestaj_podheader">
            <h2>
              Pregled naplaćenih usluga za period {dateRange.datumOd} -{" "}
              {dateRange.datumDo}
            </h2>
          </div>
          <div className="izvjestaj_body">
            {obradjeniPodaci.map((korisnik) => (
              <>
                <p className="naplaceno_korisnik">
                  Korisnik : {korisnik.prezime} {korisnik.ime}
                </p>
                <div className="naplaceno_table">
                  <div>Šifra</div>
                  <div>Naziv</div>
                  <div>Status pl.</div>
                  <div>Br. usluga</div>
                  <div>Pacijent</div>
                  <div>Pac. ukupno</div>
                  <div>Fond</div>
                  <div>Fond ukupno</div>
                  <div>Ukupno</div>
                </div>
                {korisnik.pretrage.map((p) =>
                  p.map((pretraga) => (
                    <div className="naplaceno_row">
                      <p>{pretraga.sifra_usluge}</p>
                      <p>{pretraga.naziv}</p>
                      <p>{pretraga.status_opis}</p>
                      <p>{pretraga.broj_usluga}</p>
                      <p>{pretraga.pacijent}</p>
                      <p>{pretraga.pacijent_ukupno}</p>
                      <p>{pretraga.fond}</p>
                      <p>{pretraga.fond_ukupno}</p>
                      <p>{pretraga.ukupno}</p>
                    </div>
                  ))
                )}
                <div className="naplaceno_ukupno">
                  <p>
                    UKUPNO ZA: {korisnik.prezime} {korisnik.ime}
                  </p>
                  <p>{korisnik.ukupno_br_usluga}</p>
                  <p></p>
                  <p>{korisnik.ukupno_pacijent_placa}</p>
                  <p></p>
                  <p>{korisnik.ukupno_fond_placa}</p>
                  <p>{korisnik.ukupno_ukupno}</p>
                </div>
              </>
            ))}
          </div>
        </div>
      )}
    </>
  );
});
export default Naplaceno;
