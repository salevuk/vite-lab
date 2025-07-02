import React from "react";
import "./UplatnicaModal.css";
import Backdrop from "@mui/material/Backdrop";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
//import { format } from "date-fns";
import dayjs from "dayjs";
const UplatnicaModal = React.forwardRef(
  ({ setOpen, pacijentPodaci, podaciUputnice, printUplatnica }, ref) => {
    const handleClosePrintModal = () => {
      setOpen(false);
    };

    /* const printUplatnica = () => {
      var DocumentContainer = document.getElementById("uplatnica");
      var WindowObject = window.open("", "PrintWindow", "resizable=yes");
      WindowObject.document.write(
        '<link rel="stylesheet" type="text/css" href="./uplatnica.css">'
      );
      WindowObject.document.write(DocumentContainer.innerHTML);
      WindowObject.document.close();
      setTimeout(function () {
        WindowObject.focus();
        WindowObject.print();
        WindowObject.close();
      }, 250);
    }; */

    //console.log("pacijentPodaci", pacijentPodaci);
    //console.log("podaciUputnice", podaciUputnice);
    let danasnjiDatum = dayjs(podaciUputnice.kreirano_datum).format(
      "DD.MM.YYYY"
    ); //dayjs(new Date()).format("DD.MM.YYYY"); //format(new Date(), "dd.MM.yyyy");
    return (
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
          onClick={handleClosePrintModal}
        >
          <Dialog sx={{ minWidth: 643 }} maxWidth="md" open={true}>
            <DialogTitle>Uplatnica</DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClosePrintModal}
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
              <div id="uplatnica" ref={ref}>
                <div className="uplatnica">
                  <div className="uplatnica_header">
                    <div>
                      <p>{pacijentPodaci.broj_protokola}</p>
                    </div>
                    <div>
                      <p>{danasnjiDatum}</p>
                    </div>
                    <div>
                      <p>{pacijentPodaci.skladiste_grupa}</p>
                    </div>
                    <div>
                      <p>
                        {podaciUputnice.status_osiguranja === 0 ||
                        podaciUputnice.komerc_placanje === 1
                          ? "05"
                          : "01"}
                      </p>
                    </div>
                  </div>
                  <div className="uplatnica_footer">
                    <p className="uplatnica_pacijent">
                      {pacijentPodaci.prezime} {pacijentPodaci.ime}
                    </p>
                    <p className="uplatnica_strana">
                      strana 1/{Math.ceil(podaciUputnice.pretrage.length / 8)}
                    </p>
                  </div>
                  {podaciUputnice.pretrage
                    .sort((a, b) => a.id - b.id)
                    .map((pretraga, index) => (
                      <>
                        <div className="uplatnica_pretraga">
                          <p>{pretraga.sifra_usluge}</p>
                          <p>{pretraga.naziv}</p>
                          <p>{pretraga.kolicina}</p>
                          <p>
                            {/*podaciUputnice.vrsta === 2
                              ? (0).toFixed(2)
                              : podaciUputnice.komerc_placanje === 1
                              ? pretraga.mpc_cijena.toFixed(2)
                              : podaciUputnice.po_ugovoru === 1 ||
                                podaciUputnice.bez_participacije === 1
                              ? (0).toFixed(2)
                              : podaciUputnice.status_osiguranja === 1
                              ? pretraga.fond_participacija.toFixed(2)
                              : pretraga.mpc_cijena.toFixed(2)*/}
                            {podaciUputnice.vrsta === 1
                              ? podaciUputnice.komerc_placanje === 1
                                ? pretraga.mpc_cijena.toFixed(2)
                                : podaciUputnice.po_ugovoru === 1 ||
                                  podaciUputnice.bez_participacije === 1
                                ? (0).toFixed(2)
                                : podaciUputnice.status_osiguranja === 1
                                ? pretraga.fond_participacija.toFixed(2)
                                : pretraga.mpc_cijena.toFixed(2)
                              : (0).toFixed(2)}
                          </p>
                        </div>
                        {index > 0 && (index + 1) % 8 === 0 && (
                          <>
                            <div className="pagebreak preskok"></div>
                            <div className="uplatnica_header">
                              <div>
                                <p>{pacijentPodaci.broj_protokola}</p>
                              </div>
                              <div>
                                <p>{danasnjiDatum}</p>
                              </div>
                              <div>
                                <p>{pacijentPodaci.skladiste_grupa}</p>
                              </div>
                              <div>
                                <p>
                                  {podaciUputnice.status_osiguranja === 0 ||
                                  podaciUputnice.komerc_placanje === 1
                                    ? "05"
                                    : "01"}
                                </p>
                              </div>
                            </div>

                            <div className="uplatnica_footer">
                              <p className="uplatnica_pacijent">
                                {pacijentPodaci.prezime} {pacijentPodaci.ime}
                              </p>
                              <p className="uplatnica_strana">
                                strana {Math.floor((index + 1) / 8) + 1}/
                                {Math.ceil(podaciUputnice.pretrage.length / 8)}
                              </p>
                            </div>
                          </>
                        )}
                      </>
                    ))}
                  <div className="uplatnica_crta"></div>
                  <p className="uplatnica_cijena">
                    {podaciUputnice.vrsta === 2
                      ? (0).toFixed(2)
                      : podaciUputnice.ukupna_participacija.toFixed(2)}
                  </p>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                color="success"
                variant="contained"
                onClick={handleClosePrintModal}
              >
                Otkaži
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={printUplatnica}
              >
                Štampaj
              </Button>
            </DialogActions>
          </Dialog>
        </Backdrop>
      </div>
    );
  }
);

export default UplatnicaModal;
