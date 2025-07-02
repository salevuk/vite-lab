import React from "react";
import Box from "@mui/material/Box";
import "./BrPacijenata.css";

const BrPacijenata = React.forwardRef(
  ({ podaci, dateRange, memorandum }, ref) => {
    //console.log("podaci br pacijenata", podaci, Object.keys(podaci).length);
    return (
      <>
        {Object.keys(podaci).length === 0 && (
          <Box
            sx={{ display: "flex", justifyContent: "center", marginTop: "20%" }}
          >
            <h2 style={{ color: "#d8315b", width: "max-content" }}>
              Za odabrani raspon datuma nema podataka
            </h2>
          </Box>
        )}
        {Object.keys(podaci).length > 0 && (
          <div className="izvjestaj" ref={ref}>
            <div className="izvjestaj_header">
              <div dangerouslySetInnerHTML={{ __html: memorandum }}></div>
              <h3>ZAVOD ZA KLINIČKU LABORATORIJSKU DIJAGNOSTIKU</h3>
            </div>
            <div className="izvjestaj_podheader">
              <h2>
                Broj primljenih pacijenata za period {dateRange.datumOd} -{" "}
                {dateRange.datumDo}
              </h2>
            </div>
            <div className="izvjestaj_body">
              <div className="brp_ukc_body">
                <p className="brp_ukc_naziv">PRIMLJENI PACIJENTI</p>
                <div className="brp_table">
                  <div>Vrsta pac.</div>
                  <div>Hitni</div>
                  <div>Redovni</div>
                  <div>UKUPNO</div>
                </div>
                <div className="brp_row">
                  <p>AMBULANTNI</p>
                  <p>{podaci.br_hit_amb_pac}</p>
                  <p>{podaci.br_red_amb_pac}</p>
                  <p>{podaci.br_amb_pac}</p>
                </div>
                <div className="brp_row">
                  <p>BOLNIČKI</p>
                  <p>{podaci.br_hit_bol_pac}</p>
                  <p>{podaci.br_red_bol_pac}</p>
                  <p>{podaci.br_bol_pac}</p>
                </div>
                <div className="brp_ukupno">
                  <p>UKUPNO PACIJENATA:</p>
                  <p>{podaci.br_pacijenata}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);

export default BrPacijenata;
