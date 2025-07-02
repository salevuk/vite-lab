import { Fragment } from "react";
import dayjs from "dayjs";
import "./RezultatModal.css";
import Backdrop from "@mui/material/Backdrop";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const RezultatModal = ({ handleCloseRezultatModal, podaci }) => {
  //console.log("podaci u rez modal", podaci, podaci.length);
  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={true}
        //onClick={handleCloseRezultatModal}
      >
        <Dialog
          fullWidth={true}
          sx={{ minWidth: 643 }}
          maxWidth="xl"
          open={true}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseRezultatModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.error.main,
            }}
          >
            <CloseIcon />
          </IconButton>
          {podaci.length !== 0 && (
            <DialogTitle
              sx={{ fontFamily: "Inter", color: "var(--color-labos-450)" }}
            >
              Rezultati za: {podaci[0].prezime} {podaci[0].ime} -{" "}
              {podaci[0].jmbg} (lab.br: {podaci[0].lab_br} / lis.br:{" "}
              {podaci[0].lis_br})
            </DialogTitle>
          )}
          <DialogContent dividers sx={{ p: 0, overflow: "hidden" }}>
            <div className="rez_modal">
              {podaci.length === 0 && (
                <div className="rez_modal_nema_podataka">
                  <h2>Rezultati nisu dostupni</h2>
                </div>
              )}
              {podaci.length !== 0 && (
                <Fragment>
                  <h4>
                    {podaci[0].klinika_narucioca}-{podaci[0].klinika_naz}{" "}
                    {podaci[0].odjel_narucioca}-{podaci[0].odjel_naz}
                  </h4>
                  <div className="donja_tabela">
                    <div className="tabela_red tabela_header">
                      <div>Šifra pretrage</div>
                      <div>Pret. code</div>
                      <div>Naziv pretrage</div>
                      <div style={{ textAlign: "end", paddingRight: "0.5em" }}>
                        Rezultat
                      </div>
                      <div></div>
                      <div>Referentna vrijednost</div>
                      <div>Jed. mj.</div>
                      <div>Datum prijema</div>
                      <div>Datum obrade</div>
                    </div>
                    {podaci[0].rezultati.length === 0 && (
                      <div className="rez_modal_nema_podataka">
                        <h2>Detalji rezultata nisu dostupni</h2>
                      </div>
                    )}
                    {podaci[0].rezultati.length > 0 &&
                      podaci[0].rezultati.map((rezultat) => {
                        let text = rezultat.ref_vr
                          .replace("&lt;", "<")
                          .replace("&gt;", ">")
                          .split("<flag>");
                        let vrijednost = rezultat.vrijednost
                          .replace("&lt;", "<")
                          .replace("&gt;", ">");
                        let oznaka =
                          text.length > 1 ? text[1].slice(0, 1) : "N";
                        return (
                          <div
                            className="tabela_red"
                            key={rezultat.pretraga_sifra}
                          >
                            <div>{rezultat.pretraga_sifra}</div>
                            <div>{rezultat.pretraga_code}</div>
                            <div>{rezultat.pretraga_naz}</div>
                            <div
                              style={
                                oznaka === "H"
                                  ? {
                                      color: "#d8315b",
                                      fontWeight: "bold",
                                      textAlign: "end",
                                      paddingRight: "0.5em",
                                    }
                                  : oznaka === "L"
                                  ? {
                                      color: "#0077b6",
                                      fontWeight: "bold",
                                      textAlign: "end",
                                      paddingRight: "0.5em",
                                    }
                                  : {
                                      color: "black",
                                      textAlign: "end",
                                      paddingRight: "0.5em",
                                    }
                              }
                            >
                              {vrijednost}
                            </div>
                            <div
                              style={{
                                /* width: "30px", */ fontWeight: "bold",
                                textAlign: "center",
                              }}
                            >
                              {oznaka !== "N" ? oznaka : ""}
                            </div>
                            <div
                              style={
                                oznaka === "H"
                                  ? { color: "#d8315b", fontWeight: "bold" }
                                  : oznaka === "L"
                                  ? { color: "#0077b6", fontWeight: "bold" }
                                  : { color: "black" }
                              }
                            >
                              {text[0]}
                            </div>
                            <div>{rezultat.jm}</div>
                            <div>
                              {dayjs(rezultat.datum_prijema).format(
                                "DD.MM.YYYY HH:mm:ss"
                              )}
                            </div>
                            <div>
                              {dayjs(rezultat.datum_obrade).format(
                                "DD.MM.YYYY HH:mm:ss"
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </Fragment>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </Backdrop>
    </div>
  );
};

export default RezultatModal;
