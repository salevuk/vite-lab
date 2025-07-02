import React from "react";
import Box from "@mui/material/Box";
import "dayjs/locale/sr";
import "./NaplacenoPoPacijentu.css";

const NaplacenoPoPacijentu = React.forwardRef(
  ({ podaci, dateRange, memorandum }, ref) => {
    //console.log("podaci naplaceno po pacijentu", podaci);
    return (
      <>
        {podaci.length === 0 && (
          <Box
            sx={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
          >
            <h2 style={{ color: "#d8315b", width: "max-content" }}>
              Za odabrani raspon datuma nema podataka naplaćenog po pacijentima
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
                Pregled naplaćenog po pacijentima za period {dateRange.datumOd}{" "}
                - {dateRange.datumDo}
              </h2>
            </div>
            <div className="izvjestaj_body">
              {podaci.map((korisnik) => (
                <>
                  <p className="naplacenopp_korisnik">
                    Korisnik : {korisnik.prezime} {korisnik.ime}
                  </p>
                  <div className="naplacenopp_table">
                    <div>Redni br.</div>
                    <div>Lab. broj</div>
                    <div>Pacijent JMBG</div>
                    <div>Prezime i ime</div>
                    <div>Status opis</div>
                    <div>Naplaćeno</div>
                  </div>
                  {korisnik.pacijenti
                    .sort((a, b) => {
                      const prezimeA = a.pacijent_prezime.toLowerCase();
                      const prezimeB = b.pacijent_prezime.toLowerCase();
                      const rezultat = prezimeA.localeCompare(prezimeB, "hr");
                      if (rezultat !== 0) return rezultat;
                      // Ako su prezimena ista, sortiraj po imenu
                      const imeA = a.pacijent_ime.toLowerCase();
                      const imeB = b.pacijent_ime.toLowerCase();
                      return imeA.localeCompare(imeB, "hr");
                    })
                    .map((pacijent, index) => (
                      <div className="naplacenopp_row">
                        <p>{index + 1}</p>
                        <p>{String(pacijent.id_uputnice)}</p>
                        <p>{pacijent.jmbg}</p>
                        <p>
                          {pacijent.pacijent_prezime.toUpperCase()}{" "}
                          {pacijent.pacijent_ime.toUpperCase()}
                        </p>
                        <p>{pacijent.status_opis}</p>
                        <p>{pacijent.ukupna_participacija}</p>
                      </div>
                    ))}
                  {
                    <div className="naplacenopp_ukupno">
                      <p>
                        UKUPNO ZA: {korisnik.prezime} {korisnik.ime}
                      </p>
                      <p>{korisnik.ukupno}</p>
                    </div>
                  }
                </>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }
);

export default NaplacenoPoPacijentu;
