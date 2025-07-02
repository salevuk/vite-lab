import React from "react";
import Box from "@mui/material/Box";
import "./UslugeKIO.css";

const UslugeKIO = React.forwardRef(({ podaci, dateRange, memorandum }, ref) => {
  //console.log("PODACI KIO", podaci);
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
              PRUŽENE USLUGE - grupisano za period {dateRange.datumOd} -{" "}
              {dateRange.datumDo}
            </h2>
          </div>
          <div className="izvjestaj_body">
            {podaci.map((tipUputnice) => (
              <>
                <p className="kio_klinika">{tipUputnice.vrsta}</p>
                {tipUputnice.klinike.map((klinika) => (
                  <div key={klinika.klinika} className="kio_klinika_body">
                    <p className="kio_klinika_naziv">
                      KLINIKA: {klinika.klinika} - {klinika.klinika_naziv}
                    </p>
                    {klinika.odjeli.map((odjel) => (
                      <div key={odjel.odjel}>
                        <p className="kio_odjel_naziv">
                          Odjel: {odjel.odjel} - {odjel.odjel_naziv}{" "}
                        </p>
                        <div className="kio_table">
                          <div>Šifra usluge</div>
                          <div>Naziv usluge</div>
                          <div>Br. usluga</div>
                          <div>Iznos</div>
                        </div>
                        {odjel.usluge.map((usluga, index) => (
                          <div
                            key={usluga.sifra_usluge}
                            className={`kio_row ${
                              index === odjel.usluge.length - 1
                                ? "last-row"
                                : ""
                            }`}
                          >
                            <p>{usluga.sifra_usluge}</p>
                            <p>{usluga.naziv}</p>
                            <p>{usluga.broj_usluga}</p>
                            <p>{usluga.ukupan_iznos.toFixed(2)}</p>
                          </div>
                        ))}
                        <div className="kio_ukupno">
                          <p>UKUPNO ZA ODJEL: {odjel.odjel}</p>
                          <p>{odjel.broj_usluga}</p>
                          <p>{odjel.ukupno_iznos.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    {
                      <div className="kio_ukupno">
                        <p>UKUPNO ZA KLINIKU: {klinika.klinika}</p>
                        <p>{klinika.broj_usluga}</p>
                        <p>{klinika.ukupno_iznos.toFixed(2)}</p>
                      </div>
                    }
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
      )}
    </>
  );
});

export default UslugeKIO;
