import React from "react";
import { useStore } from "../../../store";
import tuv_logo from "../../../assets/tuv-austria-logo.png";
import "./ArhivaUputnica.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import dayjs from "dayjs";

const ArhivaUputnica = React.forwardRef(({ data, onHandlePrint }, ref) => {
  //console.log("data ArhivaUputnica", data);
  return (
    <Dialog maxWidth="xl" fullWidth={true} open={true} sx={{ height: "100%" }}>
      <DialogTitle sx={{ fontFamily: "Inter", fontSize: "1.15rem" }}>
        PACIJENT: {data.pacijent} - JMBG: {data.jmbg} - DATUM UPUTNICE:{" "}
        {dayjs(data.datum).format("DD.MM.YYYY")}
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <div className="rezultati" ref={ref}>
          <div className="rezultati_header">
            <div className="memorandum">
              <h3>Univerzitetsko klinički centar republike Srpske</h3>
              <h4>Zavod za kliničku laboratorijsku dijagnostiku</h4>
              <p>Tel.: +387(51) - 342 - 257</p>
              <p>
                Načelnik: Sanja Avram, mag. med. biochem, spec. med . biohemije
              </p>
              <p>informacije svaki radni dan 11 - 15 časova</p>
            </div>
            <div className="tuv">
              <img src={tuv_logo} alt="tuv-austria" />
            </div>
          </div>
          <div className="rezultati_podheader">
            <p>Upućen iz: {data.naziv_odjela}</p>
            <div className="podheader">
              <div className="podheader_partone">
                <p>
                  Ljekar: {data.prezime_dr} {data.ime_dr}
                </p>
                <p>
                  Uzorkovano:{" "}
                  {dayjs(data.datum_uzorak).format("DD.MM.YYYY HH:mm:ss")}
                </p>
              </div>
              <div className="podheader_parttwo">
                <p>
                  Primljen: {dayjs(data.datum).format("DD.MM.YYYY HH:mm:ss")}
                </p>
                <p>
                  Primio: {data.korisnik_prezime} {data.korisnik_ime}
                </p>
              </div>
            </div>

            <h3>
              {data.pacijent_prezime} {data.pacijent_ime}, pol: {data.pol},
              rođen/a: {dayjs(data.datum_rodjenja).format("DD.MM.YYYY")}
            </h3>
          </div>

          <div className="rezultati_body">
            <h3>REZULTATI</h3>
            <div className="tab_head">
              <p>Pretraga/analit</p>
              <p className="rezultat">Rezultat</p>
              <p></p>
              <p>Jedinica</p>
              <p>Ref. interval</p>
              <p>Opaska</p>
            </div>
            {data.rezultati.map((rezultat) => (
              <div className="tab_row">
                <p className={rezultat.flag !== "" ? "rezultat_bold" : ""}>
                  {rezultat.pretraga_naz}
                </p>
                <p
                  className={`rezultat ${
                    rezultat.flag !== "" ? "rezultat_bold" : ""
                  }`}
                >
                  {rezultat.rezultat}
                </p>
                <p className="rezultat_bold flag">{rezultat.flag}</p>
                <p>{rezultat.jm}</p>
                <p>{rezultat.ref}</p>
                <p>
                  {rezultat.vrsta_naziv} {rezultat.opaska}
                </p>
              </div>
            ))}
            <div className="legenda">
              <p>
                aK - arterijska krv; vK - venska krv; kK - kapilarna krv; K -
                krv; S - serum; P - plazma; U - urin; dU - dnevni urin; F -
                stolica; Lc - likvor; vP - venska plazma; ! - kritična
                vrijednost; podebljano štampano - izvan referentnog intervala
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          color="success"
          variant="contained"
          onClick={() =>
            useStore.setState({
              otvoriArhivaUputnicu: { open: false, uputnica: {} },
            })
          }
        >
          Otkaži
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => onHandlePrint()}
        >
          Štampaj
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ArhivaUputnica;
