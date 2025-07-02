import React from "react";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import "./Storno.css";

const Storno = React.forwardRef(({ podaci, dateRange, memorandum }, ref) => {
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
              Pregled storniranih zahtjeva za period {dateRange.datumOd} -{" "}
              {dateRange.datumDo}
            </h2>
          </div>
          <div className="izvjestaj_body">
            <div className="str_table">
              <div>Redni br.</div>
              <div>Lab. br.</div>
              <div>Pacijent</div>
              <div>JMBG</div>
              <div>Datum prijema</div>
              <div>Datum storno</div>
              <div>Personal/Korisnik</div>
              <div>Razlog storniranja</div>
            </div>
            {podaci.map((uputnica) => (
              <div key={uputnica.lab_br} className="str_row">
                <p>{podaci.indexOf(uputnica) + 1}</p>
                <p>{uputnica.lab_br}</p>
                <p>
                  {uputnica.pac_prezime} {uputnica.pac_ime}
                </p>
                <p>{uputnica.pac_jmbg}</p>
                <p>
                  {dayjs(uputnica.datum_prijema).format("DD.MM.YYYY HH:mm:ss")}
                </p>
                <p>
                  {dayjs(uputnica.datum_storno).format("DD.MM.YYYY HH:mm:ss")}
                </p>
                <p>
                  {uputnica.korisnik_prezime} {uputnica.korisnik_ime}
                </p>
                <p>{uputnica.razlog_storno}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
});

export default Storno;
