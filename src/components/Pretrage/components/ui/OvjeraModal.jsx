import React from "react";
import "./OvjeraModal.css";
import Backdrop from "@mui/material/Backdrop";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
//import { format } from "date-fns";
import dayjs from "dayjs";

const OvjeraModal = React.forwardRef(
  ({ closePrintOvjera, podaciOvjere, printOvjera }, ref) => {
    //console.log("podaciOvjere", podaciOvjere);
    //let danasnjiDatum = dayjs(new Date()).format("DD.MM.YYYY");
    return (
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
          onClick={closePrintOvjera}
        >
          <Dialog
            maxWidth="md"
            fullWidth={true}
            open={true}
            sx={{ height: "100%" }}
          >
            <IconButton
              aria-label="close"
              onClick={closePrintOvjera}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.error.main,
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent dividers sx={{ p: 0 }}>
              <div className="ovjera" ref={ref}>
                <div className="ovjera_header">
                  <div>
                    <p>
                      Pacijent: {podaciOvjere.prezime} {podaciOvjere.ime} (
                      {podaciOvjere.jmbg})
                    </p>
                  </div>
                  <div className="ovjera_podheader">
                    <div>
                      <p>Registarski broj: {podaciOvjere.rbo_broj}</p>
                    </div>
                    <div>
                      <p>Šifra djelatnosti: {podaciOvjere.djelatnost}</p>
                    </div>
                  </div>
                  <div className="ovjera_podheader">
                    <div>
                      <p>
                        Datum:{" "}
                        {dayjs(podaciOvjere.datum_uputnice).format(
                          "DD.MM.YYYY"
                        )}
                      </p>
                    </div>
                    <div>
                      <p>Plaćeno: {podaciOvjere.ukupna_participacija}</p>
                    </div>
                  </div>
                </div>
                <div className="ovjera_crta"></div>
                <p className="ovjera_pacijent">Usluge:</p>
                <div className="ovjera_wrap">
                  {podaciOvjere.pretrage
                    .sort((a, b) => a.id - b.id)
                    .map((pretraga) => (
                      <div className="ovjera_pretraga">
                        <p>{pretraga.sifra_usluge}</p>
                        <p>{pretraga.pretraga_code}</p>
                        {/* <p>{pretraga.lab_sifra}</p> */}
                      </div>
                    ))}
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                color="success"
                variant="contained"
                onClick={closePrintOvjera}
              >
                Otkaži
              </Button>
              <Button color="primary" variant="contained" onClick={printOvjera}>
                Štampaj
              </Button>
            </DialogActions>
          </Dialog>
        </Backdrop>
      </div>
    );
  }
);

export default OvjeraModal;
