import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import "dayjs/locale/sr";
import "./Protokol.css";

const Protokol = React.forwardRef(
  ({ podaci, dateRange, memorandum, protokol }, ref) => {
    const [ukupno, setUkupno] = useState(0);
    useEffect(() => {
      if (podaci.length > 0) {
        let ukupno_participacija = podaci.reduce(
          (a, b) => a + Number(b.ukupna_participacija),
          0
        );
        setUkupno(ukupno_participacija);
      }
    }, [podaci]);
    //console.log("podaci protokol", podaci);
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
              {protokol === 1 && (
                <h2>
                  PROTOKOL POSJETA - ambulantni za period {dateRange.datumOd} -{" "}
                  {dateRange.datumDo}
                </h2>
              )}
              {protokol === 2 && (
                <h2>
                  PROTOKOL POSJETA - bolnički za period {dateRange.datumOd} -{" "}
                  {dateRange.datumDo}
                </h2>
              )}
            </div>
            <div className="izvjestaj_body">
              <div className="protokol_table">
                <div>Redni br.</div>
                <div>Datum</div>
                <div>LAB br.</div>
                <div>LIS br.</div>
                <div>Prezime i ime</div>
                <div>JMBG</div>
                <div>Participacija</div>
                <div>Vid osig.</div>
                <div>Odjel</div>
                <div>Storno</div>
              </div>
              {podaci
                .sort((a, b) => {
                  const prezimeA = a.prezime.toLowerCase();
                  const prezimeB = b.prezime.toLowerCase();
                  const rezultat = prezimeA.localeCompare(prezimeB, "hr");
                  if (rezultat !== 0) return rezultat;
                  // Ako su prezimena ista, sortiraj po imenu
                  const imeA = a.ime.toLowerCase();
                  const imeB = b.ime.toLowerCase();
                  return imeA.localeCompare(imeB, "hr");
                })
                .map((uputnica, index) => (
                  <>
                    <div
                      key={uputnica.lab_br}
                      className={`protokol_row ${
                        index === podaci.length - 1 ? "last-row" : ""
                      }`}
                    >
                      <p>{podaci.indexOf(uputnica) + 1}</p>
                      <p>{dayjs(uputnica.datum).format("DD.MM.YYYY")}</p>
                      <p className="numbers">{uputnica.lab_br}</p>
                      <p className="numbers">{uputnica.lis_br}</p>
                      <p>
                        {uputnica.prezime} {uputnica.ime}
                      </p>
                      <p className="numbers">{uputnica.jmbg}</p>
                      <p>{uputnica.ukupna_participacija.toFixed(2)}</p>
                      <p>{uputnica.vid_osiguranja}</p>
                      <p>{/* uputnica.odjel*/}</p>
                      <p>{uputnica.storno}</p>
                    </div>
                    {index > 0 && (index + 1) % 49 === 0 && (
                      <>
                        <div className="protokol_strana">
                          Strana {Math.floor((index + 1) / 49)}
                        </div>
                        <div className="pagebreak"></div>
                        <div className="protokol_header">
                          <div
                            dangerouslySetInnerHTML={{ __html: memorandum }}
                          ></div>
                          <h3>ZAVOD ZA KLINIČKU LABORATORIJSKU DIJAGNOSTIKU</h3>
                        </div>
                        <div className="protokol_podheader">
                          {protokol === 1 && (
                            <h2>
                              PROTOKOL POSJETA - ambulantni za period{" "}
                              {dateRange.datumOd} - {dateRange.datumDo}
                            </h2>
                          )}
                          {protokol === 2 && (
                            <h2>
                              PROTOKOL POSJETA - bolnički za period{" "}
                              {dateRange.datumOd} - {dateRange.datumDo}
                            </h2>
                          )}
                        </div>
                        <div className="protokol_table prikaz">
                          <div>Redni br.</div>
                          <div>Datum</div>
                          <div>LAB br.</div>
                          <div>LIS br.</div>
                          <div>Prezime i ime</div>
                          <div>JMBG</div>
                          <div>Participacija</div>
                          <div>Vid osig.</div>
                          <div>Odjel</div>
                          <div>Storno</div>
                        </div>
                      </>
                    )}
                  </>
                ))}
              <div className="protokol_ukupno">
                <p>UKUPNO PARTICIPACIJA:</p>
                <p>{ukupno.toFixed(2)}</p>
                <p></p>
                <p></p>
                <p></p>
              </div>
              <div className="protokol_strana">
                Strana {Math.ceil(podaci.length / 49)}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);
export default Protokol;
